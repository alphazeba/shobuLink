
from handler.eventIO.eventValidation import getValidatedStringValue
import dataAccess.GameTable as GameTable
import dataAccess.ConnectionTable as ConnectionTable
import logic.Game as Game


def PlayMove( event, context, props ):
    loginToken = getValidatedStringValue( "loginToken", event )
    playerId = getValidatedStringValue( "userId", event )
    gameId = getValidatedStringValue( "gameId", event )
    fullMove = getValidatedStringValue( "move", event )
    gameTable = props['gameTable']
    game = GameTable.getGame( gameTable, gameId )
    # get current most recent timestamp
    previousMoveTimestamp = Game.getLatestMoveTimestamp(game)
    playerSide = Game.getPlayerSide( game, playerId )
    Game.playMove( game, playerSide, fullMove )
    GameTable.saveGame( gameTable, game )
    gameUpdate = Game.toGetGameOutputForm(game, previousMoveTimestamp)
    # send update to subscribed players on websocket.
    updateSubscribedPlayers(gameUpdate, props)
    return {
        "game": gameUpdate
    }

def updateSubscribedPlayers(gameUpdate, props):
    gameId = Game.getId(gameUpdate)
    print("grabbing connections on game: " + gameId)
    connectionIds = ConnectionTable.getConnectedPlayers(props['connectionTable'], gameId)
    print("number of connections: " + str(len(connectionIds)))
    connectionClient = props['connectionClient']
    playerUpdate = {
        "type": "gameUpdate",
        "game": gameUpdate
    }
    for connectionId in connectionIds:
        connectionClient.sendToConnection(connectionId, playerUpdate)
