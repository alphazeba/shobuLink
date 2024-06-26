
from handler.eventIO.eventValidation import getValidatedStringValue
from dataAccess import GameTable
from logic import Game
from handler_websocket.UpdatePlayers import updateSubscribedPlayers


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
    if Game.isGameOutOfTime(game):
        Game.setTimeout(game)
    else:
        Game.playMove( game, playerSide, fullMove )
    GameTable.saveGame( gameTable, game )
    gameUpdate = Game.toGetGameOutputForm(game, previousMoveTimestamp)
    # send update to subscribed players on websocket.
    updateSubscribedPlayers(gameUpdate, props)
    return {
        "game": gameUpdate
    }
