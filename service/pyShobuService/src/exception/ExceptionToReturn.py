
from handler.eventIO.event import buildResponse

class ExceptionToReturn( Exception ):
    def __init__( self, message, statusCode ):
        self.response = buildResponse( { "error": message }, statusCode )

    def getResponse( self ):
        return self.response