import { useEffect, useState, useRef } from 'react'
import { getGame, getGameUpdate, playMove } from './api.js'
import { initBoard, makeValidatedMove } from '../gameLogic/board.js';
import { validateFullMove } from '../gameLogic/moveValidation.js';
import { parseMove } from '../gameLogic/moveParser.js';
import { side } from '../gameLogic/token.js';
import { useLoginState } from '../pages/LoginPage.js';
import { useWebsocket } from './websocketApi.js';
import { useStateRef } from '../util/stateRef.js';
import { stateIsActive } from '../util/stateHelper.js';

const SUBSCRIBE_REFRESH_MINS = 2;

export const useGameState = () => {

    const [ history, historyRef, setHistory ] = useStateRef( null );
    const [ loadedGameId, loadedGameIdRef, setLoadedGameId ] = useStateRef( null );
    const [ waitingForResponse, setWaitingForResponse ] = useState( false );
    const [ gameIsCorrupted, setGameIsCorrupted ] = useState( false );
    const [ blackId, setBlackId ] = useState( null );
    const [ whiteId, setWhiteId ] = useState( null );
    const [ blackName, setBlackName ] = useState( null );
    const [ whiteName, setWhiteName ] = useState( null );
    const [ moves, movesRef, setMoves ] = useStateRef( [] );
    const [ gameState, setGameState ] = useState( null );
    const [ startTime, setStartTime ] = useState( 0 );
    const [ secs, setSecs ] = useState( 0 );
    const [ lastMoveTimestamp, setLastMoveTimestamp ] = useState( 0 );
    const loginState = useLoginState();

    const loadGame = ( gameId ) => {
        if( waitingForResponse ){
            return false;
        }
        let promise = null;
        if( gameId === loadedGameId && !gameIsCorrupted ){ // if corrupted, we want full reload.
            promise = getGameUpdate( gameId, getLastMoveTimestamp() );
        }
        else {
            promise = getGame( gameId );
        }
        promise.then( ( game ) => {
            handleGameUpdate( game );
        } );
        setWaitingForResponse( true );
        return true;
    }

    const getLastMoveTimestamp = () => {
        return lastMoveTimestamp;
    }

    const sendMoveToServer = ( fullMove, loginInfo ) => {
        playMove( loginState.loginInfo, loadedGameId, fullMove, loginInfo ).then( ( game ) =>{
            handleGameUpdate( game );
        } );
        setWaitingForResponse( true );
    }

    const localJoinSideUpdate = ( sideValue, name, id ) =>{
        if( sideValue === side.BLACK ){
            setBlackId( id );
            setBlackName( name );
        }
        else {
            setWhiteId( id );
            setWhiteName( name );
        }
    }

    // does this handle the api response?
    // this fn is getting passed in a callback and all state values are from a snapshot at that time.
    const handleGameUpdate = ( game ) => {
        console.log( "handleGameUpdate: ", game );
        let mutableHistory = null;
        let mutableMoves = null;
        let newMoves = null;
        if( game.id === loadedGameIdRef.current ){
            console.log("this is an update to existing game: gameId: ", game.id, " loadedGameId: ", loadedGameIdRef.current);
            newMoves = getNewMoves( game.moves );
            mutableHistory = deepCloneArray( historyRef.current );
            mutableMoves = deepCloneArray( movesRef.current );
        }
        else {
            // replace the history since this is a different game than was loaded.
            console.log("this is a new game, clearing history: gameId: ", game.id, " loadedGameId: ", loadedGameIdRef.current);
            newMoves = game.moves;
            mutableHistory = initHistory();
            mutableMoves = [];
        }
        console.log("mutable moves before update: ", mutableMoves);
        console.log("mutable history before update: ", mutableHistory);
        for( let move of newMoves ){
            addMoveToHistory( mutableHistory, mutableMoves, move );
        }
        setHistory( mutableHistory );
        setLoadedGameId( game.id );
        setWaitingForResponse( false );
        setGameIsCorrupted( false );
        setBlackId( game.buId );
        setWhiteId( game.wuId );
        setBlackName( game.buName );
        setWhiteName( game.wuName );
        setMoves( mutableMoves );
        setGameState( game.state );
        setStartTime( game.startTime );
        setSecs( game.secs );
        console.log("mutable moves after udpate: ", mutableMoves);
        console.log("mutable history after update: ", mutableHistory);
    }

    const handleWebsocket = (data) => {
        console.log("recieved update from websocket: ", data);
        if (data.type === "gameUpdate") {
            handleGameUpdate(data.game);
        }
    }

    // passing the callback this way doesn't work.
    const shouldHaveOpenConnection = () => {
        return loadedGameId != null && stateIsActive(gameState);
    }
    const websocketConnection = useWebsocket(handleWebsocket, shouldHaveOpenConnection());

    useEffect(() => {
        const subscribeFn = () => {
            if (loadedGameId === null) {
                console.log("loadedGameId is nothing, will not subscribe to it.");
                return;
            }
            console.log("subscribing to gameId: ", loadedGameId);
            websocketConnection.send({
                type: "SubscribeToGame",
                gameId: loadedGameId,
            });
        }
        subscribeFn(); // call immediately, then on a timer.
        const interval = setInterval(subscribeFn, SUBSCRIBE_REFRESH_MINS * 60 * 1000);
        return () => {
            clearInterval(interval);
        }
    }, [loadedGameId]);

    const addMoveToHistory = ( history, moves, incomingMove ) => {
        if( gameIsCorrupted ){
            console.log("Game is corrupted");
            return;
        }
        const fullMove = parseMove( incomingMove.m );
        let board = history[ history.length-1 ];
        if( ! validateFullMove( board, fullMove ) ){
            setGameIsCorrupted( true );
            return;
        }
        // need to update the board now.
        let newBoard = makeValidatedMove( board, fullMove );
        history.push( newBoard );
        moves.push(incomingMove);
        setLastMoveTimestamp( incomingMove.t );
    }

    const getNewMoves = ( incomingMoves ) => {
        const latestTimestamp = getLastMoveTimestamp();
        let newMoves = [];
        for( let incomingMove of incomingMoves ){
            if( incomingMove.t > latestTimestamp ){
                newMoves.push( incomingMove );
            }
        }
        return newMoves;
    }

    return {
        history: getUsableHistory( history ),
        moves: moves,
        gameId: loadedGameId,
        loadGame: loadGame,
        playMove: sendMoveToServer,
        gameStateCorrupted: gameIsCorrupted,
        blackId: blackId,
        whiteId: whiteId,
        blackName: blackName,
        whiteName: whiteName,
        state: gameState,
        startTime: startTime,
        secs: secs,
        localJoinSide: localJoinSideUpdate,
    }
}

function deepCloneArray( items ){
    return items.map( ( item ) => {
        if( Array.isArray( item ) ){
            return deepCloneArray( item );
        }
        return item;
    })
}

function getUsableHistory( history ){
    if( history === null ){
        return initHistory();
    }
    return history
}

function initHistory(){
    return [
        initBoard()
    ];
}