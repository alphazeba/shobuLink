
import React, { useState, useEffect } from 'react'
import { getGame, playMove } from './api.js'
import { initBoard, makeValidatedMove } from './logic/board.js';
import { validateFullMove } from './logic/moveValidation.js';
import { parseMove } from './logic/moveParser.js';

export const useGameState = () => {

    const [ history, setHistory ] = useState( null );
    const [ loadedGameId, setLoadedGameId ] = useState( null );
    const [ waitingForResponse, setWaitingForResponse ] = useState( false );
    const [ gameStateCorrupted, setGameStateCorrupted ] = useState( false );
    const [ blackId, setBlackId ] = useState( null );
    const [ whiteId, setWhiteId ] = useState( null );

    const loadGame = ( gameId ) => {
        if( waitingForResponse ){
            return false;
        }
        getGame( gameId ).then( handleGameUpdate );
        setWaitingForResponse( true );
        return true;
    }

    const sendMoveToServer = ( fullMove ) => {
        playMove( loadedGameId, fullMove ).then( handleGameUpdate );
        setWaitingForResponse( true );
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
        setGameStateCorrupted( false );
        setBlackId( game.buId );
        setWhiteId( game.wuId );
    }

    const addMoveToHistory = ( history, incomingMove ) => {
        if( gameStateCorrupted ){
            return;
        }
        const fullMove = parseMove( incomingMove );
        var board = history[ history.length-1 ];
        if( ! validateFullMove( board, fullMove ) ){
            setGameStateCorrupted( true );
            return;
        }
        // need to update the board now.
        var newBoard = makeValidatedMove( board, fullMove );
        history.push( newBoard );
    }

    
    return {
        history: getUsableHistory( history ),
        gameId: loadedGameId,
        loadGame: loadGame,
        playMove: sendMoveToServer,
        gameStateCorrupted: gameStateCorrupted,
        blackId: blackId,
        whiteId: whiteId
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
    items.map( ( item ) => {
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