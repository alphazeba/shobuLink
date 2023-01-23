
import { validatePassiveMove, validateActiveMove } from "./moveValidation"
import { buildPartialMove } from "./move"
import { addSpotVec } from "./spot"
import { getActiveMoveSubboard, subboardGetToken } from "./board";

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
    var moves = [];
    for( var offset of validVectors ){
        var passiveMove = buildPartialMove( board.playerTurn, spot, offset );
        if( validatePassiveMove( board, passiveMove ) ){
            moves.push( passiveMove );
        }
    }
    return moves;
}

export function generateValidActiveMoves( board, passiveMove, activeSide ){
    var moves = [];
    var subboard = getActiveMoveSubboard( board, activeSide, passiveMove.side );
    var playerPieces = getPlayerPieceSpots( subboard, board.playerTurn );
    for( var spot of playerPieces ){
        var move = buildPartialMove( activeSide, spot, passiveMove.vector );
        if( validateActiveMove( board, move, passiveMove.side, passiveMove.vector ) ){
            moves.push( move );
        }
    }
    return moves;
}


function getPlayerPieceSpots( subboard, playerColor ){
    var spots = []
    for( var iy=0;iy<4;iy++){
        for( var ix=0;ix<4;ix++){
            var spot = [ix,iy];
            if( subboardGetToken( subboard, spot ).type == playerColor ){
                spots.push( spot );
            }
        }
    }
    return spots;
}