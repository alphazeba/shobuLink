import React, { useState } from 'react'
import { useGameState  } from './GameLogic';
import './Board.css'

export const Board = ({ gameId, children }) => {

    const [ count, setCount ] = useState( 0 );
    const [ loadedGame, setLoadedGame ] = useState( null );
    const [ visibleMove, setVisibleMove ] = useState( 0 );
    const [ history ] = useGameState( "nothing" );

    function drawBoard( board ){
        return <div >
            <div>{ drawSubboard( board[0][0], true ) }{ drawSubboard( board[0][1], false ) }</div>
            <div>{ drawSubboard( board[1][0], true ) }{ drawSubboard( board[1][1], false ) }</div>
            <div></div>
        </div>
    }

    function drawSubboard( subboard, dark ){
        var output = []
        for( var iy=0; iy < 4; iy++ ){
            var row = []
            for( var ix =0;ix<4;ix++ ){
                row.push( drawCell( subboard, ix, iy, dark ));
            }
            output.push( <div>{row}</div> );
        }
        return <span className='subboard'>
            {output}
        </span>
    }

    function drawCell( subboard, x,y, dark ){
        var className='cell';
        var odd = (x+y) % 2 == 0
        if( dark ){
            if( odd ){
                className += " darkBoardDarkCell"
            }
            else {
                className += " darkBoard";
            }
        }
        else{
            if( odd ){
                className += " lightBoardDarkCell"
            }
        }

        return <div className={className} key={ "cell" + String(x) + String(y) }>{tokenLookUp( subboard[y][x] )}</div>
    }


    function tokenLookUp( token ){
        switch( token ){
            case 1:
                return <div className="token whiteToken" />
            case -1:
                return <div className="token blackToken" />
            default:
                return <div/>
        }
    }

    return <div>
        <div> ur mum {count}</div>
        <button onClick={ ()=>setCount( count + 1 )} >click here</button>
        <div>
            {children}
            { drawBoard( history[visibleMove] )}
        </div>
    </div>
}


