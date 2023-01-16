
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

def toString( fullMove ):
    return partialMoveToString( fullMove['p'] ) + partialMoveToString( fullMove['a'] )
    
def partialMoveToString( move ):
    output = ""
    if getSide( move ) == 0:
        output += "B"
    else:
        output += "W"
    a = getSpot( move )
    b = h.addSpotVec( a, getVector( move ) )
    output += spotToString( a ) + spotToString( b )
    return output

def spotToString( spot ):
    x,y = spot 
    output = ""
    if x == 0:
        output += 'a'
    elif x == 1:
        output += 'b'
    elif x == 2:
        output += 'c'
    else:
        output += 'd'
    output += str(y+1)
    return output