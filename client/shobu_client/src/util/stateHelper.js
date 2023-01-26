
import { side } from "../logic/token";

const waitingForPlayer = "waitingForPlayer";
const blackMove = "blackMove"; const whiteMove = "whiteMove";
const blackResign = "blackResign"; const whiteResign = "whiteResign";
const blackWon = "blackWon"; const whiteWon = "whiteWon";
const blackTimeout = "blackTimeout"; const whiteTimeout = "whiteTimeout";


const blackStates = [
    blackMove,
    blackWon,
    blackResign,
    blackTimeout
]
const whiteStates = [
    whiteMove,
    whiteWon,
    blackResign,
    blackTimeout
]
const gameOverStates = [
    whiteWon, blackWon,
    whiteResign, blackResign,
    whiteTimeout, blackTimeout,
]
const activeStates = [
    waitingForPlayer, blackMove, whiteMove
]

export const stateIsRelatedToSide = ( sideValue, state ) => {
    return ( sideValue == side.BLACK && blackStates.includes( state ) ) ||
        ( sideValue == side.WHITE && whiteStates.includes( state ) );
}

export const stateIsRelatedToVictory = ( state ) => {
    return gameOverStates.includes( state );
}

export const stateIsActive = ( state ) => {
    return activeStates.includes( state );
}

export const isBlackMove = ( state ) => {
    return state == blackMove;
}

export const isWhiteMove = ( state ) => {
    return state == whiteMove;
}