import React, { useState, useEffect } from 'react'
import { getPlayerGames } from './api.js'

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
        setGamePreviews( gamePreviews );
    }

    return {
        gamePreviews: gamePreviews,
        loadGamePreviews: loadGamePreviews
    }
}