from handler.eventIO.eventValidation import getValidatedStringValue
import dataAccess.ConnectionTable as ConnectionTable
from handler.eventIO.event import buildResponse

def SubscribeToGame(connectionId, body, props):
    gameId = getValidatedStringValue("gameId", body)
    ConnectionTable.connectPlayer(props['connectionTable'], connectionId, gameId)
    return buildResponse('success', 200)

def Test(connectionId, body, props):
    print("running test")
    connectionClient = props['connectionClient']
    connectionClient.sendToConnection(connectionId, {
        "test": "this out",
        "also": "this",
    })
    print(body)
    print(connectionId)