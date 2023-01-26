import React, { useEffect, useState } from 'react';
import { useGameState } from './GameLogic';
import { Board } from './Board';
import { MoveList } from './MoveList';
import { getLoginInfo } from './LoginPage';
import { JoinGameButton } from './JoinGameButton';
import { isBlackMove, isWhiteMove, stateIsActive } from './util/stateHelper';

export const GameLoader = ({ gameId }) => {
    const gameState = useGameState();
    var alreadyRequestedGame = false;
    const [ gameIndex, setGameIndex ] = useState( 0 );
    const [ liveUpdate, setLiveUpdate ] = useState( true );
    const loginInfo = getLoginInfo();
    const userId = loginInfo.id;

    const onGameUpdated = () => {
        if( liveUpdate ){
            goToMostRecentIndex();
        }
    }

    useEffect( () => {
        if( gameIsNotLoaded() && !alreadyRequestedGame ){
            gameState.loadGame( gameId );
            alreadyRequestedGame = true;
        }
        console.log( "live update " );
        console.log( liveUpdate );
        if( liveUpdate && gameIndex < gameState.history.length - 1 ){
            goToMostRecentIndex();
        }
        const interval = setInterval( ()=>{
            console.log( "do a thing occasionally")
            onPeriodicUpdate();
        }, 3 * 1000 );

        return () => clearInterval( interval );
    } );

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

    const getNextIndex = () => {
        var nextIndex = gameIndex + 1;
        if( nextIndex < gameState.history.length ){
            setGameIndex( nextIndex );
        }
        if( nextIndex >= gameState.history.length - 1){
            setLiveUpdate( true );
        }
        else {
            setLiveUpdate( false );
        }
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
                    <MoveList curIndex={gameIndex} moves={gameState.moves} onGoToMove={handleGoToIndex}>
                        <button onClick={getPrevIndex}>{"<--"}</button>
                        <button onClick={getNextIndex}>{"-->"}</button>
                        <button onClick={goToMostRecentIndex} >most recent move</button>
                    </MoveList>
                </div>
            </div>
        </div>;
}