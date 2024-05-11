
import util.time as time

_fullMove = "m"
_time = "t"

def new( fullMove ):
    return {
        _time: time.getNowMs(),
        _fullMove: fullMove
    }

def getFullMove( this ):
    return this[_fullMove]

def getTime( this ) -> int:
    return this[_time]