import { side } from "../gameLogic/token";
import { buildBoard, initEmptySubboard, subboardSetToken } from "../gameLogic/board";
import { token, buildToken } from "../gameLogic/token";
import { BitFeeder } from "./BitFeeder";

const waitingForPlayer = "waitingForPlayer";
const blackMove = "blackMove"; const whiteMove = "whiteMove";
const blackResign = "blackResign"; const whiteResign = "whiteResign";
const blackWon = "blackWon"; const whiteWon = "whiteWon";
const blackTimeout = "blackTimeout"; const whiteTimeout = "whiteTimeout";

const blackStates = [
    blackMove,
    blackWon,
    whiteResign,
    whiteTimeout
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

export const winCheckToWinState = ( winCheckResult ) => {
    if( winCheckResult === token.BLACK ){
        return blackWon;
    }
    if( winCheckResult === token.WHITE ){
        return whiteWon;
    }
}

export const stateIsRelatedToSide = ( sideValue, state ) => {
    return ( sideValue === side.BLACK && blackStates.includes( state ) ) ||
        ( sideValue === side.WHITE && whiteStates.includes( state ) );
}

export const stateIsRelatedToVictory = ( state ) => {
    return gameOverStates.includes( state );
}

export const stateIsActive = ( state ) => {
    return activeStates.includes( state );
}

export const isColorSideMove = ( colorSide, state) => {
    if (colorSide === side.BLACK) {
        return isBlackMove(state);
    }
    return isWhiteMove(state);
}

export const isBlackMove = ( state ) => {
    return state === blackMove;
}

export const isWhiteMove = ( state ) => {
    return state === whiteMove;
}

export const isBlackTimeout = ( state ) => {
    return state === blackTimeout;
}

export const isWhiteTimeout = ( state ) => {
    return state === whiteTimeout;
}

export const parsePreview = ( preview ) => {
    let bytes = atob( preview );
    if( bytes.length !== 17 ){
        throw Error( "preview bytes should be 17 long but is:" + bytes.length );
    }
    let bitFeeder = new BitFeeder( bytes );
    let player = token.WHITE;
    if( bitFeeder.getNextBit() ){
        player = token.BLACK;
    }
    let subboards = [];
    for( let i=0; i<4; i++ ){
        subboards.push( bitFeederToSubboard( bitFeeder.getBitFeederJumped( 4*8*(3-i) ) ) );
    }
    let board = buildBoard( subboards, player );
    return board;
}

function bitFeederToSubboard( bitFeeder ){
    let subboard = initEmptySubboard();
    let white = bitFeeder.getBitFeederJumped( 16 );
    let black = bitFeeder;
    for( let iy=0; iy<4; iy++ ){
        for( let ix=0; ix<4; ix++ ){
            if( white.getNextBit() ){
                invertedSetToken( subboard, [ix,iy], token.WHITE );
            }
            if( black.getNextBit() ){
                invertedSetToken( subboard, [ix,iy], token.BLACK );
            }
        }
    }
    return subboard;
}

function invertedSetToken( subboard, spot, t ){
    let [x,y] = spot;
    subboardSetToken( subboard, [3-x,3-y], buildToken( t ) )
}