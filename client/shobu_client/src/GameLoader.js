import React, { useEffect, useState } from 'react';
import { useGameState } from './GameLogic';
import { Board } from './Board';
import { MoveList } from './MoveList';


export const GameLoader = ({ gameId, userId }) => {
    const gameState = useGameState();
    var alreadyRequestedGame = false;
    const [ gameIndex, setGameIndex ] = useState( 0 );
    const [ liveUpdate, setLiveUpdate ] = useState( true );

    const onGameUpdated = () => {
        if( liveUpdate ){
            goToMostRecentIndex();
        }
    }

    useEffect( () => {
        if( gameId != gameState.gameId && !alreadyRequestedGame ){
            var requestedGame = gameState.loadGame( gameId );
            alreadyRequestedGame = true;
        }
        if( liveUpdate && gameIndex < gameState.history.length - 1 ){
            goToMostRecentIndex();
        }
    } );

    const getBoardState = () => {
        const index = Math.min( gameState.history.length-1, gameIndex );
        var boardState = gameState.history[ index ];
        return boardState;
    }

    const getNextIndex = () => {
        var nextIndex = gameIndex + 1;
        if( nextIndex < gameState.history.length ){
            setGameIndex( nextIndex );
        }
        setLiveUpdate( false );
    }

    const getPrevIndex = () => {
        var nextIndex = gameIndex - 1;
        if( nextIndex >= 0 ){
            setGameIndex( nextIndex );
        }
        setLiveUpdate( false );
    }

    const handleGoToIndex = ( index ) => {
        setGameIndex( index );
        setLiveUpdate( false );
    }

    const goToMostRecentIndex = () => {
        setGameIndex( gameState.history.length - 1 );
        setLiveUpdate( true );
    }

    const handleMoveMade = ( fullMove ) => {
        gameState.playMove( fullMove, getLoginInfo() );
    }

    const getLoginInfo = () => {
        return {
            id: userId,
            token: "LOGGEDIN"
        }
    }

    return <div>
            <div>
                <button onClick={getPrevIndex}>{"<--"}</button><button onClick={getNextIndex}>{"-->"}</button><button onClick={goToMostRecentIndex} >most recent move</button>
            </div>
            <button onClick={getNextIndex}> next move </button><button onClick={goToMostRecentIndex} >most recent move</button>
            <button onClick={()=>gameState.loadGame(gameId)}> reload game </button>
            <div>
                <div className="column">

                    <Board 
                        boardState={getBoardState()} 
                        onMove={handleMoveMade} 
                        blackId={gameState.blackId} whiteId={gameState.whiteId} 
                        userId={userId}>loadedGameId: {gameState.gameId}
                    </Board>
                </div>
                <div className="column">
                    <MoveList moves={gameState.moves} onGoToMove={handleGoToIndex}/>
                </div>
            </div>
        </div>;
}