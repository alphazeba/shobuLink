
import dataAccess.GameTable as GameTable
from eventIo.eventValidation import getValidatedStringValue

def GetGame( event, context ):
    gameId = getValidatedStringValue( 'gameId', event )
    # get game
    game = GameTable.getGame( gameId )
    # return game
    print( game )
    return {
        "game": game
    }