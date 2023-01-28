
import dataAccess.GameTable as GameTable
import logic.Game as Game
from handler.eventIO.eventValidation import getValidatedStringValue, getOptionalValue

def GetGame( event, context ):
    gameId = getValidatedStringValue( 'gameId', event )
    latestTimestamp = getOptionalValue( "latestTimestamp", event, 0 )
    # get game
    game = GameTable.getGame( gameId )
    # return game
    print( game )
    return {
        "game": Game.toGetGameOutputForm( game, latestTimestamp )
    }