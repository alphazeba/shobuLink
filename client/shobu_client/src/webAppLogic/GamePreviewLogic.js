import { useState } from 'react'
import { getPlayerActiveGames, getPlayerGames } from './api.js'
import { parsePreview } from '../util/stateHelper.js';

const MODE_ACTIVE = 69;
const MODE_COMPLETE = 420;

export const useActivePreview = () => {
    return GamePreviewLogic(MODE_ACTIVE);
}

export const useCompletePreview = () => {
    return GamePreviewLogic(MODE_COMPLETE);
}

const GamePreviewLogic = (mode) => {
    const [ loadedUserId, setLoadedUserId ] = useState( null );
    const [ gamePreviews, setGamePreviews ] = useState( [] );
    const [ waitingForResponse, setWaitingForResponse ] = useState( false );

    const getGetGamesFn = (mode) => {
        if (mode === MODE_ACTIVE) {
            return getPlayerActiveGames;
        }
        return getPlayerGames;
    }
    const loadGamePreviews = ( userId ) => {
        if( waitingForResponse || userId === loadedUserId ){
            return false;
        }
        getGetGamesFn(mode)( userId ).then( ( gamePreviews ) => {
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
        // want newest on top
        gamePreviews.sort((a, b) => b.startTime - a.startTime);
        setGamePreviews( gamePreviews );
        console.log( gamePreviews );
    }

    return {
        loadedUserId,
        gamePreviews,
        loadGamePreviews,
    }
}