
import { addSpotVec, getDeltaVector } from "./spot";
import { token, side } from "./token";
import { buildFullMove, buildPartialMove } from "./move";


export function parseMove( moveString ){
    if( moveString.length == 10 ){
        var passive = parsePartialMove( moveString.slice(0,5) );
        var active = parsePartialMove( moveString.slice(-5) );
        return buildFullMove( passive, active );
    }
    else {
        throw new Error( "Sorry there was not the correct number of characters" );
    }
}

export function moveToString( fullMove ){
    return partialMoveToString( fullMove.passive ) + partialMoveToString( fullMove.active );
}

function parsePartialMove( partialString ){
    var side = parseSide( partialString.charAt(0) );
    var start = parseSpot( partialString.slice( 1, 3 ) );
    var end = parseSpot( partialString.slice( 3 ) );
    var delta = getDeltaVector( start, end );
    return buildPartialMove( side, start, delta );
}

function parseSpot( spotCharacters ){
    var colChar = spotCharacters.charAt(0)
    var rowChar = spotCharacters.charAt(1);
    var x = 0;
    var y = 0;
    switch( colChar ){
        case 'a':
            x = 0;
            break;
        case 'b':
            x = 1;
            break;
        case 'c':
            x = 2;
            break;
        case 'd':
            x = 3;
            break;
        default:
            throw new Error( "column character must be a,b,c,d" );
    }
    y = 4 - parseInt( rowChar );
    if( y < 0 || y >= 4 ){
        throw new Error( "rowChar must be 1 through 4" );
    }
    return [x,y]
}

function parseSide( sideChar ){
    if( sideChar == "B" ){
        return side.BLACK;
    }
    else if( sideChar == "W" ){
        return side.WHITE;
    }
    else {
        throw new Error("Side must be B or W");
    }
}

function partialMoveToString( partialMove ){
    var output = "";
    if( partialMove.side == side.BLACK ){
        output += "B";
    }
    else {
        output += "W";
    }
    var a = partialMove.spot;
    var b = addSpotVec( partialMove.spot, partialMove.vector );
    output += spotToString( a ) + spotToString( b );
    return output;
}

function spotToString( spot ){
    var [x,y] = spot
    return colToChar( x ) + rowToChar( y );
}

function colToChar( col ){
    switch( col ){
        case 0:
            return 'a'
        case 1:
            return 'b'
        case 2:
            return 'c'
        case 3:
            return 'd'
        default:
            throw new Error("colToChar failed because col was not a valid number");
    }
}

function rowToChar( row ){
    return (4-row).toString();
}