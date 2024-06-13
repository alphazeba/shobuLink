
import { moveToString } from "../gameLogic/moveParser";
import { nameToSide, sideToName } from "../gameLogic/token";
import { fetchJson } from "../util/apiHelper";

export function getGame( gameId ){
    return fetchJson( { type: "GetGame", gameId: gameId } )
        .then( ( jsonData ) => {
            return jsonData.game;
        } );
}

export function getGameUpdate( gameId, latestTimestamp ){
    return fetchJson( {
        type: "GetGame",
        gameId: gameId,
        latestTimestamp: latestTimestamp 
    } )
        .then( ( jsonData ) => {
            return jsonData.game;
        } );
}

export function getPlayerGames( userId ){
    return fetchJson( { type: "GetPlayerGames", userId: userId } )
        .then( ( jsonData ) => {
            return jsonData.games;
        } );
}

export function getPlayerActiveGames( userId ){
    return fetchJson( { type: "GetPlayerActiveGames", userId: userId } )
    .then( ( jsonData ) => {
        return jsonData.games;
    } );
}

export function getOpenGames(){
    return fetchJson( {
        type: "GetOpenGames",
    }).then( ( jsonData ) => {
        return jsonData.games;
    });
}

export function cancelGame(loginInfo, gameId){
    return fetchJson( {
        type: "CancelGame",
        gameId: gameId,
        loginToken: loginInfo.token,
        userId: loginInfo.id
    }).then( ( jsonData ) => {
        return jsonData;
    });
}

export function playMove( loginInfo, gameId, fullMove ){
    const request = {
        type: "PlayMove",
        gameId: gameId,
        move: moveToString( fullMove ),
        loginToken: loginInfo.token,
        userId: loginInfo.id
    }
    return fetchJson( request )
        .then( ( jsonData ) => {
            return jsonData.game;
        } );
}


export function createGame( loginInfo, side, secondsPerSide, timeMode ){
    const request = {
        type: "CreateGame",
        side: sideToName( side ),
        secondsPerSide: secondsPerSide,
        loginToken: loginInfo.token,
        userId: loginInfo.id,
        userName: loginInfo.name,
        timeMode: timeMode,
    }
    return fetchJson( request )
        .then( ( jsonData ) => {
            return jsonData.gameId;
        } );
}


export function joinGame( loginInfo, gameId ){
    const request = {
        type: "JoinGame",
        gameId: gameId,
        userName: loginInfo.name,
        userId: loginInfo.id,
        loginToken: loginInfo.token,
    }
    return fetchJson( request )
        .then( (jsonData) => {
            return nameToSide( jsonData.side );
        } );
}

export function callTime( loginInfo, gameId ){
    const request = {
        type: "CallTime",
        gameId: gameId,
        userId: loginInfo.id,
        loginToken: loginInfo.token,
    }
    return fetchJson( request )
        .then( (jsonData) => {
            return jsonData.gameTimedOut;
        } );
}