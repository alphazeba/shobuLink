

import logic.Game as Game
import dataAccess.GameTable as GameTable
from handler.eventIO.eventValidation import getValidatedStringValue
from handler.PlayMove import updateSubscribedPlayers

def JoinGame( event, context, props ):
    loginToken = getValidatedStringValue( "loginToken", event )
    playerId = getValidatedStringValue( "userId", event )
    playerName = getValidatedStringValue( "userName", event )
    gameId = getValidatedStringValue( "gameId", event )
    # verify logged in 
    # TODO
    # do stuff.
    gameTable = props['gameTable']
    game = GameTable.getGame( gameTable, gameId )
    side = Game.joinGame(game, playerId, playerName )
    GameTable.saveGame( gameTable, game )
    gameUpdate = {
        "type": "gameUpdate",
        "game": Game.toGetGameOutputForm(game, 0),
    }
    updateSubscribedPlayers(gameUpdate, props)
    return {
        "side": side
    }