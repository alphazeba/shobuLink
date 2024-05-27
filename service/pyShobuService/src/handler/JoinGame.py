

import logic.Game as Game
import dataAccess.GameTable as GameTable
import dataAccess.OpenGameTable as OpenGameTable
from handler.eventIO.eventValidation import getValidatedStringValue
from handler_websocket.UpdatePlayers import updateSubscribedPlayers

def JoinGame( event, context, props ):
    loginToken = getValidatedStringValue( "loginToken", event )
    playerId = getValidatedStringValue( "userId", event )
    playerName = getValidatedStringValue( "userName", event )
    gameId = getValidatedStringValue( "gameId", event )
    # verify logged in 
    # TODO
    # do stuff.
    gameTable = props['gameTable']
    openGameTable = props['openGameTable']
    game = GameTable.getGame( gameTable, gameId )
    side = Game.joinGame(game, playerId, playerName )
    GameTable.saveGame( gameTable, game )
    OpenGameTable.closeOpenGame( openGameTable, gameId )
    updateSubscribedPlayers(
        Game.toGetGameOutputForm(game, 0), # get full game state
        props)
    return {
        "side": side
    }