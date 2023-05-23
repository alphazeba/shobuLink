

import logic.shobu.move as M
import logic.shobu.helpers as h
import logic.shobu.token as t
import logic.shobu.board as B
from exception.ExceptionToReturn import ExceptionToReturn

def checkForWin( board ):
    for n in range( 4 ):
        subboard = B.getSubboard( board, n )
        curBlack, curWhite = _countTokenTypeOnSubboard( subboard )
        if curBlack == 0:
            return t.SIDE_WHITE
        if curWhite == 0:
            return t.SIDE_BLACK
    return None

def _countTokenTypeOnSubboard( subboard ):
    blackCount, whiteCount = 0, 0
    for spot in h.everySpot():
        foundToken = B.subboardGetToken( subboard, spot )
        if foundToken == t.BLACK:
            blackCount += 1
        elif foundToken == t.WHITE:
            whiteCount += 1
    return blackCount, whiteCount