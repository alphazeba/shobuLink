import { useState } from 'react'
import { getPlayerGames } from './api.js'
import { parsePreview } from '../util/stateHelper.js';

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
            gamePreviews[i].boardState = parsePreview( gamePreviews[i].prv );
        }
        setGamePreviews( gamePreviews );
        console.log( gamePreviews );
    }

    return {
        gamePreviews: gamePreviews,
        loadGamePreviews: loadGamePreviews
    }
}