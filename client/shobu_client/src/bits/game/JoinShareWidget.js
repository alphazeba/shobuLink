import React, {Fragment, useState} from 'react';
import './JoinShareWidget.css';
import { cancelGame, joinGame } from '../../webAppLogic/api';

export const JoinShareWidget = ({gameState, loginState, onGameCancelled}) => {

    const [waitingForCancel, setWaitingForCancel] = useState(false);

    const gameIsJoinable = () => {
        return gameState.state === "waitingForPlayer";
    }
    
    const thisPlayerIsInGame = () => {
        return loginState.isLoggedIn && ( 
            loginState.loginInfo.id === gameState.blackId || 
            loginState.loginInfo.id === gameState.whiteId );
    }
    const waitingForStart = () => {
        // check if both blackid and whiteId are filled.
        return gameState.blackId != undefined && gameState.whiteId != undefined;
    }

    const handleJoinGame = () => {
        joinGame( loginState.loginInfo, gameState.gameId )
            .then( ( sideValue ) => {
                gameState.localJoinSide( sideValue, loginState.loginInfo.name, loginState.loginInfo.id );
            } );
    }

    const initiateCancel = () => {
        setWaitingForCancel(true);
        cancelGame(loginState.loginInfo, gameState.gameId)
            .then( (result) => {
                setWaitingForCancel(false);
                if (result.gameCancelled) {
                    onGameCancelled();
                    return;
                }
                console.log(result.reason);
            });
    }

    const handleCancelGame = () => {
        if (waitingForCancel) {
            return;
        }
        initiateCancel();
    }

    const getUrl = () => {
        return window.location.href;
    }

    if( ! gameIsJoinable() ){
        return <div/>;
    }
    if( ! loginState.isLoggedIn() ){
        return <div className='gameShareHelper'>
            You must log in to join
        </div>
    }
    if( waitingForStart() ) {
        return <div className='gameShareHelper'>
                Waiting for game to start
            </div>
    }
    if( thisPlayerIsInGame() ){
        return <Fragment>
            <div className='gameShareHelper'>
                Share the url with your opponent
            </div>
            <button
                className='gameShareHelper gameShareCancelButton'
                onClick={handleCancelGame}
            >
                { waitingForCancel ? "loading..." : "Cancel game" }
            </button>
        </Fragment>
    }
    // player is not in game
    return <button className='joinGameButton btn myBtn' onClick={handleJoinGame}>
        Join Game
    </button>;
}