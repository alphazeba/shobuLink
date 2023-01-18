
import util.jsonHelp as json

def buildResponse( responsObj, statusCode ):
    return {
        "statusCode": statusCode,
        "headers": {
            "Content-Type": "application/json"
        },
        "body": json.dumps( responsObj )
    }