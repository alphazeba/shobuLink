
from handler.eventIO.event import buildResponse
from handler.eventIO.eventValidation import getValidatedMapKey
from handler.CreateGame import CreateGame
from handler.GetGame import GetGame
from handler.JoinGame import JoinGame
from handler.PlayMove import PlayMove
from exception.ExceptionToReturn import ExceptionToReturn
import util.jsonHelp as json
import handler.eventIO.ddb as DDB
import dataAccess.GameTable as GameTable

_props = None

def lambda_handler( event, context ):
    event = json.loads( event['body'] )
    props = getProps()
    try:
        eventType = getValidatedMapKey( 'type', event, routes )
        response = None
        if eventType in routes:
            response = routes[eventType]( event, context, props )
        return buildResponse( response, 200 )
    except ExceptionToReturn as e:
        return e.getResponse()

routes = {
    "CreateGame": CreateGame,
    "GetGame": GetGame,
    "JoinGame": JoinGame,
    "PlayMove": PlayMove
}

def initProps():
    ddb = DDB.initProd()
    gameTable = GameTable.newGameTable( ddb )
    return {
        "ddb": ddb,
        "gameTable": gameTable
    }

def getProps():
    global _props
    if _props == None:
        _props = initProps()
    return _props