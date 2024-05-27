import logic.Game as Game
import dataAccess.OpenGameTable as OpenGameTable
from handler.eventIO.eventValidation import getValidatedStringValue

def GetOpenGames( event, context, props ):
    openGameTable = props["openGameTable"]
    result = OpenGameTable.listOpenGames(openGameTable)
    return {
        "games": [
            Game.toOpenGameOutputForm(
                openGameTableGame
            ) for openGameTableGame in result
        ]
    }

