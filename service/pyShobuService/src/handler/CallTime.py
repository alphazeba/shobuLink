from dataAccess import GameTable
from handler.eventIO.eventValidation import getValidatedStringValue
from logic import Game
from handler_websocket.UpdatePlayers import updateSubscribedPlayers

# this is an endpoint that users can call when they think a game is out of time
def CallTime(event, context, props):
    loginToken = getValidatedStringValue( "loginToken", event )
    gameId = getValidatedStringValue( "gameId", event )
    gameTable = props['gameTable']
    game = GameTable.getGame( gameTable, gameId )
    previousMoveTimestamp = Game.getLatestMoveTimestamp(game)
    if Game.isGameOutOfTime(game):
        Game.setTimeout(game)
    else:
        return buildResult(False)
    GameTable.saveGame( gameTable, game )
    gameUpdate = Game.toGetGameOutputForm(game, previousMoveTimestamp)
    updateSubscribedPlayers(gameUpdate, props)
    return buildResult(True)

def buildResult(gameTimedOut):
    return {
        "gameTimedOut": gameTimedOut
    }