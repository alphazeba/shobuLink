
import React, { useEffect, useState } from 'react';
import { getLoginInfo } from './LoginPage';
import './JoinGameButton.css';
import { joinGame } from './api';

export const JoinGameButton = ({gameState}) => {
    const loginInfo = getLoginInfo();

    const playerAlreadyInGame = ( userId ) => {
        return userId == gameState.blackId || userId == gameState.whiteId;
    }
    const playerCannotJoinGame = () => {
        return loginInfo.id == null ||
            gameState.state != "waitingForPlayer" ||
            playerAlreadyInGame( loginInfo.id );
    }
    const handleJoinGame = () => {
        joinGame( gameState.gameId )
            .then( ( sideValue ) => {
                gameState.localJoinSide( sideValue, loginInfo.name, loginInfo.id );
            } );
    }


    if( playerCannotJoinGame() ){
        return <div/>;
    }
    return <div>
            <button className='joinGameButton btn' onClick={handleJoinGame}>
                Join Game
            </button>
        </div>
}