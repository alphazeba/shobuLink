import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { side } from '../gameLogic/token';
import './FindGamePage.css';
import { Header } from '../bits/Header';
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
        return <div key={game.id}>
            <button
                className='btn myBtn'
                onClick={()=>handleClickGame(game.id)}
            >
                <span className='findGamePlayerColomn'>
                    <span className='findGameToken'>
                        {renderColor(game)}
                    </span>
                    <span className=' findGamePlayerName'>
                        vs {getPlayerName(game)} :
                    </span>
                </span>
                <span>{getTimeMode(game)} {getTimeControl(game)}</span>
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
                    <div>
                        Try creating a game <Link className='btn myBtn' to="/createGame"> here</Link>
                    </div>
                </div>
            }
        }
        return <div>
            {openGameState.games.map((game)=>renderGame(game))}
            <div className='findGameBottomOfResults'>
                <div>
                    ...or create a game <Link className='btn myBtn' to="/createGame"> here</Link>
                </div>
            </div>
        </div>;
    }

    return <div>
        <Header loginOptional={true} loginState={loginState} />
        <div className='Title'>Find a game</div>
        <div className='findGamePageContent'>
            {renderFoundGames()}
            <div className='tiny'>Not seeing your game? Open games are culled if unaccepted for over a day.</div>
        </div>
    </div>
}