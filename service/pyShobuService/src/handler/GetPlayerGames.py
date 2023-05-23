import dataAccess.GameTable as GameTable
import logic.Game as Game
from handler.eventIO.eventValidation import getValidatedStringValue

def GetPlayerGames( event, context, props ):
    playerId = getValidatedStringValue( 'userId', event )
    gameTable = props['gameTable']
    results = GameTable.queryGamesByPlayerId( gameTable, playerId )
    return {
        "games": [ Game.toGetPlayerGamesOutputForm( gameTablePreview ) for gameTablePreview in results ]
    }