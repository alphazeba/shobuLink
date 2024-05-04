export function buildCellLocationStyle( x, y, flipped ){
    return {
        left: toCellPercent( x, flipped ),
        top: toCellPercent( y, flipped ),
    };
}

export function toCellPercent( coord, flipped ){
    const val = flipped ? (3-coord) : coord;
    return ( 100/4 * val ).toString() + "%";
}
