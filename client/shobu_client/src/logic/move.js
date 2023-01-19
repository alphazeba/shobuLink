

export function buildPartialMove( side, spot, vector ){
    return {
        side: side,
        spot: spot,
        vector: vector
    }
}

export function buildFullMove( passiveMove, activeMove ){
    return {
        passive: passiveMove,
        active: activeMove
    }
}