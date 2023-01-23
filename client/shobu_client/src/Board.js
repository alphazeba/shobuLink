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

export const Board = ({ boardState, blackId, whiteId, children, onMove, userId }) => {
    const [ selectedPassiveSpot, setSelectedPassiveSpot ] = useState( null );
    const [ passiveMoves, setPassiveMoves ] = useState( [] );
    const [ selectedPassiveMove, setSelectedPassiveMove ] = useState( null );
    const [ activeMovesBlack, setActiveMovesBlack ] = useState( [] );
    const [ activeMovesWhite, setActiveMovesWhite ] = useState( [] );
    var playerColor = null;
    if( userId != null ){
        if( userId == whiteId ){
            playerColor = side.WHITE;
        }
        else if( userId == blackId ){
            playerColor = side.BLACK;
        }
    }

    const getPerspectiveColor = () => {
        if( playerColor != null ){
            return playerColor;
        }
        return side.BLACK;
    }

    const clickCell = ( x, y, n ) => {
        if( spotIsSelectedPassiveSpot( x, y, n ) ){
            clearSelections();
        }
        else if( spotIsValidActiveMoveSelection( x, y, n ) ){
            cellSelect_activeMove( x, y, n);
        }
        else if( spotIsValidPassiveSelection( x, y, n ) ){
            cellSelect_passiveSpot( x, y, n );
        }
        else if( spotIsValidPassiveMoveSelection( x, y, n ) ){
            cellSelect_passiveMove( x, y, n );
        }
    }

    const cellSelect_passiveSpot = ( x, y, n ) => {
        clearSelections();
        setSelectedPassiveSpot( [ [x,y], n ] );
        setPassiveMoves( generateValidPassiveMoves( boardState, [x,y] ) );
    }

    const cellSelect_passiveMove = ( x, y, n ) => {
        var [ passiveSpot, subboardN ] = selectedPassiveSpot;
        var move = buildPartialMove( boardState.playerTurn, passiveSpot, getDeltaVector( passiveSpot, [x,y] ) );
        setSelectedPassiveMove( move );
        setPassiveMoves( [] );
        setActiveMovesBlack( generateValidActiveMoves( boardState, move, side.BLACK ) );
        setActiveMovesWhite( generateValidActiveMoves( boardState, move, side.WHITE ) );
    }

    const cellSelect_activeMove = ( x, y, n ) => {
        var activeMove = getTargetMove( x,y,n );
        var passiveMove = selectedPassiveMove;
        var fullMove = buildFullMove( passiveMove, activeMove );
        makeMove( fullMove );
        clearSelections();
    }

    const makeMove = ( fullMove ) => {
        onMove( fullMove );
    }

    const getTargetMove = ( x, y, n ) => {
        var targetSpot = [x,y];
        for( var move of getActiveMoves( n ) ){
            if( compareVec( targetSpot, move.spot ) ){
                return move;
            }
        }
        return null;
    }

    const spotIsValidActiveMoveSelection = ( x, y, n ) => {
        return getTargetMove( x,y,n ) != null;
    }

    const spotIsValidPassiveSelection = ( x, y, n ) => {
        return isYourHomeboard( n ) && cellHasYourColor( x, y, n );
    }

    const spotIsSelectedPassiveSpot = ( x, y, n ) => {
        if( selectedPassiveSpot != null ){
            var [ passiveSpot, subboardN ] = selectedPassiveSpot;
            return n == subboardN && compareVec( passiveSpot, [x,y] );
        }
        return false;
    }

    const spotIsValidPassiveMoveSelection = ( x, y, n ) => {
        var targetSpot = [ x,y]
        if( selectedPassiveSpot != null ){
            var [ _, subboardN ] = selectedPassiveSpot;
            if( n == subboardN ){
                for( var move of passiveMoves ){
                    var moveEnd = addSpotVec( move.spot, move.vector );
                    if( compareVec( moveEnd, targetSpot ) ){
                        return true;
                    }
                }
            }
        }
        return false;
    }

    const clearSelections = () =>{
        setSelectedPassiveSpot( null );
        setPassiveMoves( [] );
        setSelectedPassiveMove( null );
        setActiveMovesBlack( [] );
        setActiveMovesWhite( [] );
    }

    const drawBoard = ( board ) => {
        return <div >
            <div className="topBoardRow">{ drawSubboard( board, 0, true ) }<span className='betweenSubboard'/>{ drawSubboard( board, 1, false ) }</div>
            <div>{ drawSubboard( board, 2, true ) }<span className='betweenSubboard'/>{ drawSubboard( board, 3, false ) }</div>
        </div>
    }

    const drawSubboard = ( board, n, dark ) => {
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
        return playerColor != null && boardState.playerTurn == playerColor;
    }

    const isYourHomeboard = ( n ) => {
        const color = getPerspectiveColor();
        if( color == side.BLACK && ( n == 2 || n == 3 ) ){
            return true;
        }
        if( color == side.WHITE && ( n == 0 || n == 1 ) ){
            return true;
        }
        return false;
    }

    const cellHasYourColor = ( x, y, n ) => {
        const color = getPerspectiveColor();
        var subboard = getSubboard( boardState, n );
        return subboardGetToken( subboard, [ x, y ] ).type == color;
    }

    const getTokens = ( subboard ) => {
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

    const drawSelectedSpots = ( n ) => {
        var output = [];
        if( selectedPassiveSpot != null ){
            var [ [x,y], subboardN ] = selectedPassiveSpot;
            if( subboardN == n ){
                // passive move options
                output.push(<div className='cell selected abso' style={buildCellLocationStyle(x,y)}></div>)
                for( var move of passiveMoves ){
                    var [mx,my] = addSpotVec( move.spot, move.vector);
                    output.push(<div className='abso moveOption' style={buildCellLocationStyle(mx,my)}></div>)
                }
                // selected passive move
                if( selectedPassiveMove != null ){
                    var start = selectedPassiveMove.spot;
                    var vec = selectedPassiveMove.vector;
                    output.push( <Arrow start={start} vec={vec} /> );
                }
            }
        }
        for( var move of getActiveMoves( n ) ){
            output.push( <Arrow start={move.spot} vec={move.vector} /> );
        }
        return output;
    }

    const getActiveMoves = ( n_subboard ) => {
        if( selectedPassiveSpot == null ){
            return [];
        }
        var [ _, n_passive ] = selectedPassiveSpot;
        if( subboardIsInActiveColumnForPassiveMove( n_subboard, n_passive ) ){
            if( n_subboard == 0 || n_subboard == 1 ){
                return activeMovesWhite;
            }
            else{
                return activeMovesBlack;
            }
        }
        return [];
    }

    const subboardIsInActiveColumnForPassiveMove = ( n_curSubboard, n_passiveSubboard ) => {
        var passiveWasBlack = n_passiveSubboard == 0 || n_passiveSubboard == 2;
        var onWhiteBoard = n_curSubboard == 1 || n_curSubboard == 3;
        return passiveWasBlack && onWhiteBoard || !passiveWasBlack && !onWhiteBoard;
    }

    const clickDoNothing = ( x, y ) => {
        // is a dummy function for disabling buttons.
    }

    const drawCell = ( subboard, n, x, y, dark ) => {
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

    const drawToken = ( tokenObj, spot ) => {
        const [x,y] = spot
        var className = "token " + ( (tokenObj.type == token.WHITE) ? "whiteToken" : "blackToken" );
        return <div className={className} style={buildCellLocationStyle(x,y)} key={tokenObj.key} />
    }

    return <div>
        <div>
            { children }
            { drawBoard( boardState ) }
        </div>
    </div>
}


