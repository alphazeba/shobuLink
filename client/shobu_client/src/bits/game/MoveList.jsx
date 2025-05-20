import React, { Fragment } from 'react'
import './Board.css'
import './MoveList.css';

export const MoveList = ({curIndex, moves, onGoToMove, children}) => {

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

    const renderRow = (content, i) => {
        let className = 'moveRow'
        if (i % 2 === 0) {
            className += ' even';
        }
        return <div className={className} key={"turn" + i}>
            {content}
        </div>
    }

    const renderMoves = () => {
        if( moves.length === 0 ){
            return renderRow(<div>no moves</div>, 0);
        }
        let output = []
        for( let i=0;i<Math.ceil(moves.length/2);i++){
            let blackIndex = i * 2;
            let whiteIndex = blackIndex + 1;
            output.push(
                renderRow(<Fragment>
                    <div className='numberHolder rowItem' >{i+1}</div>{renderMove(blackIndex)}{renderMove(whiteIndex)}
                </Fragment>, i)
            );
        }
        return output;
    }

    return <div className='moveListSuperContainer'>
        <div>
            {children}
        </div>
        <div className='line' />
        <div className='moveListContainer'>
            {renderMoves()}
        </div>
    </div>;
}