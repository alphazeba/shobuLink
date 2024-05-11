import React, { useEffect, useState } from 'react';
import { 
    isWhiteTimeout,
    isBlackTimeout,
    stateIsActive,
    stateIsBeingPlayed,
    stateIsNotStarted
} from '../../util/stateHelper';
import { side } from '../../gameLogic/token'

export const Clock = ( { timeData, sideValue } ) => {

    const [ outputTimeMs, setOutputTime ] = useState( 0 );

    useEffect( () => {
        onPeriodicUpdate(false);
        if (!stateIsBeingPlayed(timeData.gameState)) {
            return;
        }
        const interval = setInterval( ()=>{
            onPeriodicUpdate(true);
        }, 0.5 * 1000 );
        return () => clearInterval( interval )
    }, [timeData]);

    const onPeriodicUpdate = (insideInterval) => {
        console.log("clock update running inside interval: ", insideInterval);
        updateOutputTime();
    }

    const getTime = () => {
        if (sideValue === side.BLACK) {
            return getBlackTime(timeData);
        }
        return getWhiteTime(timeData);
    }

    const updateOutputTime = () => {
        if ( // handle visuals on timeout
            (isWhiteTimeout(timeData.gameState) && sideValue === side.WHITE) ||
            (isBlackTimeout(timeData.gameState) && sideValue === side.BLACK)
        ) {
            setOutputTime(0);
            return;
        }
        if (timeData.timeControlSeconds <= 0) {
            setOutputTime(getTime());
        } else {
            setOutputTime(
                Math.max(0, timeData.timeControlSeconds*1000 - getTime()));
        }
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
        gameState,
        lastMoveWasBlack: isBlackSide,
    };
    return timeData;
}

export const getBlackTime = (timeData) => {
    if ( stateIsNotStarted( timeData.gameState ) ){
        return 0;
    }
    if (timeData.lastMoveWasBlack) {
        return timeData.blackTime + getTickingMs(timeData);
    }
    return timeData.blackTime;
}

export const getWhiteTime = (timeData) => {
    if ( stateIsNotStarted( timeData.gameState ) ){
        return 0;
    }
    if (!timeData.lastMoveWasBlack) {
        return timeData.whiteTime + getTickingMs(timeData);
    }
    return timeData.whiteTime;
}

const getTickingMs = (timeData) => {
    if( stateIsActive(timeData.gameState) ){
        return Date.now() - timeData.lastTimestamp;
    }
    return 0;
}

export const isSomeoneOutOfTime = (timeData) => {
    const timeControlMs = timeData.timeControlSeconds * 1000;
    return timeControlMs < Math.max(getBlackTime(timeData), getWhiteTime(timeData))
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