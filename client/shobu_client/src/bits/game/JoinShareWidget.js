import React, {useState} from 'react';
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
        return <div className='gameShareHelper'>
            Share the url with your opponent
        </div>
    }
    // player is not in game
    return <button className='joinGameButton btn myBtn' onClick={handleJoinGame}>
        Join Game
    </button>;
}