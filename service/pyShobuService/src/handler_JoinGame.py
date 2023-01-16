

import logic_Game as Game
import dataAccess_GameTable as GameTable
from io_event_validation import getValidatedStringValue

def JoinGame( event, context ):
    loginToken = getValidatedStringValue( "loginToken", event )
    playerId = getValidatedStringValue( "userId", event )
    playerName = getValidatedStringValue( "userName", event )
    gameId = getValidatedStringValue( "gameId", event )
    # verify logged in 
    # TODO
    # do stuff.
    game = GameTable.getGame( gameId )
    side = Game.joinGame(game, playerId, playerName )
    GameTable.saveGame( game )
    return {
        "side": side
    }