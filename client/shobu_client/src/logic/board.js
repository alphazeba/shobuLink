
import { token, buildToken, side } from "./token"

export function initBoard(){
    return {
        board: [
            [ initSubboard(), initSubboard() ],
            [ initSubboard(), initSubboard() ]
        ],
        playerTurn: side.BLACK
    }
}

function initSubboard(){
    return [
        initRow(token.WHITE),
        initRow(token.EMPTY),
        initRow(token.EMPTY),
        initRow(token.BLACK)
    ]
}

function initRow( token ){
    return [buildToken(token), buildToken(token), buildToken(token), buildToken(token) ]
}

export function getPassiveMoveSubboard( board, playerSide ){
    if( board.playerTurn == side.BLACK ){
        if( playerSide == side.BLACK ){
            return getSubboard( board, 2 );
        }
        return getSubboard( board, 3 );
    }
    else {
        if( playerSide == side.BLACK ){
            return getSubboard( board, 0 );
        }
        return getSubboard( board, 1 );
    }
}

export function getActiveMoveSubboard( board, playerSide, passiveSide ){
    if( passiveSide == side.BLACK ){
        if( playerSide == side.BLACK ){
            return getSubboard( board, 3 );
        }
        return getSubboard( board, 1 );
    }
    else {
        if( playerSide == side.BLACK ){
            return getSubboard( board, 2 );
        }
        return getSubboard( board, 0 );
    }
}

export function getSubboard( board, n ){
    /*
    imagine
    0 1
    2 3
    */
    var b = board.board;
    switch( n ){
        case 0:
            return b[0][0]
        case 1:
            return b[1][0]
        case 2:
            return b[0][1]
        case 3:
            return b[1][1]
    }
}

export function subboardGetToken( subboard, spot ){
    var [x,y] = spot;
    return subboard[y][x];
}

export function subboardSetToken( subboard, spot, token ){
    var [x,y] = spot;
    subboard[y][x] = token;
}

export function tokenBelongsToPlayer( board, targetToken ){
    return targetToken.type == board.playerTurn;
}

export function spotIsEmpty( subboard, spot ){
    return subboardGetToken( subboard, spot ).type == token.EMPTY;
}