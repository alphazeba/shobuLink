import React, { useEffect, useState } from 'react';
import { useGameState } from '../../webAppLogic/GameLogic';
import { Board } from './Board';
import { MoveList } from './MoveList';
import { JoinShareWidget } from './JoinShareWidget';
import { isBlackMove, isWhiteMove, stateIsActive } from '../../util/stateHelper';
import { getPlayerTimeUsed } from './Clock';

export const GameLoader = ( { gameId, loginState } ) => {
    const gameState = useGameState();
    let alreadyRequestedGame = false;
    const [ gameIndex, setGameIndex ] = useState( 0 );
    const [ liveUpdate, setLiveUpdate ] = useState( true );
    const userId = loginState.loginInfo.id;
    const timeData = getPlayerTimeUsed( gameState.moves, gameState.startTime );

    useEffect( () => {
        if( gameIsNotLoaded() && !alreadyRequestedGame ){
            gameState.loadGame( gameId );
            // eslint-disable-next-line
            alreadyRequestedGame = true;
        }

        if( isViewingMostRecentMove() && ! liveUpdate ){
            setLiveUpdate( true );
        }

        if( liveUpdate && ! isViewingMostRecentMove() ){
            goToMostRecentIndex();
        }

        const interval = setInterval( ()=>{
            onPeriodicUpdate();
        }, 10 * 1000 );

        let abortSignal = new AbortController();
        document.addEventListener( 'keydown', handleKeyDownEvent, { signal: abortSignal.signal } );

        return () => {
            abortSignal.abort();
            clearInterval( interval );
        }
    } );

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

    const onPeriodicUpdate = () => {
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

    return <div className='container'>
            <div className='row'>
                <div className="col col-md-7">
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
                <div className="col col-md-5">
                    <MoveList curIndex={gameIndex} moves={gameState.moves} onGoToMove={handleGoToIndex}>
                        <button className={"btn myBtn"} onClick={goToBeginningIndex} >{"|<"}</button>
                        <button className={"btn myBtn"} onClick={goToPrevIndex}>{"<"}</button>
                        <button className={"btn myBtn"} onClick={goToNextIndex}>{">"}</button>
                        <button className={"btn myBtn"} onClick={goToMostRecentIndex} >{">|"}</button>
                    </MoveList>
                </div>
            </div>
        </div>;
}