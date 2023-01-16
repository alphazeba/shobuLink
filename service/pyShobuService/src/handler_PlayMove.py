
from io_event_validation import getValidatedStringValue
import dataAccess_GameTable as GameTable
import logic_Game as Game


def PlayMove( event, context ):
    loginToken = getValidatedStringValue( "loginToken", event )
    playerId = getValidatedStringValue( "userId", event )
    gameId = getValidatedStringValue( "gameId", event )
    fullMove = getValidatedStringValue( "move", event )

    game = GameTable.getGame( gameId )
    playerSide = Game.getPlayerSide( game, playerId )
    Game.playMove( game, playerSide, fullMove )
    GameTable.saveGame( game )
    return {
        "game" : game
    }