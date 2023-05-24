
import { addSpotVec, spotIsInBoard, vectorToUnitAndSteps } from "./spot";
import { token, buildToken, side, emptyToken } from "./token"

export function initBoard(){
    return buildBoard( [initSubboard(),initSubboard(),initSubboard(),initSubboard()], side.BLACK );
}

function initSubboard(){
    return [
        initRow(token.WHITE),
        initRow(token.EMPTY),
        initRow(token.EMPTY),
        initRow(token.BLACK)
    ]
}

export function compareBoards( a, b ){
    if( a.playerTurn != b.playerTurn ){
        return false;
    }
    for( let isubboard; isubboard<4; isubboard++ ){
        for( let iy=0; iy<4; iy++ ){
            for( let ix=0; ix<4; ix++ ){
                let spot = [ ix, iy ];
                let acolor = subboardGetToken( getSubboard( a, isubboard ), spot ).type;
                let bcolor = subboardGetToken( getSubboard( b, isubboard ), spot ).type;
                if( acolor != bcolor ){
                    return false;
                }
            }
        }
    }
    return true;
}

export function isBlacksTurn( board ){
    return board.playerTurn == side.BLACK;
}

export function buildBoard( suboards, playerSide ){
    return {
        board: [
            [ suboards[0], suboards[2] ],
            [ suboards[1], suboards[3] ]
        ],
        playerTurn: playerSide
    }
}

export function initEmptySubboard(){
    return [
        initRow(token.EMPTY),
        initRow(token.EMPTY),
        initRow(token.EMPTY),
        initRow(token.EMPTY)
    ]
}

function initRow( token ){
    return [ buildToken(token), buildToken(token), buildToken(token), buildToken(token) ]
}

export function getPassiveMoveSubboards( board ){
    let subboards = [];
    let sides = [ side.BLACK, side.WHITE ]
    for( let side of sides ){
        subboards.push( {
            subboard: getPassiveMoveSubboard( board, side ),
            side: side
        } );
    }
    return subboards;
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

function boardCopy( board ){
    return JSON.parse( JSON.stringify( board ) );
}

export function makeValidatedMove( board, move ){
    var mutableBoard = boardCopy( board );
    makePassiveMove( mutableBoard, move.passive );
    makeActiveMove( mutableBoard, move.active, move.passive );
    flipTurn( mutableBoard );
    return mutableBoard;
}

function makePassiveMove( board, passiveMove ){
    var subboard = getPassiveMoveSubboard( board, passiveMove.side );
    var movingToken = subboardGetToken( subboard, passiveMove.spot );
    subboardSetToken( subboard, passiveMove.spot, emptyToken() );
    subboardSetToken( subboard, addSpotVec( passiveMove.spot, passiveMove.vector ), movingToken );
}

function makeActiveMove( board, activeMove, passiveMove ){
    var subboard = getActiveMoveSubboard( board, activeMove.side, passiveMove.side );
    var enemyToken = null;
    var movingToken = subboardGetToken( subboard, activeMove.spot );
    subboardSetToken( subboard, activeMove.spot, emptyToken() );
    var [ unit, steps ] = vectorToUnitAndSteps( activeMove.vector );
    var spot = activeMove.spot;
    for( var i=0; i< steps;i++ ){
        spot = addSpotVec( spot, unit );
        if( ! spotIsEmpty( subboard, spot ) ){
            enemyToken = subboardGetToken( subboard, spot );
            subboardSetToken( subboard, spot, emptyToken() );
        }
    }
    subboardSetToken( subboard, spot, movingToken );
    if( enemyToken != null ){
        spot = addSpotVec( spot, unit );
        if( spotIsInBoard( spot ) ){
            subboardSetToken( subboard, spot, enemyToken );
        }
    }
}

function flipTurn( board ){
    if( board.playerTurn == side.BLACK ){
        board.playerTurn = side.WHITE;
    }
    else {
        board.playerTurn = side.BLACK;
    }
}