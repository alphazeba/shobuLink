
import { validatePassiveMove } from "./moveValidation"
import { buildPartialMove } from "./move"
import { addSpotVec } from "./spot"

const validVectors = [
    [0,1],
    [0,-1],
    [1,0],
    [-1,0],
    [1,1],
    [1,-1,],
    [-1,1],
    [-1,-1],
    [0,2],
    [0,-2],
    [2,0],
    [-2,0],
    [2,2],
    [2,-2,],
    [-2,2],
    [-2,-2]
]

export function generateValidPassiveMoves( board, spot ){
    var moves = []
    for( var offset of validVectors ){
        var passiveMove = buildPartialMove( board.playerTurn, spot, offset );
        if( validatePassiveMove( board, passiveMove ) ){
            moves.push( passiveMove );
        }
    }
    return moves;
}
