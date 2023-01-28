


import src.logic.Game as G
import src.data.playerSide as ps
import src.logic.shobu.token as t
import test.testUtility as testUtility

if True: # found an issue where floats were sneaking in and causing havoc.
    testUtility.buildTestGame([
        "Wb1c2Wb1c2",
        "Wb4b3Wc4c3",
        "Bb1b3Wb1b3"])