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
    
if True:
    testGameTableGame = { "id": "c29879f9-b521-474a-add0-84badfc3edc6", "buId": "jef", "buName": "jef", "moves": [ { "m": "Bc1c3Wb1b3", "t": 1675130445420 }, { "m": "Bb4b2Wb4b2", "t": 1675130458220 }, { "m": "Wa1a2Wb1b2", "t": 1675131131040 }, { "m": "Bc4c2Wc4c2", "t": 1675131795020 }, { "m": "Bb1b3Wb1b3", "t": 1675131824461 }, { "m": "Bd4d2Wb4b2", "t": 1675132289080 }, { "m": "Wb1b3Wc1c3", "t": 1675217252657 }, { "m": "Wd4c3Bd4c3", "t": 1675217682603 }, { "m": "Bd1d3Ba2a4", "t": 1675218286301 }, { "m": "Wa4a2Wc4c2", "t": 1675218312140 }, { "m": "Wc1c3Ba1a3", "t": 1675218789418 }, { "m": "Bb3a2Wc2b1", "t": 1675218814257 }, { "m": "Wd1d2Bb3b4", "t": 1675218877277 }, { "m": "Wc3c2Wc2c1", "t": 1675218890198 }, { "m": "Bb2b3Bc3c4", "t": 1675219795755 }, { "m": "Wc2b3Wc1b2", "t": 1675219821413 }, { "m": "Bd3d4Bb3b4", "t": 1675219843335 }, { "m": "Ba4b3Wb2c1", "t": 1675219856874 }, { "m": "Wd2d3Wd1d2", "t": 1675219950335 } ], "phsT": "a1675130434260", "prv": "AAuAEDAJDAATRAC4ACABwgA=", "secs": 420, "startTime": 1675130434260, "state": "whiteMove", "wuId": "billy", "wuName": "billy"}
    totalMoves = len( testGameTableGame["moves"] )
    for i in range( totalMoves ):
        move = testGameTableGame["moves"][i]
        filterTime = move["t"]
        result = G.toGetGameOutputForm( testGameTableGame, filterTime )
        resultNumMoves = len( result["moves"] )
        assert( totalMoves - ( i+1 ) == resultNumMoves )
    print( "tested filter at each move" )