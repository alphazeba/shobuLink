
import { validatePassiveMove, validateActiveMove } from "./moveValidation"
import { buildPartialMove, buildFullMove } from "./move"
import { addSpotVec } from "./spot"
import { getActiveMoveSubboard, getPassiveMoveSubboards, subboardGetToken } from "./board";
import { side } from "./token";

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

export function generateValidPassiveMoves( board, spot, homeboardside ){
    var moves = [];
    for( var offset of validVectors ){
        var passiveMove = buildPartialMove( homeboardside, spot, offset );
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

const sides = [ side.BLACK, side.WHITE ];
export function generateAllValidFullMoves( board ){
    // let playerSide = board.playerTurn;
    let passiveMoves = [];
    for( let passiveSpot of getPassiveSpots( getPassiveMoveSubboards( board ), board.playerTurn ) ){
        passiveMoves = passiveMoves.concat( generateValidPassiveMoves( board, passiveSpot.spot, passiveSpot.side ) );
    }
    let validMoves = [];
    for( let passiveMove of passiveMoves ){
        let activeMoves = [];
        for( let side of sides ){
            activeMoves = activeMoves.concat( generateValidActiveMoves( board, passiveMove, side ) );
        }
        for( let activeMove of activeMoves ){
            validMoves.push( buildFullMove( passiveMove, activeMove ) );
        }
    }
    return validMoves;
}

function getPassiveSpots( passiveSubboards, playerTurn ){
    let passiveSpots = [];
    for( let passiveSubboard of passiveSubboards ){
        let spots = getPlayerPieceSpots( passiveSubboard.subboard, playerTurn );
        for( let spot of spots ){
            passiveSpots.push({
                side: passiveSubboard.side,
                spot: spot
            });
        }
    }
    return passiveSpots;
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