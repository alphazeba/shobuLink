import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { side } from '../gameLogic/token';
import { createGame } from '../webAppLogic/api';
import './FindGamePage.css';
import { Header } from '../bits/Header';
import { ToggleButtons, newToggleValue } from '../bits/ToggleButtons';
import { useListOpenGames } from '../webAppLogic/OpenGameLogic';

export const FindGamePage = ({loginState}) => {
    const openGameState = useListOpenGames();
    const navigate = useNavigate();

    useEffect( () => {
        openGameState.loadGames();
    }, []);

    const getOpenColor = (game) => {
        if ("buName" in game) {
            return side.WHITE;
        }
        return side.BLACK;
    }

    const getPlayerName = (game) => {
        if ("buName" in game) {
            return game.buName;
        }
        return game.wuName;
    }

    const getTimeMode = (game) => {
        const timeMode = game.rules?.tm;
        if (!timeMode) {
            return mapTimeMode("std");
        }
        return mapTimeMode(timeMode);
    }

    const timeModeMap = {
        "std": "Real Time",
        "cor": "Correspondance",
    }
    const mapTimeMode = (timeMode) => {
        if (timeMode in timeModeMap) {
            return timeModeMap[timeMode];
        }
        return timeMode;
    }

    const getTimeControl = (game) => {
        const mins = game.secs / 60;
        if (mins < 100) {
            return mins.toString() + " min";
        }
        const days = mins / 60 / 24;
        return days.toString() + " day";
    }

    const getGameType = (game) => {
        let timeMode = getTimeMode(game);
        let timeControl = game.secs;
    }

    const handleClickGame = ( gameId ) => {
        navigate( "/game/" + gameId );
    }

    const renderColor = (game) => {
        const color = getOpenColor(game);
        let className = "findGameToken token ";
        if (color === side.BLACK) {
            className += "black";
        } else {
            className += "white";
        }
        return <div className={className}/>
    }

    const renderGame = (game) => {
        return <div>
            <button
                className='btn myBtn'
                onClick={()=>handleClickGame(game.id)}
            >
                <div>
                    <span className='floatLeft'>
                        {renderColor(game)}
                    </span>
                    <span className='floatLeft findGamePlayerName'>
                        {getPlayerName(game)}
                    </span>
                </div>
                <div>{getTimeMode(game)}: {getTimeControl(game)}</div>
            </button>
        </div>
    }

    const renderFoundGames = () => {
        if (openGameState.games.length === 0) {
            if (openGameState.loading) {
                return <div>loading...</div>
            } else {
                return <div>
                    <div>There are no games</div>
                    <div >
                        Try creating a game <a className='btn myBtn' href={"/createGame"}> here</a>
                    </div>
                </div>
            }
        }
        return openGameState.games.map((game)=>renderGame(game));
    }

    return <div>
        <Header loginOptional={true} loginState={loginState} />
        <div className='findGamePageContent'>
            {renderFoundGames()}
        </div>
    </div>
}