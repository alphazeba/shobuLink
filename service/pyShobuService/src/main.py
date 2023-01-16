
from eventIo.event import buildResponse
from eventIo.eventValidation import getValidatedMapKey
from handler.CreateGame import CreateGame
from handler.GetGame import GetGame
from handler.JoinGame import JoinGame
from handler.PlayMove import PlayMove
from exception.ExceptionToReturn import ExceptionToReturn

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