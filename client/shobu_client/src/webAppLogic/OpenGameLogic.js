import { useState } from 'react'
import { getOpenGames } from './api.js'

export const useListOpenGames = () => {
    const [ games, setGames ] = useState( [] );
    const [ waitingForResponse, setWaitingForResponse ] = useState( false );

    const loadGames = () => {
        if( waitingForResponse ) {
            return false;
        }
        getOpenGames().then( (gamesResponse) => {
            // want oldest on top
            gamesResponse.sort((a, b) => a.startTime - b.startTime)
            setGames(gamesResponse);
            setWaitingForResponse(false);
        });
        setWaitingForResponse(true);
        return true;
    }

    return {
        games,
        loadGames,
        loading: waitingForResponse,
    }
}