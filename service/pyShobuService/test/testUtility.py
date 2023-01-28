
import src.logic.shobu.board as B
import src.logic.Game as G
import src.data.playerSide as ps
import src.logic.shobu.token as t

def buildTestShobuBoard( moveStringArray ):
    game = buildTestGame( moveStringArray )
    return G._getCurrentBoardState( game )

def buildTestGame( moveStringArray ):
    game = G.new( "id1", "name1", ps.black, 420 )
    G.joinGame( game, "id2", "name2" )
    moveStringArray = [
        "Wb1c2Wb1c2",
        "Wb4b3Wc4c3",
        "Bb1b3Wb1b3"
    ]
    side = ps.black
    for move in moveStringArray:
        G.playMove( game, side, move )
        side = flipSide( side )
    return game


def flipSide( side ):
    if side == ps.black:
        return ps.white
    else:
        return ps.black