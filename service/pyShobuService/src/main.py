from handler.eventIO.event import buildResponse
from handler.eventIO.eventValidation import getValidatedMapKey, getValidatedStringValue
from handler.CreateGame import CreateGame
from handler.GetGame import GetGame
from handler.GetPlayerGames import GetPlayerGames
from handler.GetPlayerActiveGames import GetPlayerActiveGames
from handler.JoinGame import JoinGame
from handler.PlayMove import PlayMove
from handler.GetOpenGames import GetOpenGames
from handler_websocket.SubscribeToGame import SubscribeToGame
from exception.ExceptionToReturn import ExceptionToReturn
from handler.CallTime import CallTime
import util.jsonHelp as json
import handler.eventIO.ddb as DDB
import dataAccess.GameTable as GameTable
import dataAccess.ConnectionTable as ConnectionTable
import dataAccess.OpenGameTable as OpenGameTable
from handler_websocket.ConnectionClient import ConnectionClient

_props = None

def lambda_handler( event, context ):
    event = json.loads( event['body'] )
    props = getProps()
    try:
        eventType = getValidatedMapKey( 'type', event, routes )
        response = routes[eventType]( event, context, props )
        return buildResponse( response, 200 )
    except ExceptionToReturn as e:
        return e.getResponse()

routes = {
    "CreateGame": CreateGame,
    "GetGame": GetGame,
    "GetPlayerGames": GetPlayerGames,
    "GetPlayerActiveGames": GetPlayerActiveGames,
    "JoinGame": JoinGame,
    "PlayMove": PlayMove,
    "CallTime": CallTime,
    "GetOpenGames": GetOpenGames,

}

def lambda_websocket_handler( event, context ):
    # event is different here, because we are not parsing the body like is being done in the lambda_handler
    props = getProps()
    requestContext = getOrExcept( event, 'requestContext' )
    print("logging event")
    print(event)
    try:
        eventType = getValidatedMapKey( 'eventType', requestContext, websocketEventTypes )
        response = websocketEventTypes[eventType]( event, context, props )
        return buildResponse( response, 200 )
    except ExceptionToReturn as e:
        return e.getResponse()

def testConnect(event, context, props):
    # i don't know that there is anything we actually want to do on a connect event.
    return buildResponse('success', 200)

def testDisconnect(event, context, props):
    connectionId = getConnectionId(event)
    ConnectionTable.disconnectPlayer(props['connectionTable'], connectionId)
    return buildResponse('success', 200)

def handleWebSocketMessage(event, context, props):
    connectionId = getConnectionId(event)
    body = json.loads(event['body'])
    try: 
        messageType = getValidatedMapKey('type', body, websocketMessageTypes)
        response = websocketMessageTypes[messageType](connectionId, body, props)
        return buildResponse(response, 200)
    except ExceptionToReturn as e:
        return e.getResponse()

websocketEventTypes = {
    "CONNECT": testConnect,
    "DISCONNECT": testDisconnect,
    "MESSAGE": handleWebSocketMessage,
}

websocketMessageTypes = {
    "SubscribeToGame": SubscribeToGame,
}

def initProps():
    print( "initializing props, this should only happen once." )
    ddb = DDB.initProd()
    gameTable = GameTable.newGameTable( ddb )
    connectionTable = ConnectionTable.newConnectionTable( ddb )
    openGameTable = OpenGameTable.newOpenGameTable( ddb )
    connectionClient = ConnectionClient()
    return {
        "ddb": ddb,
        "gameTable": gameTable,
        "connectionTable": connectionTable,
        "openGameTable": openGameTable,
        "connectionClient": connectionClient,
    }

def getProps():
    global _props
    if _props == None:
        _props = initProps()
    return _props

def getOrExcept(obj, key):
    if key not in obj:
        print(obj)
        raise Exception('there was no ${key} in parent object')
    return obj[key]

def getConnectionId(event):
    return event['requestContext']['connectionId']