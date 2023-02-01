
import React, { useState, useEffect } from 'react'
import { getGame, getGameUpdate, playMove } from './api.js'
import { initBoard, makeValidatedMove } from './logic/board.js';
import { validateFullMove } from './logic/moveValidation.js';
import { parseMove } from './logic/moveParser.js';
import { side } from './logic/token.js';

export const useGameState = () => {

    const [ history, setHistory ] = useState( null );
    const [ loadedGameId, setLoadedGameId ] = useState( null );
    const [ waitingForResponse, setWaitingForResponse ] = useState( false );
    const [ gameIsCorrupted, setGameIsCorrupted ] = useState( false );
    const [ blackId, setBlackId ] = useState( null );
    const [ whiteId, setWhiteId ] = useState( null );
    const [ blackName, setBlackName ] = useState( null );
    const [ whiteName, setWhiteName ] = useState( null );
    const [ moves, setMoves ] = useState( [] );
    const [ gameState, setGameState ] = useState( null );
    const [ startTime, setStartTime ] = useState( 0 );
    const [ lastMoveTimestamp, setLastMoveTimestamp ] = useState( 0 );

    const loadGame = ( gameId ) => {
        if( waitingForResponse ){
            return false;
        }
        var promise = null;
        if( gameId == loadedGameId ){
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
        playMove( loadedGameId, fullMove, loginInfo ).then( ( game ) =>{
            handleGameUpdate( game );
        } );
        setWaitingForResponse( true );
    }

    const localJoinSideUpdate = ( sideValue, name, id ) =>{
        if( sideValue == side.BLACK ){
            setBlackId( id );
            setBlackName( name );
        }
        else {
            setWhiteId( id );
            setWhiteName( name );
        }
    }

    const handleGameUpdate = ( game ) => {
        console.log( game );
        var mutableHistory = null;
        var mutableMoves = null;
        var newMoves = null;
        if( game.id == loadedGameId ){
            newMoves = getNewMoves( game.moves );
            mutableHistory = deepCloneArray( history );
            mutableMoves = deepCloneArray( moves );
        }
        else {
            // replace the history since this is a different game than was loaded.
            newMoves = game.moves;
            mutableHistory = initHistory();
            mutableMoves = [];
        }
        for( var move of newMoves ){
            addMoveToHistory( mutableHistory, move );
            mutableMoves.push( move );
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
    }

    const addMoveToHistory = ( history, incomingMove ) => {
        if( gameIsCorrupted ){
            return;
        }
        const fullMove = parseMove( incomingMove.m );
        var board = history[ history.length-1 ];
        if( ! validateFullMove( board, fullMove ) ){
            setGameIsCorrupted( true );
            return;
        }
        // need to update the board now.
        console.log( "move being added to board ") ;
        console.log( incomingMove );
        var newBoard = makeValidatedMove( board, fullMove );
        history.push( newBoard );
        setLastMoveTimestamp( incomingMove.t );
    }

    const getNewMoves = ( incomingMoves ) => {
        console.log( incomingMoves );
        const latestTimestamp = getLastMoveTimestamp();
        var newMoves = [];
        for( var incomingMove of incomingMoves ){
            console.log( incomingMove );
            console.log( latestTimestamp ); // this is undefined.
            if( incomingMove.t > latestTimestamp ){
                newMoves.push( incomingMove );
            }
        }
        console.log( newMoves );
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
    if( history == null ){
        return initHistory();
    }
    return history
}

function initHistory(){
    return [
        initBoard()
    ];
}