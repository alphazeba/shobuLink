import React, { useEffect, useState } from 'react';

export const Clock = ( { time, lastTimestamp, ticking } ) => {

    const [ outputTime, setOutputTime ] = useState( 0 );

    useEffect( () => {
        const interval = setInterval( ()=>{
            onPeriodicUpdate();
        }, 0.5 * 1000 );

        return () => clearInterval( interval )
    });

    const onPeriodicUpdate = () => {
        updateOutputTime();
    }

    const updateOutputTime = () => {
        if( ticking ){
            setOutputTime( time + getTimeSinceLastTimestamp() );
        }
        else{ 
            setOutputTime( time );
        }
    }

    const getTimeSinceLastTimestamp = () => {
        const output = Date.now() - lastTimestamp;
        // console.log( output );
        return output;
    }

    const getTimeText = () => {
        return getMinText() + ":" + getSecondText();
    }

    const getMinText = () => {
        return Math.floor( ( outputTime / 1000 )/ 60 ).toString();
    }

    const getSecondText = () => {
        const val = Math.floor( ( outputTime / 1000 ) % 60 );
        if( val < 10 ){
            return "0" + val.toString();
        }
        return val.toString();
    }
    
    return <div>{getTimeText()}</div>;
}

export const getPlayerTimeUsed = ( moves, startTime ) => {
    let blackTime = 0;
    let whiteTime = 0;
    let lastTimestamp = startTime;
    let isBlackSide = true;
    for( let move of moves ){
        let curTimestamp = move.t;
        let delta = curTimestamp - lastTimestamp;
        lastTimestamp = curTimestamp;
        if( isBlackSide ){
            blackTime += delta;
        }
        else {
            whiteTime += delta;
        }
        isBlackSide = ! isBlackSide;
    }
    let output = {
        blackTime: blackTime,
        whiteTime: whiteTime,
        lastTimestamp: lastTimestamp,
    }
    return output;
}