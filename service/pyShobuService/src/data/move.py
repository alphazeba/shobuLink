
import util.time as time


def new( fullMove ):
    return {
        "t": time.getNow(),
        "m": fullMove
    }

def getFullMove( this ):
    return this["m"]