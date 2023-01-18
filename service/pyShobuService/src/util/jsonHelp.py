
import json
from decimal import Decimal

def loads( string ):
    return json.loads( string )

def dumps( obj ):
    return json.dumps( obj, cls=encoder )

class encoder( json.JSONEncoder ):
    def default( self, o ):
        if isinstance( o, Decimal ):
            return int( o )
        return super( encoder, self).default( o )