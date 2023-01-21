import React, { useState } from 'react'
import { useGameState  } from './GameLogic';
import './Board.css'
import { side, token } from './logic/token'
import { getSubboard, subboardGetToken } from './logic/board';
import { generateValidPassiveMoves } from './logic/moveGenerator';
import { addSpotVec } from './logic/spot';

export const Board = ({ boardState, children }) => {

    const [ selectedPassiveSpot, setSelectedPassiveSpot ] = useState( null );
    const playerColor = side.BLACK;

    function drawBoard( board ){
        return <div >
            <div className="topBoardRow">{ drawSubboard( board, 0, true ) }<span className='betweenSubboard'/>{ drawSubboard( board, 1, false ) }</div>
            <div>{ drawSubboard( board, 2, true ) }<span className='betweenSubboard'/>{ drawSubboard( board, 3, false ) }</div>
        </div>
    }

    function drawSubboard( board, n, dark ){
        var subboard = getSubboard( board, n );

        var output = []
        for( var iy=0; iy < 4; iy++ ){
            var row = []
            for( var ix =0;ix<4;ix++ ){
                row.push( drawCell( subboard, n, ix, iy, dark ));
            }
            output.push( <div key={iy}>{row}</div> );
        }
        return <span className='subboard'>
            { output }
            { drawSelectedSpots( n ) }
            { getTokens( subboard ).map( ( t, i ) => drawToken( t.t, t.spot ) ) }
        </span>
    }

    const itIsYourTurn = () => {
        return boardState.playerTurn == playerColor;
    }

    const isYourHomeboard = ( n ) => {
        if( playerColor == side.BLACK && ( n == 2 || n == 3 ) ){
            return true;
        }
        if( playerColor == side.WHITE && ( n == 0 || n == 1 ) ){
            return true;
        }
        return false;
    }

    function cellHasYourColor( x, y, n ){
        var subboard = getSubboard( boardState, n );
        return subboardGetToken( subboard, [ x, y ] ).type == playerColor;
    }

    function getTokens( subboard ){
        var tokens = [];
        var t = null;
        for( var iy=0;iy<4;iy++){
            for( var ix=0;ix<4;ix++){
                const spot = [ix,iy]
                t = subboardGetToken( subboard, spot );
                if( t.type != token.EMPTY ){
                    tokens.push({
                        t: t,
                        spot: spot
                    });
                }
            }
        }
        return tokens
    }

    function drawSelectedSpots( n ){
        var output = [];
        if( selectedPassiveSpot != null ){
            var [ [x,y], subboardN ] = selectedPassiveSpot;
            if( subboardN == n ){
                output.push(<div className='cell selected abso' style={buildCellLocationStyle(x,y)}></div>)
                var moves = generateValidPassiveMoves( boardState, [ x,y] );
                for( var move of moves ){
                    var [mx,my] = addSpotVec( move.spot, move.vector);
                    output.push(<div className='abso moveOption' style={buildCellLocationStyle(mx,my)}></div>)
                }
            }
        }
        return output;
    }

    function spotIsValidPassiveSelection( x, y, n ){
        if( itIsYourTurn() && isYourHomeboard( n ) && cellHasYourColor( x, y, n ) ){
            return true;
        }
        return false;
    }

    function spotIsValidPassiveMove( x, y, n ){
        
    }

    const clickCell = ( x, y, n ) => {
        console.log("clicked");
        if( spotIsValidPassiveSelection( x, y, n ) ){
            clearSelections();
            setSelectedPassiveSpot( [ [x,y], n ] );
        }
    }

    const clearSelections = () =>{
        setSelectedPassiveSpot( null );
    }

    const clickDoNothing = ( x, y ) => {
        // is a dummy function for disabling buttons.
    }

    function drawCell( subboard, n, x, y, dark ){
        var className='cell';
        var fn = clickDoNothing;
        if( itIsYourTurn() ){
            className += ' interactable'
            fn = clickCell;
        }
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

        return <div className={className} onClick={ ()=>fn(x,y,n) } key={ "cell" + String(x) + String(y) }></div>
    }

    function _toPercent( n ){
        return ( 100/4 * n ).toString() + "%";
    }

    function drawToken( tokenObj, spot ){
        const [x,y] = spot
        var className = "token " + ( (tokenObj.type == token.WHITE) ? "whiteToken" : "blackToken" );
        return <div className={className} style={buildCellLocationStyle(x,y)} key={tokenObj.key} />
    }

    function buildCellLocationStyle( x, y ){
        return {
            left: _toPercent( x ),
            top: _toPercent( y ),
        };
    }

    return <div>
        <div>
            {children}
            { drawBoard( boardState ) }
        </div>
    </div>
}


