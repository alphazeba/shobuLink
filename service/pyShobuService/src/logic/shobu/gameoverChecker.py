

import logic.shobu.move as M
import logic.shobu.helpers as h
import logic.shobu.token as t
import logic.shobu.board as B
from exception.ExceptionToReturn import ExceptionToReturn

def checkForWin( board ):
    minBlackToken = 100
    minWhiteToken = 100
    for n in range( 4 ):
        subboard = B.getSubboard( board, n )
        curBlack, curWhite = _countTokenTypeOnSubboard( subboard )
        minBlackToken = min( minBlackToken, curBlack )
        minWhiteToken = min( minWhiteToken, curWhite )
    if minBlackToken == 0:
        return t.SIDE_WHITE
    if minWhiteToken == 0:
        return t.SIDE_BLACK
    return None

def _countTokenTypeOnSubboard( subboard ):
    blackCount, whiteCount = 0, 0
    for iy in range( 4 ):
        for ix in range( 4 ):
            foundToken = B.subboardGetToken( subboard, [ix,iy] )
            if foundToken == t.BLACK:
                blackCount += 1
            elif foundToken == t.WHITE:
                whiteCount += 1
    return blackCount, whiteCount