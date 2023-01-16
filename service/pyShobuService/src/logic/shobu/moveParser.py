
import logic.shobu.move as M
import logic.shobu.board as B
import logic.shobu.helpers as h

def parseMove( moveString ):
    if len( moveString ) == 10:
        passive = parsePartialMove( moveString[:5] )
        active = parsePartialMove( moveString[-5:] )
        return M.buildMove( passive, active )
    else:
        error( "Sorry that was not the correct number of characters" )

def moveToString( move ):
    return M.toString( move )

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
    y = int( rowChar ) - 1
    if y < 0 or y >= 4:
        error( "rowChar must 1 through 4 but was " + rowChar )
    return (x,y)

def parseSide( sideCharacter ):
    if sideCharacter == "B":
        return B.SIDE_BLACK
    elif sideCharacter == "W":
        return B.SIDE_WHITE
    else:
        error( "character " + sideCharacter + " must be either B or W" )

def error( message ):
    return False