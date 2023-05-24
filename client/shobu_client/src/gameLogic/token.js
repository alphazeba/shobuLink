import { newUnsecureGuid } from "../util/guid"

export const token = {
    BLACK: -1,
    WHITE: 1,
    EMPTY: 0
}

export function buildToken( type ){
    let obj = {
        type: type,
        key: null
    }
    if( type !== token.EMPTY ){
        obj.key = newUnsecureGuid();
    }
    return obj;
}

export function emptyToken(){
    return buildToken( token.EMPTY );
}

export function tokenIsEnemy( toke, playerSide ){
    return toke.type !== token.EMPTY && toke.type !== playerSide;
}

export const side = {
    BLACK: token.BLACK,
    WHITE: token.WHITE
}

export const sideToName = ( sideValue ) => {
    switch( sideValue ){
        case side.BLACK:
            return "BLACK";
        case side.WHITE:
            return "WHITE";
        default:
            throw new Error( "an invalid sideValue was provided" );
    }
}

export const nameToSide = ( name ) => {
    switch( name ){
        case "BLACK":
            return side.BLACK;
        case "WHITE":
            return side.WHITE;
        default:
            throw new Error( "an invalid name was provided" );
    }
}