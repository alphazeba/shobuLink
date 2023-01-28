
# the goal of the preview is just to be a compact way of storing gameStates.
# instead of parsing the full moves, we can just grab the lastest boardstate from the preview.

import logic.shobu.board as B
import logic.shobu.token as T

def boardToPreview( board ):
    return False

def _boardToBinary( board ):
    output = 0
    for i in range( 4 ):
        output = output << 32
        output += _subboardToBinary( B.getSubboard( board, i ) )
    output = output << 1
    if B.boardIsBlack( board ):
        output += 1
    return output

def _subboardToBinary( subboard ):
    white = 0
    black = 0
    for iy in range( 4 ):
        for ix in range( 4 ):
            white = white << 1
            black = black << 1
            t = B.subboardGetToken( subboard, [ix,iy] )
            if t == T.BLACK:
                black += 1
            elif t == T.WHITE:
                white += 1
    output = (white << 16) + black
    return output

_32BitMask = 0b11111111111111111111111111111111
def _binaryToBoard( binary ):
    player = T.WHITE
    if(binary & _1bitMask):
        player = T.BLACK
    binary = binary >> 1
    binarySubboards = []
    for i in range( 4 ):
        segment = binary & _32BitMask
        binary = binary >> 32
        binarySubboards.append( segment )
    subboards = [ _binaryToSubboard( b ) for b in binarySubboards ]
    outputBoard = B.buildBoard( subboards[3], subboards[2], subboards[1], subboards[0], player )
    return outputBoard

def _invertedSetToken( subboard, ix,iy, tokenType ):
    B.subboardSetToken( subboard, [ 3-ix,3-iy], tokenType )

_16BitMask = 0b1111111111111111
_1bitMask = 0b1
def _binaryToSubboard( binarySubboard ):
    output = B.initEmptySubboard()
    white = binarySubboard >> 16
    black = binarySubboard & _16BitMask
    for iy in range( 4 ):
        for ix in range( 4 ):
            if white & _1bitMask == 1:
                _invertedSetToken( output, ix,iy, T.WHITE )
            elif black & _1bitMask == 1:
                _invertedSetToken( output, ix,iy, T.BLACK )
            white = white >> 1
            black = black >> 1
    return output


