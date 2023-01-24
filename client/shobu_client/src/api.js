
import { moveToString } from "./logic/moveParser";
const baseUrl = "https://x3ljpedzc3.execute-api.us-west-2.amazonaws.com/prod/api";



function buildPayload( obj ){
    return {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify( obj )
    }
}

export function getGame( gameId ){
    console.log("querying for game " + gameId );
    return fetchJson({ type: "GetGame", gameId: gameId })
        .then( ( jsonData ) => {
            return jsonData.game;
        } );
}

export function playMove( gameId, fullMove, loginInfo ){

    const request = {
        type: "PlayMove",
        gameId: gameId,
        move: moveToString( fullMove ),
        loginToken: loginInfo.token,
        userId: loginInfo.id
    }

    console.log( "sending request to play move: " + JSON.stringify( request ) );
    return fetchJson( request )
        .then( ( jsonData ) => {
            return jsonData.game;
        } );
}

function fetchJson( payload ){
    return fetch( baseUrl, buildPayload( payload ) )
        .then( (response ) => {
            return response.json();
        } );
}