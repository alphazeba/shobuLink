import React, { useEffect, useState } from 'react';
import { useGameState } from '../../webAppLogic/GameLogic';
import { Board } from './Board';
import { MoveList } from './MoveList';
import { JoinShareWidget } from './JoinShareWidget';
import { isBlackMove, isWhiteMove, stateIsActive } from '../../util/stateHelper';
import './GameLoader.css';

export const GameLoader = ( { gameId, loginState } ) => {
    const gameState = useGameState();
    const [ gameIndex, setGameIndex ] = useState( 0 );
    const [ liveUpdate, setLiveUpdate ] = useState( true );
    const userId = loginState.loginInfo.id;
    const timeData = gameState.timeData;

    useEffect(() => {
        if( gameIsNotLoaded() ){
            gameState.loadGame( gameId );
        }
    }, [gameId]);

    useEffect(() => {
        let abortSignal = new AbortController();
        document.addEventListener( 'keydown',
            handleKeyDownEvent,
            { signal: abortSignal.signal } );
        const loadGameInterval = setInterval( ()=>{
            onLoadGameInterval();
        }, 100 * 1000 );
        return () => {
            abortSignal.abort();
            clearInterval( loadGameInterval );
        }
    }, [])

    useEffect(() => {
        if( isViewingMostRecentMove() && ! liveUpdate ){
            setLiveUpdate( true );
        }
        if( liveUpdate && ! isViewingMostRecentMove() ){
            goToMostRecentIndex();
        }
    });

    const handleKeyDownEvent = ( event ) => {
        if( event.key === "ArrowRight" ){
            goToNextIndex();
        }
        if( event.key === "ArrowLeft" ){
            goToPrevIndex();
        }
        if( event.key === "ArrowUp" ){
            goToBeginningIndex();
        }
        if( event.key === "ArrowDown" ){
            goToMostRecentIndex();
        }
    }

    const isViewingMostRecentMove = () => {
        return gameIndex >= gameState.history.length - 1;
    }

    const gameIsNotLoaded = () => {
        return gameId !== gameState.gameId;
    }

    const itIsNotYourTurn = () => {
        if( userId === gameState.blackId ){
            return ! isBlackMove( gameState.state );
        }
        else if( userId === gameState.whiteId ){
            return ! isWhiteMove( gameState.state );
        }
        return true;
    }

    const onLoadGameInterval = () => {
        if( stateIsActive( gameState.state ) && itIsNotYourTurn() ){
            gameState.loadGame( gameId );
        }
    }

    const getBoardState = () => {
        const index = Math.min( gameState.history.length-1, gameIndex );
        let boardState = gameState.history[ index ];
        return boardState;
    }

    const goToNextIndex = () => {
        handleGoToIndex( gameIndex + 1 );
    }

    const goToPrevIndex = () => {
        handleGoToIndex( gameIndex - 1 );
    }
    
    const goToBeginningIndex = () => {
        handleGoToIndex( 0 );
    }

    const goToMostRecentIndex = () => {
        let nextIndex = gameState.history.length - 1;
        handleGoToIndex( nextIndex );
    }

    const handleGoToIndex = ( index ) => {
        if( index >= gameState.history.length || index < 0 ){
            return;
        }
        if( index < gameState.history.length - 1 ){
            setLiveUpdate( false );
        }
        setGameIndex( index );
    }

    const handleMoveMade = ( fullMove ) => {
        gameState.playMove( fullMove );
    }

    const isGamePlayable = () => {
        let gameIsActive = gameState.state === "blackMove" || gameState.state === "whiteMove";
        return gameIndex === gameState.history.length-1 && gameIsActive;
    }

    return <div className='gameLoaderContainer'>
                <div className="gameLoaderChild">
                    <Board 
                        boardState={getBoardState()} 
                        onMove={handleMoveMade} 
                        blackId={gameState.blackId} whiteId={gameState.whiteId}
                        blackName={gameState.blackName} whiteName={gameState.whiteName}
                        userId={userId}
                        playable={isGamePlayable()}
                        gameState={gameState.state}
                        timeData={timeData}
                    >
                        <JoinShareWidget gameState={gameState} loginState={loginState} />
                    </Board>
                </div>
                <div className="gameLoaderChild">
                    <MoveList
                        curIndex={gameIndex}
                        moves={gameState.moves}
                        onGoToMove={handleGoToIndex}
                    >
                        <button className={"btn myBtn"} onClick={goToBeginningIndex} >
                            {"|<"}</button>
                        <button className={"btn myBtn biggerSelector"} onClick={goToPrevIndex}>
                            {"<"}</button>
                        <button className={"btn myBtn biggerSelector"} onClick={goToNextIndex}>
                            {">"}</button>
                        <button className={"btn myBtn"} onClick={goToMostRecentIndex} >
                            {">|"}</button>
                    </MoveList>
                </div>
        </div>;
}