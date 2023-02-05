
from handler.eventIO.eventValidation import getValidatedStringValue
import dataAccess.GameTable as GameTable
import logic.Game as Game


def PlayMove( event, context, props ):
    loginToken = getValidatedStringValue( "loginToken", event )
    playerId = getValidatedStringValue( "userId", event )
    gameId = getValidatedStringValue( "gameId", event )
    fullMove = getValidatedStringValue( "move", event )
    gameTable = props['gameTable']
    game = GameTable.getGame( gameTable, gameId )
    playerSide = Game.getPlayerSide( game, playerId )
    Game.playMove( game, playerSide, fullMove )
    GameTable.saveGame( gameTable, game )
    return {
        "game": game
    }