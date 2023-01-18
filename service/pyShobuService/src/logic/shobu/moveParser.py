
import logic.shobu.move as M
import logic.shobu.helpers as h
import logic.shobu.token as t
from exception.ExceptionToReturn import ExceptionToReturn

def parseMove( moveString ):
    if len( moveString ) == 10:
        passive = parsePartialMove( moveString[:5] )
        active = parsePartialMove( moveString[-5:] )
        return M.buildMove( passive, active )
    else:
        error( "Sorry that was not the correct number of characters" )

def parsePartialMove( partialString ):
    side = parseSide( partialString[0] )
    start = parseSpot( partialString[1:3] )
    end = parseSpot( partialString[3:] )
    delta = h.getDeltaVector( start, end )
    return M.buildPartialMove( side, start, delta )

def parseSpot( locationString ):
    colChar = locationString[0]
    rowChar = locationString[1]
    x,y = 0,0
    if colChar == 'a':
        x = 0
    elif colChar == 'b':
        x = 1
    elif colChar == 'c':
        x = 2 
    elif colChar == 'd':
        x = 3
    else:
        error( "column character must be a,b,c,d but was " + colChar )
    y = 4 - int( rowChar )
    if y < 0 or y >= 4:
        error( "rowChar must 1 through 4 but was " + rowChar )
    return (x,y)

def parseSide( sideCharacter ):
    if sideCharacter == "B":
        return t.SIDE_BLACK
    elif sideCharacter == "W":
        return t.SIDE_WHITE
    else:
        error( "character " + sideCharacter + " must be either B or W" )

def moveToString( fullMove ):
    return partialMoveToString( fullMove['p'] ) + partialMoveToString( fullMove['a'] )
    
def partialMoveToString( move ):
    output = ""
    if M.getSide( move ) == t.BLACK:
        output += "B"
    else:
        output += "W"
    a = M.getSpot( move )
    b = h.addSpotVec( a, M.getVector( move ) )
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
    output += str(4-y)
    return output


def error( message ):
    raise ExceptionToReturn( message, 403 )