export function buildCellLocationStyle( x, y, flipped ){
    if( flipped ){
        x = 3-x;
        y = 3-y;
    }
    return {
        left: _toPercent( x ),
        top: _toPercent( y ),
    };
}

function _toPercent( n ){
    return ( 100/4 * n ).toString() + "%";
}
