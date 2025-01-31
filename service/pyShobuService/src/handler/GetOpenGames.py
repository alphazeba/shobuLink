import logic.Game as Game
import dataAccess.GameTable as GameTable
import dataAccess.OpenGameTable as OpenGameTable
import util.time as time
from handler.eventIO.eventValidation import getOptionalValidatedOptionValue, getValidatedStringValue

_yes = "yes"
_no = "no"
CULL_OLD_GAMES_OPTIONS = [
    _yes,
    _no
]

def GetOpenGames( event, context, props ):
    openGameTable = props["openGameTable"]
    openGameTableGames = OpenGameTable.listOpenGames(openGameTable)
    result = filterAndCullOldGames(props, openGameTableGames)
    return {
        "games": [
            Game.toOpenGameOutputForm(
                openGameTableGame
            ) for openGameTableGame in result
        ]
    }

def filterAndCullOldGames(props, openGameTableGames):
    output = []
    for openGameTableGame in openGameTableGames:
        if isGameOld(openGameTableGame):
            cancelGame(props, openGameTableGame)
        else:
            output.append(openGameTableGame)
    return output

def cancelGame(props, openGameTableGame):
    openGameTable = props["openGameTable"]
    gameTable = props['gameTable']
    gameId = Game.getId(openGameTableGame)
    print("deleting game " + gameId)
    OpenGameTable.closeOpenGame(openGameTable, gameId)
    GameTable.deleteGame(gameTable, gameId)

ONE_DAY_MS = 86400000
def isGameOld(openGameTableGame):
    startTimeMs = Game.getStartTime(openGameTableGame)
    return time.getNowMs() > (startTimeMs + ONE_DAY_MS)
