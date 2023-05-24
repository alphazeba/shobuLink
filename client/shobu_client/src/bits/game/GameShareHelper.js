import React from 'react';
import { useLoginState } from '../../pages/LoginPage';
import './JoinGameButton.css';
import { joinGame } from '../../webAppLogic/api';


export const GameShareHelper = ({gameState}) => {
    const loginState = useLoginState();

    const playerIsInGame = () => {
        return loginState.loginInfo.id === gameState.blackId || loginState.loginInfo.id === gameState.whiteId;
    }

    if( loginState.isLoggedIn() && playerIsInGame() ){
        return <div className='gameShareHelper'>
            {window.location.href}
            <div className='gameShareHelperInner'>
                Copy & share the URL to challenge a friend 
            </div>
        </div>
    }
    return <div />;
}