import logic.Game as Game
import dataAccess.GameTable as GameTable
import dataAccess.OpenGameTable as OpenGameTable
from handler.eventIO.eventValidation import getValidatedOptionValue, getValidatedRangeValue, getValidatedStringValue, getOptionalValidatedOptionValue
import data.playerSide as PlayerSide

# if game is pending a user can cancel their game

def CancelGame( event, context, props ):
    loginToken = getValidatedStringValue( "loginToken", event )
    playerId = getValidatedStringValue( "userId", event )
    gameId = getValidatedStringValue( "gameId", event )
    gameTable = props['gameTable']
    openGameTable = props['openGameTable']
    # check if the game is present as an open game
    openGame = None
    try:
        openGame = OpenGameTable.getOpenGame(openGameTable, gameId)
    except:
        return respondGenericClientIssue()
    # if the player is in the game,
    if playerId != getPlayerId(openGame):
        return respondGenericClientIssue()
    print("deleting pending game" + gameId)
    OpenGameTable.closeOpenGame(openGameTable, gameId)
    GameTable.deleteGame(gameTable, gameId)
    return respond(True, "Game was cancelled")

_buId = "buId"
_wuId = "wuId"
def getPlayerId(openGame):
    if _buId in openGame:
        return openGame[_buId]
    return openGame[_wuId]

def respond(success, reason):
    return {
        "gameCancelled": success,
        "reason": reason
    }

def respondGenericClientIssue():
    return respond(False, "Game is not cancellable")