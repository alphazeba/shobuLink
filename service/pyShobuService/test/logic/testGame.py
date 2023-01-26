


import src.logic.Game as G
import src.data.playerSide as ps
import src.logic.shobu.token as t

def flipSide( side ):
    if side == ps.black:
        return ps.white
    else:
        return ps.black

if True: # found an issue where floats were sneaking in and causing havoc.
    game = G.new( "id1", "name1", ps.black, 420 )
    G.joinGame( game, "id2", "name2" )
    moves = [
        "Wb1c2Wb1c2",
        "Wb4b3Wc4c3",
        "Bb1b3Wb1b3"
    ]
    side = ps.black
    for move in moves:
        print( "playing move: " + move )
        G.playMove( game, side, move )
        side = flipSide( side )