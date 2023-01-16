
import logic.shobu.board as B
import logic.shobu.move as M
import logic.shobu.helpers as h
import logic.shobu.token as t

# i think its possible that validatin is done.
# except for validating that the vector is a valid direction.

def validateFullMove( board, fullMove ):
    active = M.moveGetActive( fullMove )
    passive = M.moveGetPassive( fullMove )
    return validatePassiveMove( board, passive ) and validateActiveMove( board, active, M.getSide( passive ), M.getVector( passive ) )

def validatePassiveMove( board, move ):
    side = M.getSide( move )
    spot = M.getSpot( move )
    vector = M.getVector( move )

    if not spotIsInBoard( spot ):
        return False
    subboard = B.getPassiveMoveSubboard( board, side )
    targetToken = B.subboardGetToken( subboard, spot )
    if targetToken != B.boardGetPlayer( board ):
        return False
    unit, steps = h.vectorToUnitAndSteps( vector )
    for i in range( steps ):
        spot = h.addSpotVec( spot, unit )
        if not spotIsInBoard( spot ) or not B.spotIsEmpty( subboard, spot ): 
            return False
    return True

def validateActiveMove( board, move, passiveSide, passiveVector ):
    side = M.getSide( move )
    spot = M.getSpot( move )
    vector = M.getVector( move )

    if not h.compareVec( vector, passiveVector ):
        return False 
    if not spotIsInBoard( spot ):
        return False
    player = B.boardGetPlayer( board )
    subboard = B.getActiveMoveSubboard( board, side, passiveSide )
    targetToken = B.subboardGetToken( subboard, spot )
    if targetToken != player:
        return False
    unit,steps = h.vectorToUnitAndSteps( vector )
    for i in range( steps ):
        spot = h.addSpotVec( spot, unit )
        if not spotIsInBoard( spot ):
            return False
        if not B.spotIsEmpty( subboard, spot ):
            pushTarget = B.subboardGetToken( subboard, spot )
            if not h.tokenIsEnemy( pushTarget, player ) or not validateBeingPushedMovement( subboard, spot, unit, steps - i ):
                return False
    return True

def validateBeingPushedMovement( subboard, spot, unit, steps ):
    for i in range( steps ):
        spot = h.addSpotVec( spot, unit )
        if not spotIsInBoard( spot ):
            return True
        if not B.spotIsEmpty( subboard, spot ):
            return False
    return True

def spotIsInBoard( spot ):
    x,y = spot 
    return x >= 0 and y >= 0 and x < 4 and y < 4

