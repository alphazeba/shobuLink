import React, {useState} from 'react';
import './JoinShareWidget.css';
import { joinGame } from '../../webAppLogic/api';

export const JoinShareWidget = ({gameState, loginState}) => {

    const [ linkCopied, setLinkCopied ] = useState( false );

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
    const copyShareLinkToClipboard = () => {
        navigator.clipboard.writeText(getUrl());
        setLinkCopied(true);
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
        return <button className='joinGameButton btn myBtn' onClick={copyShareLinkToClipboard}>
            {   linkCopied ?
                "Challenge link copied, now share it" :
                "Click here to copy challenge link"
            }
        </button>
    }
    // player is not in game
    return <button className='joinGameButton btn myBtn' onClick={handleJoinGame}>
        Join Game
    </button>;
}