
import util.jsonHelp as json
import os
corsOrigin = "qruosfadoiuasdfjjl"
try:
    corsOrigin = os.environ['corsOrigin']
except Exception as e:
    print( "failed to load corsOrigin envionrment variable, if you are testing this is fine." )

def buildResponse( responsObj, statusCode ):
    return {
        "statusCode": statusCode,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": corsOrigin,
        },
        "body": json.dumps( responsObj )
    }