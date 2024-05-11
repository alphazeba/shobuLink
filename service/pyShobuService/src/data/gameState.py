waitingForPlayer = "waitingForPlayer"

blackMove = "blackMove"
whiteMove = "whiteMove"

blackResigned = "blackResigned"
whiteResigned = "whiteResigned"
blackWon = "blackWon"
whiteWon = "whiteWon"
blackTimeout = "blackTimeout"
whiteTimeout = "whiteTimeout"

draw = "draw"

phase_pending = "p"
phase_active = "a"
phase_complete = "c"

options = [
    waitingForPlayer,
    blackMove,
    whiteMove,
    blackResigned,
    whiteResigned,
    blackWon,
    whiteWon,
    blackTimeout,
    whiteTimeout,
    draw
]

def isBlacksMove( gameState ) -> bool:
    return gameState == blackMove

def isPending( gameState ) -> bool:
    return gameState == waitingForPlayer

def isActive( gameState ) -> bool:
    return gameState == blackMove or gameState == whiteMove

def isComplete( gameState ) -> bool:
    return gameState in [
            blackResigned,
            whiteResigned,
            blackWon,
            whiteWon,
            blackTimeout,
            whiteTimeout,
            draw
        ]

def getPhase( state ):
    if isPending( state ):
        return phase_pending
    if isActive( state ):
        return phase_active
    return phase_complete