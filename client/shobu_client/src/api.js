
import { moveToString } from "./logic/moveParser";
import { nameToSide, sideToName } from "./logic/token";
import { getLoginInfo } from "./LoginPage";
import { fetchJson } from "./util/apiHelper";

export function getGame( gameId ){
    return fetchJson( { type: "GetGame", gameId: gameId } )
        .then( ( jsonData ) => {
            return jsonData.game;
        } );
}

export function getGameUpdate( gameId, latestTimestamp ){
    return fetchJson( { type: "GetGame", gameId: gameId, latestTimestamp: latestTimestamp } )
        .then( ( jsonData ) => {
            return jsonData.game;
        } );
}

export function playMove( gameId, fullMove ){
    const loginInfo = getLoginInfo();
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


export function createGame( side, secondsPerSide ){
    const loginInfo = getLoginInfo();
    const request = {
        type: "CreateGame",
        side: sideToName( side ),
        secondsPerSide: secondsPerSide,
        loginToken: loginInfo.token,
        userId: loginInfo.id,
        userName: loginInfo.name
    }
    return fetchJson( request )
        .then( ( jsonData ) => {
            return jsonData.gameId;
        } );
}


export function joinGame( gameId ){
    const loginInfo = getLoginInfo();
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