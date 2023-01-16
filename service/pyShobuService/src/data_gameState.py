



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

def isActive( gameState ):
    return gameState == blackMove or gameState == whiteMove

def isComplete( gameState ):
    return gameState in [
            blackResigned,
            whiteResigned,
            blackWon,
            whiteWon,
            blackTimeout,
            whiteTimeout,
            draw
        ]

