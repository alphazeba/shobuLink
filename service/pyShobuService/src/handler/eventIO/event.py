
import util.jsonHelp as json
import os

corsOrigin = os.environ['corsOrigin']

def buildResponse( responsObj, statusCode ):
    return {
        "statusCode": statusCode,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": corsOrigin,
        },
        "body": json.dumps( responsObj )
    }