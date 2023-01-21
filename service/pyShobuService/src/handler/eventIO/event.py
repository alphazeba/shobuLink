
import util.jsonHelp as json

def buildResponse( responsObj, statusCode ):
    return {
        "statusCode": statusCode,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        },
        "body": json.dumps( responsObj )
    }