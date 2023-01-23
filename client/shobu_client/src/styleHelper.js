export function buildCellLocationStyle( x, y ){
    return {
        left: _toPercent( x ),
        top: _toPercent( y ),
    };
}

function _toPercent( n ){
    return ( 100/4 * n ).toString() + "%";
}
