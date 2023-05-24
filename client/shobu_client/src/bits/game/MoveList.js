import React from 'react'
import './Board.css'
import './MoveList.css';

export const MoveList = ({curIndex, moves, onGoToMove, children}) => {

    if( moves === [] ){
        return <div>no moves</div>
    }

    const renderMove = ( index ) => {
        if( index >= moves.length ){
            return <div/>;
        }
        let className = 'rowItem moveDisplay btn';
        if( index === curIndex-1 ){
            className += " selected";
        }
        let moveString = moves[index].m;
        return <button className={className} onClick={()=>onGoToMove(index+1)}>{moveString}</button>
    }

    let output = []
    for( let i=0;i<Math.ceil( moves.length/2);i++){
        let blackIndex = i * 2;
        let whiteIndex = blackIndex + 1;
        let className='moveRow';
        if( i % 2 === 0 ){
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
        <div className='line' />
        <div className='moveListContainer'>
            {output}
        </div>
    </div>;
}