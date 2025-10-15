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
  

@app.route(route="edit_game")
@app.cosmos_db_input(arg_name="read_game", database_name="PadelNotesDB", 
    container_name="ImportGame", connection="CosmosDBConnectionString")
@app.cosmos_db_output(arg_name="update_game", database_name="PadelNotesDB", 
    container_name="ImportGame", connection="CosmosDBConnectionString")

def edit_game(req: func.HttpRequest, read_game: func.DocumentList, update_game: func.Out[func.Document]) -> func.HttpResponse:
        id = req.params.get("id")
        json_content = req.get_json()
        document_found = False
        for game in read_game:
                if id == game["id"]:
                        document_found = True
                        for key, value in json_content.items():
                               if value != game[key]:
                                      game[key] = value
                        update_game.set(game)
        if document_found == True:
                job_status = "Matching Document Found"
        else:
                job_status = "No Matching Documents Found"
        
        return func.HttpResponse(job_status)
                        





        