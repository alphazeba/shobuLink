import React, { useState, useEffect } from 'react'
import { getPlayerGames } from './api.js'
import { parsePreview, winCheckToWinState } from '../util/stateHelper.js';
import { checkForWin } from '../gameLogic/gameoverChecker.js';

export const GamePreviewLogic = () => {

    const [ loadedUserId, setLoadedUserId ] = useState( null );
    const [ gamePreviews, setGamePreviews ] = useState( [] );
    const [ waitingForResponse, setWaitingForResponse ] = useState( false );

    const loadGamePreviews = ( userId ) => {
        if( waitingForResponse || userId == loadedUserId ){
            return false;
        }
        getPlayerGames( userId ).then( ( gamePreviews ) => {
            handleGamePreviewUpdate( gamePreviews, userId );
        } );
        setWaitingForResponse( true );
    }

    const handleGamePreviewUpdate = ( gamePreviews, userId ) => {
        setLoadedUserId( userId );
        setWaitingForResponse( false );
        for( let i=0; i<gamePreviews.length; i++ ){
            let gp = gamePreviews[i];
            gamePreviews[i].boardState = parsePreview( gamePreviews[i].prv );
            gamePreviews[i].gameState =  winCheckToWinState( checkForWin( gamePreviews[i].boardState ) );
        }
        setGamePreviews( gamePreviews );
        console.log( gamePreviews );
    }

    return {
        gamePreviews: gamePreviews,
        loadGamePreviews: loadGamePreviews
    }
}