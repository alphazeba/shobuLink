

import src.data.preview as p
import src.logic.shobu.board as B
import src.util.jsonHelp as json
import test.testUtility as testUtility

def _deepCompare( a, b ):
    return json.dumps( a ) == json.dumps( b )

if True:
    testBoard = B.initBoard()
    binaryBoard = p._boardToBinary( testBoard )
    assert( binaryBoard == 0b111100000000000000000000000011111111000000000000000000000000111111110000000000000000000000001111111100000000000000000000000011111 )

if True:
    testBoard = testUtility.buildTestShobuBoard([
        "Wb1c2Wb1c2",
        "Wb4b3Wc4c3",
        "Bb1b3Wb1b3"] )
    binaryBoard = p._boardToBinary( testBoard )
    reformedBoard = p._binaryToBoard( binaryBoard )
    assert( _deepCompare( testBoard, reformedBoard ) )