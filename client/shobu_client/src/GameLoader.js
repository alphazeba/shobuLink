import React, { useEffect, useState } from 'react';
import { useGameState } from './GameLogic';
import { Board } from './Board';
import { MoveList } from './MoveList';
import { getLoginInfo } from './LoginPage';
import { JoinGameButton } from './JoinGameButton';
import { isBlackMove, isWhiteMove, stateIsActive } from './util/stateHelper';
import { Clock, getPlayerTimeUsed } from './Clock';

export const GameLoader = ( { gameId } ) => {
    const gameState = useGameState();
    var alreadyRequestedGame = false;
    const [ gameIndex, setGameIndex ] = useState( 0 );
    const [ liveUpdate, setLiveUpdate ] = useState( true );
    const loginInfo = getLoginInfo();
    const userId = loginInfo.id;
    const timeData = getPlayerTimeUsed( gameState.moves, gameState.startTime );

    useEffect( () => {
        if( gameIsNotLoaded() && !alreadyRequestedGame ){
            gameState.loadGame( gameId );
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
        return () => clearInterval( interval );
    } );

    const isViewingMostRecentMove = () => {
        return gameIndex >= gameState.history.length - 1;
    }

    const gameIsNotLoaded = () => {
        return gameId != gameState.gameId;
    }

    const itIsNotYourTurn = () => {
        if( userId == gameState.blackId ){
            return ! isBlackMove( gameState.state );
        }
        else if( userId == gameState.whiteId ){
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
        var boardState = gameState.history[ index ];
        return boardState;
    }

    const debugIndex = ( index ) => {
        console.log( "index: " + index.toString() + " history length: " + gameState.history.length );
    }

    const getNextIndex = () => {
        var nextIndex = gameIndex + 1;
        debugIndex( nextIndex );
        if( nextIndex < gameState.history.length ){
            setGameIndex( nextIndex );
        }
    }

    const getPrevIndex = () => {
        setLiveUpdate( false );
        var nextIndex = gameIndex - 1;
        debugIndex( nextIndex );
        if( nextIndex >= 0 ){
            setGameIndex( nextIndex );
        }
    }

    const handleGoToIndex = ( index ) => {
        if( index < gameState.history.length - 1 ){
            setLiveUpdate( false );
        }
        debugIndex( index );
        setGameIndex( index );
    }

    const goToMostRecentIndex = () => {
        var nextIndex = gameState.history.length - 1;
        debugIndex( nextIndex );
        setGameIndex( nextIndex );
    }

    const handleMoveMade = ( fullMove ) => {
        gameState.playMove( fullMove );
    }

    const isGamePlayable = () => {
        var gameIsActive = gameState.state == "blackMove" || gameState.state == "whiteMove";
        return gameIndex == gameState.history.length-1 && gameIsActive;
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
                    />
                    <JoinGameButton gameState={gameState} />
                </div>
                <div className="col col-md-5">
                    <Clock 
                        time={timeData.blackTime} 
                        lastTimestamp={timeData.lastTimestamp} 
                        ticking={true} 
                    />
                    <MoveList curIndex={gameIndex} moves={gameState.moves} onGoToMove={handleGoToIndex}>
                        <button onClick={getPrevIndex}>{"<--"}</button>
                        <button onClick={getNextIndex}>{"-->"}</button>
                        <button onClick={goToMostRecentIndex} >most recent move</button>
                    </MoveList>
                    <Clock 
                        time={timeData.whiteTime} 
                        lastTimestamp={timeData.lastTimestamp} 
                        ticking={false} 
                    />
                </div>
            </div>
        </div>;
}



// http://localhost:3000/game/c29879f9-b521-474a-add0-84badfc3edc6