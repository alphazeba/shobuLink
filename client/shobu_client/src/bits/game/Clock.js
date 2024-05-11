import React, { useEffect, useState } from 'react';
import { isColorSideMove, isWhiteTimeout, isBlackTimeout } from '../../util/stateHelper';
import { side } from '../../gameLogic/token'

export const Clock = ( { timeData, sideValue } ) => {

    const time = (sideValue === side.BLACK) ? timeData.blackTime : timeData.whiteTime;
    const gameState = timeData.gameState;
    const lastTimestamp=timeData.lastTimestamp;
    const ticking=isColorSideMove(sideValue, gameState);
    const timeControlSeconds=timeData.timeControlSeconds;

    const [ outputTimeMs, setOutputTime ] = useState( 0 );

    useEffect( () => {
        onPeriodicUpdate();
        const interval = setInterval( ()=>{
            onPeriodicUpdate();
        }, 0.5 * 1000 );

        return () => clearInterval( interval )
    }, [time, lastTimestamp, ticking]);

    const onPeriodicUpdate = () => {
        updateOutputTime();
    }

    const getTimeUsed = () => {
        if( ticking ){
            return time + getTimeSinceLastTimestamp();
        }
        return time;
    }

    const updateOutputTime = () => {
        if ( // handle visuals on timeout
            (isWhiteTimeout(gameState) && sideValue === side.WHITE) ||
            (isBlackTimeout(gameState) && sideValue === side.BLACK)
        ) {
            setOutputTime(0);
            return;
        }
        const timeUsed = getTimeUsed();
        if (timeControlSeconds <= 0) {
            setOutputTime(timeUsed);
        } else {
            setOutputTime(
                Math.max(0, timeControlSeconds*1000 - timeUsed));
        }
    }

    const getTimeSinceLastTimestamp = () => {
        const output = Date.now() - lastTimestamp;
        // console.log( output );
        return output;
    }

    return <div>{getTimeText(outputTimeMs)}</div>;
}

export const buildTimeData = (
    moves,
    startTime,
    timeControlSeconds,
    gameState
) => {
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
        } else {
            whiteTime += delta;
        }
        isBlackSide = ! isBlackSide;
    }
    const timeData = {
        blackTime,
        whiteTime,
        lastTimestamp,
        timeControlSeconds,
        gameState
    };
    return timeData;
}

const getTimeText = (timeMs) => {
    const hrs = getHours(timeMs);
    const mins = getMinutes(timeMs)%60;
    const seconds = getSeconds(timeMs)%60;
    let segments = []
    if (hrs >= 1) {
        segments = [timeToSlot(hrs,0), timeToSlot(mins,2), timeToSlot(seconds,2)];
    } else {
        segments = [timeToSlot(mins,1), timeToSlot(seconds,2)]
    }
    return segments.join(':');
}

const timeToSlot = (timeNum, minNumDigits) => {
    let text = Math.floor(timeNum).toString();
    while (text.length < minNumDigits) {
        text = "0" + text;
    }
    return text;
}

const getSeconds = (ms) => {
    return ms/1000;
}
const getMinutes = (ms) => {
    return getSeconds(ms)/60;
}
const getHours = (ms) => {
    return getMinutes(ms)/60;
}