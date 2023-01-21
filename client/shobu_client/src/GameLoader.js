import React, { useEffect, useState } from 'react';
import { useGameState } from './GameLogic';
import { Board } from './Board';


export const GameLoader = ({ gameId }) => {
    const gameState = useGameState();

    const [ gameIndex, setGameIndex ] = useState( 0 );

    useEffect( () => {
        if( gameId != gameState.gameId ){
            var requestedGame = gameState.loadGame( gameId );
        }
    } );

    const getBoardState = () => {
        const index = Math.min( gameState.history.length-1, gameIndex );
        var boardState = gameState.history[ index ];
        return boardState;
    }

    const getNextIndex = () => {
        setGameIndex( ( gameIndex + 1 ) % gameState.history.length );
    }

    return <div>
            <button onClick={getNextIndex}> click here dog </button>
            <Board boardState={getBoardState()}>loadedGameId: {gameState.gameId}</Board>
        </div>;
}