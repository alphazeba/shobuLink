import React, { useEffect, useState } from 'react';
import { useGameState } from './GameLogic';
import { Board } from './Board';


export const GameLoader = ({ gameId, userId }) => {
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

    const handleMoveMade = ( fullMove ) => {
        gameState.playMove( fullMove );
    }

    return <div>
            <button onClick={getNextIndex}> click here dog </button>
            <button onClick={()=>gameState.loadGame(gameId)}> reload game </button>
            <Board boardState={getBoardState()} onMove={handleMoveMade} blackId={gameState.blackId} whiteId={gameState.whiteId} userId={userId}>loadedGameId: {gameState.gameId}</Board>
            <div>{JSON.stringify(gameState.history,null,2)}</div>
        </div>;
}