
def buildResponse( responsObj, statusCode ):
    return {
        "statusCode": statusCode,
        "headers": {
            "Content-Type": "application/json"
        },
        "body": responsObj
    }