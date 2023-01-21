

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
    return fetch( baseUrl, buildPayload({ type: "GetGame", gameId: gameId }) )
        .then( ( response ) => {
            return response.json();
        } )
        .then( ( jsonData ) => {
            return jsonData.game;
        } );
}