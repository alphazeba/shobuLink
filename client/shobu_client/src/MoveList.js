import React, { useState } from 'react'
import { useGameState  } from './GameLogic';
import './Board.css'
import { side, token } from './logic/token'
import { getSubboard, subboardGetToken } from './logic/board';
import { generateValidPassiveMoves, generateValidActiveMoves } from './logic/moveGenerator';
import { addSpotVec, compareVec, getDeltaVector } from './logic/spot';
import { buildFullMove, buildPartialMove } from './logic/move';
import { buildCellLocationStyle } from './styleHelper';
import { Arrow } from './Arrow';


export const MoveList = ({moves, onGoToMove}) => {

    if( moves == [] ){
        return <div>no moves</div>
    }

    const renderMove = ( index ) => {
        if( index >= moves.length ){
            return <div/>;
        }
        var moveString = moves[index].m;
        return <button onClick={()=>onGoToMove(index+1)}>{moveString}</button>
    }

    var output = []
    for( var i=0;i<Math.ceil( moves.length/2);i++){
        var blackIndex = i * 2;
        var whiteIndex = blackIndex + 1;
        output.push(
            <div key={"turn" + i}>
                {i+1}:{renderMove(blackIndex)},{renderMove(whiteIndex)}
            </div>
        )
    }
    return output;
}