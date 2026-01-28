import azure.functions as func
import uuid
import os
import json
import requests
import base64
import time
from azure.cosmos import CosmosClient

URL = os.environ["URL"]
KEY = os.environ["KEY"]
client = CosmosClient(URL, credential=KEY)
DATABASE_NAME = 'PadelNotesDB'
database = client.get_database_client(DATABASE_NAME)
CONTAINER_NAME = 'ImportGame'
container = database.get_container_client(CONTAINER_NAME)
last_challenge_container = database.get_container_client("LastChallengeGenerationTime")
API_ENDPOINT = "https://uksouth.api.cognitive.microsoft.com/openai/deployments/gpt-4o-mini/chat/completions?api-version=2025-01-01-preview"
AI_KEY = os.environ["OPENAI_KEY"]

app = func.FunctionApp(http_auth_level=func.AuthLevel.FUNCTION)

def generate_challenge_ai(user_id,bad_feedback):
        if "content" not in bad_feedback:
                return "Invalid Request"
        if not isinstance(bad_feedback["content"], str):
                return "Invalid Request"
        if bad_feedback["content"].strip() == "":
                return "Invalid Request"
        ai_body = {
                "messages": [
                                { 
                                        "role": "system",
                                         "content": "You are analysing padel match feedback to coach a player.\n\nI will give you up to 5 feedback notes from the player’s last matches.\n\nYour tasks:\n1. Identify all weaknesses mentioned (if any).\n2. Even if a weakness appears multiple times, determine which SINGLE weakness is the most impactful — the one that, if improved, would most benefit the player’s overall match performance.\n3. Explain why this weakness matters for match performance.\n4. Create a specific match-focused challenge the player should attempt in their next match.\n\nIMPORTANT RULES:\n- If the feedback contains no weaknesses (only positive feedback), you MUST still create a challenge. In that case, set primaryWeakness to \"None noted\" (capital N) or a neutral 1–3 word focus (e.g., \"Consistency\", \"Shot selection\", \"Positioning\").\n- The challenge must be match-specific (not drills or practice routines).\n- The challenge must focus on decision-making, positioning, timing, or tactical choices — not mechanical tips like adding spin or power.\n- The challenge must be actionable during live gameplay.\n- Use the exact output format below.\n- Keep the response concise and directly tied to match situations.\n- Output ONLY valid JSON with the following keys and make sure to captalise the first letter of primary weakness:\n\n{\n  \"primaryWeakness\": \"1–3 words\",\n  \"whyItMatters\": \"1–3 sentences\",\n  \"challenge\": \"1–2 sentences, clear and specific\"\n}\n"
                                        },
                                        {
                                                "role": "user",
                                                "content": bad_feedback["content"]
                                                }
                                                ]
                                                }
        ai_response = requests.post(API_ENDPOINT, json = ai_body, headers = {"api-key": AI_KEY,"Content-Type":"application/json"})
        if ai_response.status_code == 200:
                ai_response_json = ai_response.json()
                if "choices" not in ai_response_json:
                        return "Invalid AI Response"
                if not isinstance(ai_response_json["choices"], list):
                        return "Invalid AI Response"
                elif ai_response_json["choices"] == []:
                        return "Invalid AI Response"
                elif "message" not in ai_response_json["choices"][0]:
                        return "Invalid AI Response"
                elif "content" not in ai_response_json["choices"][0]["message"]:
                        return "Invalid AI Response"
                
                return (ai_response_json["choices"][0]["message"]["content"])
        return "AI Currently Offline"




def last_challenge_generated_check(user_id):
        for item in last_challenge_container.query_items(
        query='SELECT * FROM r WHERE r.userId = @userId',
        parameters=[
        dict(name='@userId', value=user_id)]):
                        return item
        return None

def last_challenge_generate_new_timestamp(user_id):
        new_document = {}
        new_document["id"] = user_id
        new_document["userId"] = user_id
        new_document["lastChallengeGeneratedTime"] = time.time()
        last_challenge_container.upsert_item(new_document)
        
                

