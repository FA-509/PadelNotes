import azure.functions as func
import uuid

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


