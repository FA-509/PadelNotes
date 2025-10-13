import azure.functions as func
import uuid
import json

app = func.FunctionApp(http_auth_level=func.AuthLevel.ANONYMOUS)

@app.route(route="importgame")
@app.cosmos_db_output(arg_name="GameData", database_name="PadelNotesDB", 
    container_name="ImportGame", connection="CosmosDBConnectionString")

def importgame(req: func.HttpRequest, GameData: func.Out[func.Document]) -> func.HttpResponse:
        json_content = req.get_json()
        unique_id = str(uuid.uuid4())
        json_content["id"] = unique_id

        GameData.set(func.Document.from_dict(json_content))

        return func.HttpResponse("Game Imported to Database")


@app.route(route="full_match_history")
@app.cosmos_db_input(arg_name="match_history", database_name="PadelNotesDB", 
    container_name="ImportGame", connection="CosmosDBConnectionString")

def full_match_history(req: func.HttpRequest, match_history: func.DocumentList) -> func.HttpResponse:
        return func.HttpResponse(json.dumps(match_history, default=vars))

@app.route(route="find_game_via_id")
@app.cosmos_db_input(arg_name="find_game", database_name="PadelNotesDB", 
    container_name="ImportGame", connection="CosmosDBConnectionString")

def find_game(req: func.HttpRequest, find_game: func.DocumentList) -> func.HttpResponse:
        id = req.params.get("id")
        for game in find_game:
               if id == game["id"]:
                       return func.HttpResponse(json.dumps(game, default=vars))
  

