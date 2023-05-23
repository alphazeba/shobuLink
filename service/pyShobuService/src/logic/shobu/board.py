
import logic.shobu.move as M
import logic.shobu.helpers as h
import logic.shobu.token as t

def initSubboard():
    return [
        [t.WHITE,t.WHITE,t.WHITE,t.WHITE],
        [t.EMPTY,t.EMPTY,t.EMPTY,t.EMPTY],
        [t.EMPTY,t.EMPTY,t.EMPTY,t.EMPTY],
        [t.BLACK,t.BLACK,t.BLACK,t.BLACK]
    ]

def initEmptySubboard():
    return [
        [t.EMPTY,t.EMPTY,t.EMPTY,t.EMPTY],
        [t.EMPTY,t.EMPTY,t.EMPTY,t.EMPTY],
        [t.EMPTY,t.EMPTY,t.EMPTY,t.EMPTY],
        [t.EMPTY,t.EMPTY,t.EMPTY,t.EMPTY]
    ]

def initBoard():
    return buildBoard( initSubboard(),initSubboard(),initSubboard(),initSubboard(), t.BLACK )

def buildBoard( s0, s1, s2, s3, player):
    return {
        "b":[
            [ s0, s2 ],
            [ s1, s3 ]
        ],
        "t": player }

def boardGetPlayer( board ):
    return board["t"]

def boardIsBlack( board ):
    return boardGetPlayer( board ) == t.BLACK

def getHomeSubboards( board ):
    if boardGetPlayer( board ) == t.BLACK:
        return [ ( getSubboard( board, 2 ), t.SIDE_BLACK ), ( getSubboard( board, 3 ), t.SIDE_WHITE ) ]
    return [ ( getSubboard( board, 0 ), t.SIDE_BLACK ) , ( getSubboard( board, 1 ), t.SIDE_WHITE ) ]

def getSideSubboards( board, passiveSide ):
    if passiveSide == t.SIDE_BLACK:
        return [ ( getSubboard( board, 1 ), t.SIDE_WHITE ), ( getSubboard( board, 3 ), t.SIDE_BLACK ) ]
    return [ ( getSubboard( board, 0 ), t.SIDE_WHITE ), ( getSubboard( board, 2 ), t.SIDE_BLACK ) ]

def boardToString( board ):
    output = ""
    output += stringSideBySide( subboardToString( getSubboard( board, 0 ) ), subboardToString( getSubboard( board, 1 ) ) )
    output += '\n'
    output += stringSideBySide( subboardToString( getSubboard( board, 2 ) ), subboardToString( getSubboard( board, 3 ) ) )
    return output

def subboardToString( subboard ):
    output = ""
    for iy in range( 4 ):
        for ix in range( 4 ):
            output += getCharForValue( subboardGetToken( subboard, [ix,iy] ) ) + ' '
        output += '\n'
    return output[:-1]

def subboardGetToken( subboard, spot ):
    x,y = spot
    return subboard[y][x]

def subboardSetToken( subboard, spot, token ):
    x,y = spot 
    subboard[y][x] = token

def getCharForValue( value ):
    if value == t.EMPTY:
        return '+'
    if value == t.BLACK:
        return 'X'
    if value == t.WHITE:
        return 'O'

def stringSideBySide( string1, string2 ):
    space = ' .  '
    a = string1.split('\n')
    b = string2.split('\n')
    output = ""
    shareLength = min( len( a ), len( b ) )
    for i in range( shareLength ):
        output += a[i] + space + b[i] + '\n'
    return output

def printBoard( board ):
    print( boardToString( board ) )

def getSubboard( board, n ):
    b = board["b"]
    if n == 0:
        return b[0][0]
    if n == 1:
        return b[1][0]
    if n == 2:
        return b[0][1]
    if n == 3:
        return b[1][1]

def makeValidatedMove( board, move ):
    output = boardCopy( board )
    passiveMove = move['p']
    activeMove = move['a']
    _makePassiveMove( output, passiveMove )
    _makeActiveMove( output, activeMove, passiveMove )
    _flipTurn( output )
    return output

def boardCopy( board ):
    return buildBoard( getSubboard(board,0).copy(),getSubboard(board,1).copy(),getSubboard(board,2).copy(),getSubboard(board,3).copy(), boardGetPlayer( board ) )

def _makePassiveMove( board, passiveMove ):
    subboard = getPassiveMoveSubboard( board, M.getSide( passiveMove ) )
    spot = M.getSpot( passiveMove )
    vec = M.getVector( passiveMove )
    subboardSetToken( subboard, spot, t.EMPTY )
    subboardSetToken( subboard, h.addSpotVec( spot, vec ), boardGetPlayer( board ) )

def _makeActiveMove( board, activeMove, passiveMove ):
    subboard = getActiveMoveSubboard( board, M.getSide( activeMove ), M.getSide( passiveMove ) )
    spot = M.getSpot( activeMove )
    vec = M.getVector( activeMove )
    enemyToken = t.WHITE 
    if boardGetPlayer( board ) == t.WHITE:
        enemyToken = t.BLACK
    subboardSetToken( subboard, spot, t.EMPTY )
    unit, steps = h.vectorToUnitAndSteps( vec )
    enemyStonePushed = False 
    for i in range( steps ):
        spot = h.addSpotVec( spot, unit )
        if not spotIsEmpty( subboard, spot ):
            subboardSetToken( subboard, spot, t.EMPTY )
            enemyStonePushed = True
    subboardSetToken( subboard, spot, boardGetPlayer( board ) )
    if enemyStonePushed:
        spot = h.addSpotVec( spot, unit )
        if h.spotIsInBoard( spot ):
            subboardSetToken( subboard, spot, enemyToken )
    
def _flipTurn( board ):
    if boardGetPlayer( board ) == t.BLACK:
        board['t'] = t.WHITE
    else:
        board['t'] = t.BLACK

def getPassiveMoveSubboard( board, side ):
    if boardGetPlayer( board ) == t.BLACK:
        if side == t.SIDE_BLACK:
            return getSubboard( board, 2 )
        else:
            return getSubboard( board, 3 )
    else:
        if side == t.SIDE_BLACK:
            return getSubboard( board, 0 )
        else:
            return getSubboard( board, 1 )

def getActiveMoveSubboard( board, side, passiveSide ):
    if passiveSide == t.SIDE_BLACK:
        if side == t.SIDE_BLACK:
            return getSubboard( board, 3 )
        else:
            return getSubboard( board, 1 )
    else:
        if side == t.SIDE_BLACK:
            return getSubboard( board, 2 )
        else:
            return getSubboard( board, 0 )

def spotIsEmpty( subboard, spot ):
    return subboardGetToken( subboard, spot ) == t.EMPTY


