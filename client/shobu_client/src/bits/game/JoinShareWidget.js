import React from 'react';
import './JoinShareWidget.css';
import { joinGame } from '../../webAppLogic/api';

export const JoinShareWidget = ({gameState, loginState}) => {

    const gameIsJoinable = () => {
        return gameState.state === "waitingForPlayer";
    }
    
    const thisPlayerIsInGame = () => {
        return loginState.isLoggedIn && ( 
            loginState.loginInfo.id === gameState.blackId || 
            loginState.loginInfo.id === gameState.whiteId );
    }

    const handleJoinGame = () => {
        joinGame( loginState.loginInfo, gameState.gameId )
            .then( ( sideValue ) => {
                gameState.localJoinSide( sideValue, loginState.loginInfo.name, loginState.loginInfo.id );
            } );
    }

    if( ! gameIsJoinable() ){
        return <div/>;
    }
    if( ! loginState.isLoggedIn() ){
        return <div className='gameShareHelper'>
            You must log in to join
        </div>
    }
    if( thisPlayerIsInGame() ){
        return <div className='gameShareHelper'>
            {window.location.href}
            <div className='gameShareHelperInner'>
                Copy & share the URL to challenge a friend 
            </div>
        </div>
    }
    return <button className='joinGameButton btn myBtn' onClick={handleJoinGame}>
        Join Game
    </button>;
}