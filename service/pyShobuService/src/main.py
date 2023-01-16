
from io_event import buildResponse
from io_event_validation import getValidatedMapKey
from handler_CreateGame import CreateGame
from handler_GetGame import GetGame
from handler_JoinGame import JoinGame
from handler_PlayMove import PlayMove
from exception_ExceptionToReturn import ExceptionToReturn

def lambda_handler( event, context ):
    try:
        eventType = getValidatedMapKey( 'type', event, routes )
        response = None
        if eventType in routes:
            response = routes[eventType]( event, context )
        return buildResponse( response, 200 )
    except ExceptionToReturn as e:
        return e.getResponse()

routes = {
    "CreateGame": CreateGame,
    "GetGame": GetGame,
    "JoinGame": JoinGame,
    "PlayMove": PlayMove
}