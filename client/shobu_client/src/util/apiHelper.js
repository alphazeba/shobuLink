

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

export function fetchJson( payload ){
    console.log( "sending request to " + payload.type + ": " + JSON.stringify( payload ) );
    return fetch( baseUrl, buildPayload( payload ) )
        .then( (response ) => {
            return response.json();
        } );
}