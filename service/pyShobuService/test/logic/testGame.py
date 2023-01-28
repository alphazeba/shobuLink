


import src.logic.Game as G
import src.data.playerSide as ps
import src.logic.shobu.token as t
import test.testUtility as testUtility

if True: # found an issue where floats were sneaking in and causing havoc.
    testUtility.buildTestGame([
        "Wb1c2Wb1c2",
        "Wb4b3Wc4c3",
        "Bb1b3Wb1b3"])

if False: # proves that reading from the preview is faster than building boardState
    testGame = testUtility.buildTestGame([
        "Wb1b3Wb1b3",
        "Bd4b2Bc4a2",
        "Wa1b2Wb3c4",
        "Wc4b3Bd4c3",
        "Bb1b3Bb2b4",
        "Wb3d3Wb4d4",
        "Wc1a3Wc1a3",
        "Ba4b3Ba4b3",
        "Bb3b1Ba3a1",
        "Wd3c3Wb3a3",
        "Wd1d3Wa1a3",
        "Ba4c4Bb3d3",
    ])
    rep = 5000
    t1 = testUtility.timeMethod( 
        lambda: G._buildBoardFromMoves( testGame ), 
        rep )
    t2 = testUtility.timeMethod( 
        lambda: G._getCurrentBoardState( testGame ),
        rep )
    assert( t2 < t1 )
    
