import React from 'react';
import { useLoginState } from '../../pages/LoginPage';
import './JoinGameButton.css';
import { joinGame } from '../../webAppLogic/api';

export const JoinGameButton = ({gameState}) => {
    const loginState = useLoginState();

    const playerAlreadyInGame = ( userId ) => {
        return userId === gameState.blackId || userId === gameState.whiteId;
    }
    const playerCannotJoinGame = () => {
        return !loginState.isLoggedIn() ||
            gameState.state !== "waitingForPlayer" ||
            playerAlreadyInGame( loginState.loginInfo.id );
    }
    const handleJoinGame = () => {
        joinGame( loginState.loginInfo, gameState.gameId )
            .then( ( sideValue ) => {
                gameState.localJoinSide( sideValue, loginState.loginInfo.name, loginState.loginInfo.id );
            } );
    }

    if( playerCannotJoinGame() ){
        return <div/>;
    }
    return <button className='joinGameButton btn myBtn' onClick={handleJoinGame}>
        Join Game
    </button>;
}