
import React, { useState } from 'react'
import getGame from './api.js'
import { initBoard } from './logic/board.js';

export const useGameState = ( gameId ) => {

    const [ history, setHistory ] = useState( null );
    const [ loadedGameId, setLoadedGameId ] = useState( null );

    const loadGame = ( gameId ) => {
        getGame( gameId ).then( ( game ) => {
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
                addMoveToHistory( mutableHistory, move );
            }
            setHistory( mutableHistory );
            setLoadedGameId( gameId )
        });
    }
    
    return [ 
        getUsableHistory( history ),
        loadedGameId,
    ]
}

function addMoveToHistory( history, incomingMove ){
    const move = parseMove( incomingMove );
    var board = history[ history.length-1 ];
}

function parseMove( move ){

}

function getNewMoves( curHistory, incomingMoves ){
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
    ]
}