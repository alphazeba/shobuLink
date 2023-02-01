import React, { useId, useState } from 'react'
import { useGameState  } from './GameLogic';
import './Board.css'
import { side, token } from './logic/token'
import { getSubboard, subboardGetToken } from './logic/board';
import { generateValidPassiveMoves, generateValidActiveMoves } from './logic/moveGenerator';
import { addSpotVec, compareVec, getDeltaVector } from './logic/spot';
import { buildFullMove, buildPartialMove } from './logic/move';
import { buildCellLocationStyle } from './styleHelper';
import { Arrow } from './Arrow';
import { stateIsRelatedToSide, stateIsRelatedToVictory } from './util/stateHelper';
import { Clock } from './Clock';
import { isWhiteMove, isBlackMove } from './util/stateHelper';

export const Board = ({ boardState, playable, blackId, blackName, whiteId, whiteName, gameState, onMove, userId, timeData }) => {
    const [ selectedPassiveSpot, setSelectedPassiveSpot ] = useState( null );
    const [ passiveMoves, setPassiveMoves ] = useState( [] );
    const [ selectedPassiveMove, setSelectedPassiveMove ] = useState( null );
    const [ activeMovesBlack, setActiveMovesBlack ] = useState( [] );
    const [ activeMovesWhite, setActiveMovesWhite ] = useState( [] );

    const getPerspectiveColor = () => {
        if( userId == whiteId ){
            return side.WHITE;
        }
        else if( userId == blackId ){
            return side.BLACK;
        }
        return side.BLACK;
    }

    const usingFlippedPerspective = () => {
        return getPerspectiveColor() == side.WHITE;
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
        var homeboardside = side.BLACK;
        if( n == 1 || n == 3 ){
            homeboardside = side.WHITE;
        }
        setPassiveMoves( generateValidPassiveMoves( boardState, [x,y], homeboardside ) );
    }

    const cellSelect_passiveMove = ( x, y, n ) => {
        var [ passiveSpot, subboardN ] = selectedPassiveSpot;
        var moveSide = side.BLACK;
        if( n == 1 || n == 3 ){
            moveSide = side.WHITE;
        }
        var move = buildPartialMove( moveSide, passiveSpot, getDeltaVector( passiveSpot, [x,y] ) );
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

    const _sbdRot = ( n, flipped ) => {
        if( flipped ){
            return 3 - n;
        }
        return n;
    }

    const drawBoard = ( board ) => {
        var flipped = usingFlippedPerspective();
        return <div >
            <div className="topBoardRow">{ drawSubboard( board, _sbdRot(0,flipped) ) }<span className='betweenSubboard'/>{ drawSubboard( board, _sbdRot(1,flipped) ) }</div>
            <div>{ drawSubboard( board, _sbdRot(2,flipped) ) }<span className='betweenSubboard'/>{ drawSubboard( board, _sbdRot(3,flipped) ) }</div>
        </div>
    }

    const drawSubboard = ( board, n ) => {
        var dark = n == 0 || n == 2;
        var subboard = getSubboard( board, n );

        var output = []
        for( var iy=0; iy < 4; iy++ ){
            var row = []
            for( var ix =0;ix<4;ix++ ){
                row.push( drawCell( subboard, n, ix, iy, dark ));
            }
            if( usingFlippedPerspective() ){
                row = row.reverse();
            }
            output.push( <div key={iy}>{row}</div> );
        }
        if( usingFlippedPerspective() ){
            output = output.reverse();
        }
        return <span className='subboard'>
            { output }
            { drawSelectedSpots( n ) }
            { getTokens( subboard ).map( ( t, i ) => drawToken( t.t, t.spot ) ) }
        </span>
    }

    const userIsInGame = () => {
        return userId == blackId || userId == whiteId;
    }

    const itIsYourTurn = () => {
        return userId != null
            && userIsInGame()
            && boardState.playerTurn == getPerspectiveColor()
            && playable;
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
        var subboard = getSubboard( boardState, n );
        return subboardGetToken( subboard, [ x, y ] ).type == getPerspectiveColor();
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
        tokens.sort( (a,b)=> {
            return a.t.key.localeCompare( b.t.key ) 
        } );
        return tokens
    }

    const drawSelectedSpots = ( n ) => {
        var flipped = usingFlippedPerspective();
        var output = [];
        if( selectedPassiveSpot != null ){
            var [ [x,y], subboardN ] = selectedPassiveSpot;
            if( subboardN == n ){
                // passive move options
                output.push(<div className='cell selected abso' style={buildCellLocationStyle(x,y,flipped)}></div>)
                for( var move of passiveMoves ){
                    var [mx,my] = addSpotVec( move.spot, move.vector);
                    output.push(<div className='abso moveOption' style={buildCellLocationStyle(mx,my,flipped)}></div>)
                }
                // selected passive move
                if( selectedPassiveMove != null ){
                    var start = selectedPassiveMove.spot;
                    var vec = selectedPassiveMove.vector;
                    output.push( <Arrow start={start} vec={vec} flipped={flipped} /> );
                }
            }
        }
        for( var move of getActiveMoves( n ) ){
            output.push( <Arrow start={move.spot} vec={move.vector} flipped={flipped}/> );
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
        return (passiveWasBlack && onWhiteBoard) || (!passiveWasBlack && !onWhiteBoard);
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
        var className = "real token " + ( (tokenObj.type == token.WHITE) ? "white" : "black" );
        return <div className={className} style={buildCellLocationStyle(x,y,usingFlippedPerspective())} key={tokenObj.key} />
    }

    const renderBoardState = ( sideValue ) => {
        if( !stateIsRelatedToSide( sideValue, gameState ) ){
            return <div/>;
        }
        var colorName = "black";
        if( sideValue == side.WHITE ){
            colorName = "white";
        }
        return <div className={"fake token " + colorName}>
            {renderCrown()}
        </div>
    }

    const renderCrown = () => {
        if( stateIsRelatedToVictory( gameState ) ){
            return <div className='crown' />
        }
        return <div/>
    }

    const drawTopName = () => {
        if( usingFlippedPerspective() ){
            return drawName( blackName, blackId, side.BLACK );
        }
        return drawName( whiteName, whiteId, side.WHITE );
    }

    const drawBottomName = () => {
        if( usingFlippedPerspective() ){
            return drawName( whiteName, whiteId, side.WHITE );
        }
        return drawName( blackName, blackId, side.BLACK );
    }

    const renderBlackClock = () => {
        return <Clock 
            time={timeData.blackTime}
            lastTimestamp={timeData.lastTimestamp}
            ticking={ isBlackMove( gameState ) }
        />
    }

    const renderWhiteClock = () => {
        return <Clock
            time={timeData.whiteTime}
            lastTimestamp={timeData.lastTimestamp}
            ticking={ isWhiteMove( gameState ) }
        />
    }

    const renderClock = ( sideValue ) => {
        if( sideValue == side.BLACK ){
            return renderBlackClock();
        }
        return renderWhiteClock();
    }

    const drawName = ( name, id, sideValue ) => {
        return <div className='nameBar'>{ renderBoardState( sideValue ) }{name} : {id}. {renderClock(sideValue)}</div>
    }

    return <div>
        <div className='fullBoardContainer'>
            { drawTopName() }
            { drawBoard( boardState ) }
            { drawBottomName() }
        </div>
    </div>
}


