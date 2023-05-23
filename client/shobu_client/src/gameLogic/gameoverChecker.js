import { getSubboard, subboardGetToken } from "./board";
import { token } from "./token";

export function checkForWin( board ){
    for( let i=0; i<4; i++ ){
        let subboard = getSubboard( board, i );
        let [ blackCount, whiteCount ] = countTokenTypeOnSubboard( subboard );
        if( blackCount == 0 ){
            return token.WHITE;
        }
        if( whiteCount == 0 ){
            return token.BLACK;
        }
    }
    return null
}

function countTokenTypeOnSubboard( subboard ){
    let blackCount = 0;
    let whiteCount = 0;
    for( let iy=0; iy<4; iy++ ){
        for( let ix=0; ix<4; ix++ ){
            let foundToken = subboardGetToken( subboard, [ix,iy] ).type;
            if( foundToken == token.BLACK ){
                blackCount += 1;
            }
            else if( foundToken == token.WHITE ){
                whiteCount += 1;
            }
        }
    }
    return [ blackCount, whiteCount ];
}