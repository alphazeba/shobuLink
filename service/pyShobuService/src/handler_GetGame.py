
import dataAccess_GameTable as GameTable
from io_event_validation import getValidatedStringValue

def GetGame( event, context ):
    gameId = getValidatedStringValue( 'gameId', event )
    # get game
    game = GameTable.getGame( gameId )
    # return game
    print( game )
    return {
        "game": game
    }