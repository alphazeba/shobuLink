import dataAccess.ConnectionTable as ConnectionTable
import logic.Game as Game
from handler_websocket.ConnectionClient import ConnectionClient

def getConnectionClient(props) -> ConnectionClient:
    return props['connectionClient']

def updateSubscribedPlayers(gameUpdate, props):
    gameId = Game.getId(gameUpdate)
    print("grabbing connections on game: " + gameId)
    connectionIds = ConnectionTable.getConnectedPlayers(props['connectionTable'], gameId)
    print("number of connections: " + str(len(connectionIds)))
    connectionClient = getConnectionClient(props)
    playerUpdate = {
        "type": "gameUpdate",
        "game": gameUpdate
    }
    for connectionId in connectionIds:
        connectionClient.sendToConnection(connectionId, playerUpdate)
