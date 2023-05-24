import React from 'react'
import { buildCellLocationStyle } from '../../util/styleHelper';

export const Arrow = ({start,vec,flipped}) => {
    function getRotation( vec ){
        let rotation = getBaseRotation( vec );
        if( flipped ){
            return rotation + 180;
        }
        return rotation;
    }

    function getBaseRotation( vec ){
        let [x ,y] = vec;
        if( x === 0 && y < 0 ){
            return 0;
        }
        if( x > 0 && y < 0 ){
            return 180/4;
        }
        if( x > 0 && y === 0 ){
            return 180/2;
        }
        if( x > 0 && y > 0 ){
            return 3/4 * 180;   
        }
        if( x === 0 && y > 0 ){
            return 180;
        }
        if( x < 0 && y < 0 ){
            return 180 + 180*3/4;
        }
        if( x < 0 && y === 0 ){
            return 180 + 180/2;
        }
        if( x < 0 && y > 0 ){
            return 180 + 180/4;   
        }
        return 0;
    }
    
    let [x,y] = start;
    let [vx,vy] = vec;
    let className = 'arrow ';
    let absx = Math.abs( vx );
    let absy = Math.abs( vy );
    if( absx > 0 && absy > 0 ){ // diag
        if( absx === 1 ){
            className += 'diagShort';
        }
        else {
            className += 'diagLong';
        }
    }
    else { // straight
        if( Math.max( absx, absy ) === 1 ){
            className += 'straightShort';
        }
        else{
            className += 'straightLong';
        }
    }

    let multiplier = 1
    if( flipped ){
        multiplier = -1;
    }
    let style = buildCellLocationStyle( x + 0.5 * multiplier, y + 0.5 * multiplier, flipped );
    style.transform = 'rotate(' + getRotation( vec ) + 'deg)';
   
    return <div className={className} style={style}>
        <div className='arrowBody'>
            <div className='arrowHead' />
        </div>
    </div>;
}