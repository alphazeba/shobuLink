
# the goal of the preview is just to be a compact way of storing gameStates.
# instead of parsing the full moves, we can just grab the lastest boardstate from the preview.

import logic.shobu.board as B
import logic.shobu.token as T
import base64
import logic.shobu.helpers as h

_32bitMask = 0b11111111111111111111111111111111
_16bitMask = 0b1111111111111111
_1bitMask = 0b1

def boardToPreview( board ):
    return str( base64.b64encode( _boardToInt( board ).to_bytes( 17, 'big' ) ), 'utf-8' )

def previewToBoard( preview ):
    return _intToBoard( int.from_bytes( base64.b64decode( bytes( preview, 'utf-8') ), 'big' ) )

def _boardToInt( board ):
    output = 0
    for i in range( 4 ):
        output = output << 32
        output += _subboardToInt( B.getSubboard( board, i ) )
    output = output << 1
    if B.boardIsBlack( board ):
        output += 1
    return output

def _subboardToInt( subboard ):
    white = 0
    black = 0
    for spot in h.everySpot():
        white = white << 1
        black = black << 1
        t = B.subboardGetToken( subboard, spot )
        if t == T.BLACK:
            black += 1
        elif t == T.WHITE:
            white += 1
    output = (white << 16) + black
    return output

def _intToBoard( binary ):
    player = T.WHITE
    if(binary & _1bitMask):
        player = T.BLACK
    binary = binary >> 1
    binarySubboards = []
    for i in range( 4 ):
        segment = binary & _32bitMask
        binary = binary >> 32
        binarySubboards.append( segment )
    subboards = [ _intToSubboard( b ) for b in binarySubboards ]
    outputBoard = B.buildBoard( subboards[3], subboards[2], subboards[1], subboards[0], player )
    return outputBoard

def _invertedSetToken( subboard, spot, tokenType ):
    x,y = spot
    B.subboardSetToken( subboard, [ 3-x,3-y], tokenType )

def _intToSubboard( binarySubboard ):
    output = B.initEmptySubboard()
    white = binarySubboard >> 16
    black = binarySubboard & _16bitMask
    for spot in h.everySpot():
        if white & _1bitMask == 1:
            _invertedSetToken( output, spot, T.WHITE )
        elif black & _1bitMask == 1:
            _invertedSetToken( output, spot, T.BLACK )
        white = white >> 1
        black = black >> 1
    return output


