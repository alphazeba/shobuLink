import React from 'react'
import './Board.css'
import './MoveList.css';

export const MoveList = ({curIndex, moves, onGoToMove, children}) => {

    if( moves == [] ){
        return <div>no moves</div>
    }

    const renderMove = ( index ) => {
        if( index >= moves.length ){
            return <div/>;
        }
        var className = 'rowItem moveDisplay btn';
        if( index == curIndex-1 ){
            className += " selected";
        }
        var moveString = moves[index].m;
        return <button className={className} onClick={()=>onGoToMove(index+1)}>{moveString}</button>
    }

    var output = []
    for( var i=0;i<Math.ceil( moves.length/2);i++){
        var blackIndex = i * 2;
        var whiteIndex = blackIndex + 1;
        var className='moveRow';
        if( i % 2 == 0 ){
            className += ' even';
        }
        output.push(
            <div className={className} key={"turn" + i}>
                <div className='numberHolder rowItem' >{i+1}</div>{renderMove(blackIndex)}{renderMove(whiteIndex)}
            </div>
        )
    }
    return <div className='moveListSuperContainer'>
        <div>
            {children}
        </div>
        <div className='moveListContainer'>
            {output}
        </div>
    </div>;
}