import React, { Fragment, useState } from 'react'
import './Board.css'
import { side, token } from '../../gameLogic/token'
import { getSubboard, makeValidatedMove, subboardGetToken } from '../../gameLogic/board';
import { generateValidPassiveMoves, generateValidActiveMoves } from '../../gameLogic/moveGenerator';
import { addSpotVec, compareVec, getDeltaVector } from '../../gameLogic/spot';
import { buildFullMove, buildPartialMove } from '../../gameLogic/move';
import { buildCellLocationStyle } from '../../util/styleHelper';
import { Arrow } from './Arrow';
import { stateIsRelatedToSide, stateIsRelatedToVictory } from '../../util/stateHelper';
import { Clock } from './Clock';
import { Link } from 'react-router-dom';

export const Board = ({ boardState, playable, 
        blackId, blackName, whiteId, whiteName, 
        gameState, onMove, userId, timeData, children,
        justBoard
}) => {
    const [ selectedPassiveSpot, setSelectedPassiveSpot ] = useState( null );
    const [ passiveMoves, setPassiveMoves ] = useState( [] );
    const [ selectedPassiveMove, setSelectedPassiveMove ] = useState( null );
    const [ potentialNextMove, setPotentialNextMove ] = useState( null );
    const [ potentialNextMoveBoardStateHash, setPotentialNextMoveBoardStateHash ] = useState( null );
    const [ activeMovesBlack, setActiveMovesBlack ] = useState( [] );
    const [ activeMovesWhite, setActiveMovesWhite ] = useState( [] );

    const getPerspectiveColor = () => {
        if( whiteId == null && blackId == null ){
            return side.BLACK;
        }
        if( userId === whiteId ){
            return side.WHITE;
        }
        else if( userId === blackId ){
            return side.BLACK;
        }
        return side.BLACK;
    }

    const hashBoardState = (boardState) => {
        // there is definitely a better way to do this
        return JSON.stringify(boardState);
    }

    const usingFlippedPerspective = () => {
        return getPerspectiveColor() === side.WHITE;
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
        let homeboardside = side.BLACK;
        if( n === 1 || n === 3 ){
            homeboardside = side.WHITE;
        }
        setPassiveMoves( generateValidPassiveMoves( boardState, [x,y], homeboardside ) );
    }

    const cellSelect_passiveMove = ( x, y, n ) => {
        // eslint-disable-next-line
        let [ passiveSpot, _ ] = selectedPassiveSpot;
        let moveSide = side.BLACK;
        if( n === 1 || n === 3 ){
            moveSide = side.WHITE;
        }
        let move = buildPartialMove( moveSide, passiveSpot, getDeltaVector( passiveSpot, [x,y] ) );
        setSelectedPassiveMove( move );
        setPassiveMoves( [] );
        setActiveMovesBlack( generateValidActiveMoves( boardState, move, side.BLACK ) );
        setActiveMovesWhite( generateValidActiveMoves( boardState, move, side.WHITE ) );
    }

    const gameRequiresUserMoveConfirmation = () => {
        /*
        if (!timeData) {
            return false;
        }
        return getTimeMode(timeData) === "cor";
        */
        // turns out this feature is nice. maybe add option to turn off?
        return true;
    }

    const cellSelect_activeMove = ( x, y, n ) => {
        let activeMove = getTargetMove( x,y,n );
        let passiveMove = selectedPassiveMove;
        let fullMove = buildFullMove( passiveMove, activeMove );
        if (gameRequiresUserMoveConfirmation()) {
            setPotentialNextMove( fullMove );
            setPotentialNextMoveBoardStateHash( hashBoardState(boardState) );
        } else {
            makeMove( fullMove );
        }
    }

    const makeMove = ( fullMove ) => {
        onMove( fullMove );
        clearSelections();
    }

    const getTargetMove = ( x, y, n ) => {
        let targetSpot = [x,y];
        for( let move of getActiveMoves( n ) ){
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
            let [ passiveSpot, subboardN ] = selectedPassiveSpot;
            return n === subboardN && compareVec( passiveSpot, [x,y] );
        }
        return false;
    }

    const spotIsValidPassiveMoveSelection = ( x, y, n ) => {
        let targetSpot = [ x,y]
        if( selectedPassiveSpot != null ){
            // eslint-disable-next-line
            let [ _, subboardN ] = selectedPassiveSpot;
            if( n === subboardN ){
                for( let move of passiveMoves ){
                    let moveEnd = addSpotVec( move.spot, move.vector );
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
        // may want to find a way to not immediately
        // clear the potential move so it looks cleaner
        setPotentialNextMove( null );
        setPotentialNextMoveBoardStateHash( null );
    }

    const _sbdRot = ( n, flipped ) => {
        if( flipped ){
            return 3 - n;
        }
        return n;
    }

    const drawBoard = ( board ) => {
        let flipped = usingFlippedPerspective();
        return <div className='boardContainer'>
            <div className="topBoardRow">
                { drawSubboard( board, _sbdRot(0,flipped) ) }
                <span className='betweenSubboard'/>
                { drawSubboard( board, _sbdRot(1,flipped) ) }
            </div>
            <div>
                { drawSubboard( board, _sbdRot(2,flipped) ) }
                <span className='betweenSubboard'/>
                { drawSubboard( board, _sbdRot(3,flipped) ) }
            </div>
            { children }
        </div>
    }

    const drawSubboard = ( board, n ) => {
        let dark = n === 0 || n === 2;
        let subboard = getSubboard( board, n );

        let output = []
        for( let iy=0; iy < 4; iy++ ){
            let row = []
            for( let ix =0;ix<4;ix++ ){
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
        return userId === blackId || userId === whiteId;
    }

    const itIsYourTurn = () => {
        return userId != null
            && userIsInGame()
            && boardState.playerTurn === getPerspectiveColor()
            && playable;
    }

    const isYourHomeboard = ( n ) => {
        const color = getPerspectiveColor();
        if( color === side.BLACK && ( n === 2 || n === 3 ) ){
            return true;
        }
        if( color === side.WHITE && ( n === 0 || n === 1 ) ){
            return true;
        }
        return false;
    }

    const cellHasYourColor = ( x, y, n ) => {
        let subboard = getSubboard( boardState, n );
        return subboardGetToken( subboard, [ x, y ] ).type === getPerspectiveColor();
    }

    const getTokens = ( subboard ) => {
        let tokens = [];
        let t = null;
        for( let iy=0;iy<4;iy++){
            for( let ix=0;ix<4;ix++){
                const spot = [ix,iy]
                t = subboardGetToken( subboard, spot );
                if( t.type !== token.EMPTY ){
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
        let flipped = usingFlippedPerspective();
        let output = [];
        if( selectedPassiveSpot != null ){
            let [ [x,y], subboardN ] = selectedPassiveSpot;
            if( subboardN === n ){
                // passive move options
                output.push(<div className='cell selected abso' style={buildCellLocationStyle(x,y,flipped)} key={"passiveCell"}></div>)
                for( let move of passiveMoves ){
                    let [mx,my] = addSpotVec( move.spot, move.vector);
                    output.push(<div className='abso moveOption' style={buildCellLocationStyle(mx,my,flipped)} key={"passiveOption" + String([mx,my])}></div>)
                }
                // selected passive move
                if( selectedPassiveMove != null ){
                    let start = selectedPassiveMove.spot;
                    let vec = selectedPassiveMove.vector;
                    output.push( <Arrow start={start} vec={vec} flipped={flipped} key={"passiveArrow"}/> );
                }
            }
        }
        let i = 0;
        for( let move of getActiveMoves( n ) ){
            output.push( <Arrow start={move.spot} vec={move.vector} flipped={flipped} key={"activeArrow" + i}/> );
            i++;
        }
        return output;
    }

    const getActiveMoves = ( n_subboard ) => {
        if( selectedPassiveSpot == null ){
            return [];
        }
        // eslint-disable-next-line
        let [ _, n_passive ] = selectedPassiveSpot;
        if( subboardIsInActiveColumnForPassiveMove( n_subboard, n_passive ) ){
            if( n_subboard === 0 || n_subboard === 1 ){
                return activeMovesWhite;
            }
            else{
                return activeMovesBlack;
            }
        }
        return [];
    }

    const subboardIsInActiveColumnForPassiveMove = ( n_curSubboard, n_passiveSubboard ) => {
        let passiveWasBlack = n_passiveSubboard === 0 || n_passiveSubboard === 2;
        let onWhiteBoard = n_curSubboard === 1 || n_curSubboard === 3;
        return (passiveWasBlack && onWhiteBoard) || (!passiveWasBlack && !onWhiteBoard);
    }

    const clickDoNothing = ( x, y ) => {
        // is a dummy function for disabling buttons.
    }

    const drawCell = ( subboard, n, x, y, dark ) => {
        let className='cell';
        let fn = clickDoNothing;
        if( itIsYourTurn() ){
            className += ' interactable'
            fn = clickCell;
        }
        let odd = (x+y) % 2 === 0
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

        return <div
            className={className}
            onClick={ ()=>fn(x,y,n) }
            key={ "cell" + String(x) + String(y) }/>
    }

    const drawToken = ( tokenObj, spot ) => {
        const [x,y] = spot
        let className = "real token " + ( (tokenObj.type === token.WHITE) ? "white" : "black" );
        return <div
            className={className}
            style={buildCellLocationStyle(x, y, usingFlippedPerspective())}
            key={tokenObj.key}/>
    }

    const renderBoardState = ( sideValue ) => {
        if( !stateIsRelatedToSide( sideValue, gameState ) ){
            return <div/>;
        }
        let colorName = "black";
        if( sideValue === side.WHITE ){
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

    const renderClock = ( sideValue ) => {
        if( ! timeData ){
            return <div/>
        }
        return <Clock
            timeData={timeData}
            sideValue={sideValue}
        />
    }

    const drawName = ( name, id, sideValue ) => {
        return <div className='nameBar'>
            {renderBoardState( sideValue )}
            <Link to={'/user/' + id } className='btn myBtn nameLink'>
                {name}
            </Link>
            {renderClock(sideValue)}
        </div>
    }


    const thereIsAPotentialMoveForCurrentBoardState = () => {
        return potentialNextMove != null
            && potentialNextMoveBoardStateHash === hashBoardState(boardState);
    }

    const getBoardState = () => {
        if (thereIsAPotentialMoveForCurrentBoardState()) {
            return makeValidatedMove(boardState, potentialNextMove);
        }
        return boardState;
    }

    const drawConfirmMoveButtons = () => {
        let content;
        let className = 'confirmationBox';
        if (!thereIsAPotentialMoveForCurrentBoardState()) {
            content = <div/>;
        } else {
            className += ' confirmationBoxActivated'
            content = <Fragment>
                <button
                    className='btn myBtn confirmationButton boardUndoButton'
                    onClick={clearSelections}
                >
                    undo
                </button>
                <button
                    className='btn myBtn confirmationButton boardConfirmButton'
                    onClick={()=>makeMove(potentialNextMove)}
                >
                    confirm
                </button>
            </Fragment>
        }
        return <div className={className}>
            {content}
        </div>
    }

    if (justBoard) {
        return <div>
            <div className='titlesContainer'>
                {drawTopName()}
                <div>
                    vs
                </div>
                {drawBottomName()}
            </div>
            <div className='fullBoardContainer sideBySide'>
                { drawBoard( getBoardState() ) }
            </div>
        </div>;
    }
    return <div>
        <div className='fullBoardContainer'>
            { drawTopName() }
            { drawBoard( getBoardState() ) }
            <div className='boardBottomContainer'>
                { drawBottomName() }
                { drawConfirmMoveButtons() }
            </div>
        </div>
    </div>
}
