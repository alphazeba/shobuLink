from handler.eventIO.eventValidation import getValidatedStringValue
import dataAccess.ConnectionTable as ConnectionTable
from handler.eventIO.event import buildResponse

def SubscribeToGame(connectionId, body, props):
    gameId = getValidatedStringValue("gameId", body)
    print("subscribing player connection: " + connectionId + " to gameid: " + gameId)
    ConnectionTable.connectPlayer(props['connectionTable'], connectionId, gameId)
