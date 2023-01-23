
import React, { useState } from 'react'
import { useGameState  } from './GameLogic';
import './Board.css'
import { side, token } from './logic/token'
import { getSubboard, subboardGetToken } from './logic/board';
import { generateValidPassiveMoves, generateValidActiveMoves } from './logic/moveGenerator';
import { addSpotVec, compareVec, getDeltaVector } from './logic/spot';
import { buildPartialMove } from './logic/move';
import { buildCellLocationStyle } from './styleHelper';

export const Arrow = ({start,vec}) => {



    function getRotation( vec ){
        var [x ,y] = vec;
        if( x == 0 && y < 0 ){
            return 0;
        }
        if( x > 0 && y < 0 ){
            return 180/4;
        }
        if( x > 0 && y == 0 ){
            return 180/2;
        }
        if( x > 0 && y > 0 ){
            return 3/4 * 180;   
        }
        if( x == 0 && y > 0 ){
            return 180;
        }
        if( x < 0 && y < 0 ){
            return 180 + 180*3/4;
        }
        if( x < 0 && y == 0 ){
            return 180 + 180/2;
        }
        if( x < 0 && y > 0 ){
            return 180 + 180/4;   
        }
        return 0;
    }
    
    var [x,y] = start;
    var [vx,vy] = vec;
    var className='arrow ';
    var absx = Math.abs( vx );
    var absy = Math.abs( vy );
    if( absx > 0 && absy > 0 ){ // diag
        if( absx == 1 ){
            className += 'diagShort';
        }
        else {
            className += 'diagLong';
        }
    }
    else { // straight
        if( Math.max( absx, absy ) == 1 ){
            className += 'straightShort';
        }
        else{
            className += 'straightLong';
        }
    }


    var style = buildCellLocationStyle( x + 0.5, y + 0.5 );
    style.transform = 'rotate(' + getRotation( vec ) + 'deg)';
   
    return <div className={className} style={style}>
        <div className='arrowBody'>
            <div className='arrowHead' />
        </div>
    </div>;
}