def get_user_id(headers_dict):
        x_ms_client_principal_base64 = headers_dict["x-ms-client-principal"]
        decoded_bytes = base64.b64decode(x_ms_client_principal_base64)
        decoded_x_ms_client_principal = decoded_bytes.decode('utf-8')
        decoded_x_ms_client_principal_dict = json.loads(decoded_x_ms_client_principal)
        return(decoded_x_ms_client_principal_dict["userId"])

@app.route(route="get_user_match_history")
def get_user_match_history(req: func.HttpRequest) -> func.HttpResponse:
        headers_dict = dict(req.headers)
        user_id = get_user_id(headers_dict)
        player_match_history = []
        for item in container.query_items(
        query='SELECT * FROM r WHERE r.playerId = @userId',
        parameters=[
        dict(name='@userId', value=user_id)]):
                player_match_history.append(item)
        return func.HttpResponse(json.dumps(player_match_history, indent=True))

@app.route(route="import_game")
@app.cosmos_db_output(arg_name="GameData", database_name="PadelNotesDB", 
    container_name="ImportGame", connection="CosmosDBConnectionString")

def importgame(req: func.HttpRequest, GameData: func.Out[func.Document]) -> func.HttpResponse:
        user_id = get_user_id(dict(req.headers))
        json_content = req.get_json()
        unique_id = str(uuid.uuid4())
        json_content["playerId"] = user_id
        json_content["id"] = unique_id

        GameData.set(func.Document.from_dict(json_content))

        return func.HttpResponse("Game Imported to Database")

@app.route(route="find_game_via_id")
def find_game(req: func.HttpRequest) -> func.HttpResponse:
        headers_dict = dict(req.headers)
        user_id = get_user_id(headers_dict)
        id = req.params.get("id")
        for item in container.query_items(
        query='SELECT * FROM r WHERE r.playerId = @userId AND r.id = @matchId',
        parameters=[{'name': '@matchId', "value": id}, {'name': '@userId', "value": user_id}]):
                return func.HttpResponse(json.dumps(item, indent=True))
        

@app.route(route="edit_game")
def edit_game(req: func.HttpRequest) -> func.HttpResponse:
        job_status = None
        user_id = get_user_id(dict(req.headers))
        match_id = req.params.get("id")
        json_content = req.get_json()
        for item in container.query_items(query='SELECT * FROM r WHERE r.playerId = @userId AND r.id = @matchId',parameters=[{'name': '@matchId', "value": match_id}, {'name': '@userId', "value": user_id}]):
                json_content["playerId"] = user_id
                json_content["id"] = match_id
                container.upsert_item(json_content)
                job_status = "Matching Document Replaced"
                break                 
        if job_status == None:
                job_status = "No Matching Documents Found"
        return func.HttpResponse(job_status)

@app.route(route="delete_game")
def delete_game(req: func.HttpRequest) -> func.HttpResponse:
        job_status = None
        user_id = get_user_id(dict(req.headers))
        match_id = req.params.get("id")
        for item in container.query_items(query='SELECT * FROM r WHERE r.playerId = @userId AND r.id = @matchId',parameters=[{'name': '@matchId', "value": match_id}, {'name': '@userId', "value": user_id}]):
                container.delete_item(match_id, partition_key=user_id)
                job_status = "Document Deleted"
                break
        if job_status == None:
                job_status = "No Matching Documents Found"
        return func.HttpResponse(job_status)
                
@app.route(route="generate_challenge")
def generate_challenge(req: func.HttpRequest) -> func.HttpResponse:
        bad_feedback = req.get_json()
        user_id = get_user_id(dict(req.headers))
        last_generation_time_dict = last_challenge_generated_check(user_id)
        if last_generation_time_dict is None:
                last_challenge_generate_new_timestamp(user_id)
                return func.HttpResponse(generate_challenge_ai(user_id,bad_feedback))
        else:
                last_time = last_generation_time_dict["lastChallengeGeneratedTime"]
                if time.time() - last_time > 1:
                        new_document = {}
                        new_document["id"] = user_id
                        new_document["userId"] = user_id
                        new_document["lastChallengeGeneratedTime"] = time.time()
                        last_challenge_container.upsert_item(new_document)
                        return func.HttpResponse (generate_challenge_ai(user_id,bad_feedback))
                else:
                        return func.HttpResponse("Rate Limit Has Been Reached")

