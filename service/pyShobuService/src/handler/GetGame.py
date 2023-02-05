
import dataAccess.GameTable as GameTable
import logic.Game as Game
from handler.eventIO.eventValidation import getValidatedStringValue, getOptionalValue

def GetGame( event, context, props ):
    gameId = getValidatedStringValue( 'gameId', event )
    latestTimestamp = getOptionalValue( "latestTimestamp", event, 0 )
    # get game
    gameTable = props['gameTable']
    game = GameTable.getGame( gameTable, gameId )
    # return game
    print( game )
    return {
        "game": Game.toGetGameOutputForm( game, latestTimestamp )
    }