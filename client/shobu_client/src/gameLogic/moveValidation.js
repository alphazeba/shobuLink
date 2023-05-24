
import { addSpotVec, compareVec, spotIsInBoard, vectorToUnitAndSteps } from "./spot";
import { getPassiveMoveSubboard, getActiveMoveSubboard, subboardGetToken, tokenBelongsToPlayer, spotIsEmpty } from "./board";
import { tokenIsEnemy } from "./token";


export function validateFullMove( board, fullMove ){
    return validatePassiveMove( board, fullMove.passive ) && 
        validateActiveMove( board, fullMove.active, 
            fullMove.passive.side, fullMove.passive.vector );
}

export function validatePassiveMove( board, move ){
    if( ! spotIsInBoard( move.spot ) ){
        return false;
    }
    let subboard = getPassiveMoveSubboard( board, move.side );
    let targetToken = subboardGetToken( subboard, move.spot );
    if( ! tokenBelongsToPlayer( targetToken, board ) ){
        return false;
    }
    let [ unit, steps ] = vectorToUnitAndSteps( move.vector );
    let spot = move.spot;
    for( let i =0;i< steps;i++){
        spot = addSpotVec( spot, unit );
        if( ! spotIsInBoard( spot ) || ! spotIsEmpty( subboard, spot ) ){
            return false;
        }
    }
    return true;
}

export function validateActiveMove( board, move, passiveSide, passiveVector ){
    if( ! compareVec( move.vector, passiveVector ) || ! spotIsInBoard( move.spot ) ){
        return false;
    }
    let subboard = getActiveMoveSubboard( board, move.side, passiveSide );
    let targetToken = subboardGetToken( subboard, move.spot );
    if( ! tokenBelongsToPlayer( board, targetToken ) ){
        return false;
    }
    let [ unit, steps ] = vectorToUnitAndSteps( move.vector );
    let spot = move.spot;
    for( let i =0;i<steps;i++ ){
        spot = addSpotVec( spot, unit );
        if( ! spotIsInBoard( spot ) ){
            return false;
        }
        if( ! spotIsEmpty( subboard, spot ) ){
            let pushTarget = subboardGetToken( subboard, spot );
            if( ! tokenIsEnemy( pushTarget, board.playerTurn ) || 
                ! validateBeingPushedMovement( subboard, spot, unit, steps ) ){
                return false;
            }
        }
    }
    return true;
}

function validateBeingPushedMovement( subboard, spot, unit, steps ){
    for( let i=0;i< steps;i++){
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