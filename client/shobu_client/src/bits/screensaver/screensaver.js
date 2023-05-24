import React, { useState, useEffect } from 'react'
import { initBoard, makeValidatedMove } from '../../gameLogic/board'
import { generateAllValidFullMoves } from '../../gameLogic/moveGenerator';
import { Board } from '../game/Board';
import { checkForWin } from '../../gameLogic/gameoverChecker';

export const Screensaver = () => {
    const [ board, setBoard ] = useState( initBoard() );
    const [ gameOver, setGameOver ] = useState( false );
    const movePeriodSeconds = 2;

    useEffect( () => {
        const interval = setInterval( () => {
            onPeriodicUpdate();
        }, movePeriodSeconds * 1000 );

        return () => {
            clearInterval( interval );
        }
    } );

    const onPeriodicUpdate = () => {
        if( gameOver ){
            return;
        }
        if( checkForWin( board ) != null ){
            onGameOver();
            return;
        }
        let moves = generateAllValidFullMoves( board );
        if( moves.length == 0 ){
            onGameOver();
            return;
        }
        let newBoard = makeValidatedMove( board, 
            moves[ Math.floor( Math.random()*moves.length ) ] );
        setBoard( newBoard );
    }

    const onGameOver = () => {
        setGameOver( true );
    }

    const reset = () => {
        setBoard( initBoard() );
        setGameOver( false );
    }

    return <Board boardState={board} />
}
