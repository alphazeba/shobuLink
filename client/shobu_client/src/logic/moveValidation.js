
import { addSpotVec, compareVec, spotIsInBoard, vectorToUnitAndSteps } from "./spot";
import { getPassiveMoveSubboard, getActiveMoveSubboard, getSubboard, subboardGetToken, tokenBelongsToPlayer, spotIsEmpty } from "./board";
import { tokenIsEnemy } from "./token";


export function validateFullMove( board, fullMove ){
    return validatePassiveMove( board, fullMove.passive) && 
        validateActiveMove( board, fullMove.active, 
            fullMove.passive.side, fullMove.passive.vector );
}

export function validatePassiveMove( board, move ){
    if( ! spotIsInBoard( move.spot ) ){
        return false;
    }
    var subboard = getPassiveMoveSubboard( board, move.side );
    var targetToken = subboardGetToken( subboard, move.spot );
    if( ! tokenBelongsToPlayer( targetToken, board ) ){
        return false;
    }
    var [ unit, steps ] = vectorToUnitAndSteps( move.vector );
    var spot = move.spot;
    for( var i =0;i< steps;i++){
        spot = addSpotVec( spot, unit );
        if( ! spotIsInBoard( spot ) || ! spotIsEmpty( subboard, spot ) ){
            return false;
        }
    }
    return true;
}

function validateActiveMove( board, move, passiveSide, passiveVector ){
    if( ! compareVec( move.vector, passiveVector ) || ! spotIsInBoard( move.spot ) ){
        return false;
    }
    var subboard = getActiveMoveSubboard( board, move.side, passiveSide );
    var targetToken = subboardGetToken( subboard, move.spot );
    if( ! tokenBelongsToPlayer(board, targetToken ) ){
        return false;
    }
    var [ unit, steps ] = vectorToUnitAndSteps( move.vector );
    var spot = move.spot;
    for( var i =0;i<steps;i++ ){
        spot = addSpotVec( spot, unit );
        if( ! spotIsInBoard( spot ) ){
            return false;
        }
        if( ! spotIsEmpty( subboard, spot ) ){
            var pushTarget = subboardGetToken( subboard, spot );
            if( ! tokenIsEnemy( pushTarget, board.playerTurn ) || 
                ! validateBeingPushedMovement( subboard, spot, unit, steps ) ){
                return false;
            }
        }
        return true;
    }
}

function validateBeingPushedMovement( subboard, spot, unit, steps ){
    for( var i=0;i< steps;i++){
        spot = addSpotVec( spot, unit );
        if( ! spotIsInBoard( spot ) ){
            return true;
        }
        if( ! spotIsEmpty( subboard, spot ) ){
            return false;
        }
    }
    return true;
}