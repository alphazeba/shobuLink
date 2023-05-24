

export function addSpotVec( spot, vec ){
    let [x,y] = spot;
    let [dx,dy] = vec;
    return [ x + dx, y + dy ];
}

export function getDeltaVector( a, b ){
    let [ax,ay] = a;
    let [bx,by] = b;
    return [bx-ax, by-ay]
}

export function vectorToUnitAndSteps( vector ){
    let [x,y] = vector;
    if( Math.max( Math.abs( x ), Math.abs( y ) ) === 2 ){ // 2 is the largest we have to deal with.
        return [ [x/2,y/2], 2 ];
    }
    return [ [x,y], 1 ]
}

export function compareVec( a, b ){
    let [ax,ay] = a;
    let [bx,by] = b;
    return ax === bx && ay === by;
}

export function spotIsInBoard( spot ){
    let [x,y] = spot;
    return x >= 0 && y >= 0 && x < 4 && y < 4;
}