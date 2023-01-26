
import React, { useState, useEffect } from 'react'
import { getGame, playMove } from './api.js'
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

    const loadGame = ( gameId ) => {
        if( waitingForResponse ){
            return false;
        }
        getGame( gameId ).then( ( game ) => {
            handleGameUpdate( game );
        } );
        setWaitingForResponse( true );
        return true;
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
        var newMoves = null;
        if( game.id == loadedGameId ){
            newMoves = getNewMoves( history, game.moves );
            mutableHistory = deepCloneArray( history );
        }
        else{
            // replace the history since this is a different game than was loaded.
            newMoves = game.moves;
            mutableHistory = initHistory();
        }
        for( var move of newMoves ){
            addMoveToHistory( mutableHistory, move.m );
        }
        setHistory( mutableHistory );
        setLoadedGameId( game.id );
        setWaitingForResponse( false );
        setGameIsCorrupted( false );
        setBlackId( game.buId );
        setWhiteId( game.wuId );
        setBlackName( game.buName );
        setWhiteName( game.wuName );
        setMoves( game.moves );
        setGameState( game.state );
    }

    const addMoveToHistory = ( history, incomingMove ) => {
        if( gameIsCorrupted ){
            return;
        }
        const fullMove = parseMove( incomingMove );
        var board = history[ history.length-1 ];
        if( ! validateFullMove( board, fullMove ) ){
            setGameIsCorrupted( true );
            return;
        }
        // need to update the board now.
        var newBoard = makeValidatedMove( board, fullMove );
        history.push( newBoard );
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
        localJoinSide: localJoinSideUpdate,
    }
}

const getNewMoves = ( curHistory, incomingMoves ) => {
    // subtract 1 because history includes the "init board", while incoming moves would not.
    const lHistory = curHistory.length - 1; 
    const lIncome = incomingMoves.length;
    if( lHistory == lIncome ){
        return [];
    }
    if( lHistory > lIncome ){
        throw new Error("somehow the existing history is longer than the incoming moves.")
    }
    return incomingMoves.slice( lHistory-lIncome );
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