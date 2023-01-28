

import src.data.preview as p
import src.logic.shobu.board as B
import src.util.jsonHelp as json
import test.testUtility as testUtility

def _deepCompare( a, b ):
    return json.dumps( a ) == json.dumps( b )

if True:
    testBoard = B.initBoard()
    binaryBoard = p._boardToInt( testBoard )
    assert( binaryBoard == 0b111100000000000000000000000011111111000000000000000000000000111111110000000000000000000000001111111100000000000000000000000011111 )

if True:
    testBoard = testUtility.buildTestShobuBoard([
        "Wb1c2Wb1c2",
        "Wb4b3Wc4c3",
        "Bb1b3Wb1b3"] )
    binaryBoard = p._boardToInt( testBoard )
    reformedBoard = p._intToBoard( binaryBoard )
    assert( _deepCompare( testBoard, reformedBoard ) )

if True:
    tn = 0b111100000000000000000000000011111111000000000000000000000000111111110000000000000000000000001111111100000000000000000000000011111
    bytes = tn.to_bytes( 17, "big" )
    rn = int.from_bytes( bytes, "big" )
    assert( rn == tn )


if True:
    testBoard = testUtility.buildTestShobuBoard([
        "Wb1c2Wb1c2",
        "Wb4b3Wc4c3",
        "Bb1b3Wb1b3"] )
    previewBoard = p.boardToPreview( testBoard )
    reformedBoard = p.previewToBoard( previewBoard )
    assert( _deepCompare( testBoard, reformedBoard ) )
    assert( previewBoard == "AaQAAFfgAAgX4AAIF+AAAFY=" )