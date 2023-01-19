

const baseUrl = "https://x3ljpedzc3.execute-api.us-west-2.amazonaws.com/prod";

export function getGame( gameId ){
    return fetch( baseUrl + '/api',
    {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify( {
            'gameId': gameId
        } )
    } )
        .then( ( response ) => {
            return response.json();
        } )
        .then( ( jsonData ) => {
            return jsonData.game;
        } );
}