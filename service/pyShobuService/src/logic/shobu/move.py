
import logic.shobu.helpers as h

def buildMove( passiveMove, activeMove ):
    return {
        'p': passiveMove,
        'a': activeMove
    }

def moveGetActive( move ):
    return move['a']

def moveGetPassive( move ):
    return move['p']

def buildPassiveMove( side, spot, vector ):
    return buildPartialMove( side, spot, vector )

def buildActiveMove( side, spot, vector ):
    return buildPartialMove( side, spot, vector )

def buildPartialMove( side, spot, vector ):
    return {
        's': side,
        'p': spot,
        'v': vector
    }

def getSide( move ):
    return move['s']

def getSpot( move ):
    return move['p']

def getVector( move ):
    return move['v']

def toUniqueSideVectorKey( move ):
    return str(getSide(move)) + str(getVector(move))

def toMoveKey( move ):
    return str(getSide(move)) + str(getVector(move)) + str(getSpot(move))

def toFullMoveKey( fullMove ):
    return toMoveKey( fullMove['p'] ) + toMoveKey( fullMove['a'] )