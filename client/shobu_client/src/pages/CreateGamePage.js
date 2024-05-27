import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { side } from '../gameLogic/token';
import { createGame } from '../webAppLogic/api';
import './CreateGamePage.css';
import { Header } from '../bits/Header';
import { ToggleButtons, newToggleValue } from '../bits/ToggleButtons';

const TIMEMODE_TIMED = "std";
const TIMEMODE_CORRESPONDANCE = "cor";
const SIDE_RANDOM = 777;
const SIDE_TOGGLES_TV = [
    newToggleValue("Black", side.BLACK),
    newToggleValue("Random", SIDE_RANDOM),
    newToggleValue("White", side.WHITE),
];
const TIME_MODE_TV = [
    newToggleValue("Real Time", TIMEMODE_TIMED),
    newToggleValue("Correspondance", TIMEMODE_CORRESPONDANCE),
];
const TIME_CONTROLS_TIMED_TV = [
    minTv(1), minTv(5), minTv(10), minTv(30), minTv(60)
];
const TIME_CONTROLS_CORRESPONDANCE_TV = [
    dayTv(1), dayTv(2), dayTv(3)
];
const TIME_CONTROLS_TIMED_DEFAULT = TIME_CONTROLS_TIMED_TV[1].value;
const TIME_CONTROLS_CORRESPONDANCE_DEFAULT = TIME_CONTROLS_CORRESPONDANCE_TV[1].value;

export const CreateGamePage = ({loginState}) => {
    const [ timeMode, setTimeMode ] = useState(TIMEMODE_TIMED)
    const [ timeControlTimed, setTimeControlTimed ] = useState( TIME_CONTROLS_TIMED_DEFAULT );
    const [ timeControlCorrespondance, setTimeControlCorrespondance ] = useState( TIME_CONTROLS_CORRESPONDANCE_DEFAULT );
    const [ sideSelect, setSide ] = useState( SIDE_RANDOM );
    const navigate = useNavigate();

    const timeControlIsValid = ( value ) => {
        const allTimeControlsTvs = TIME_CONTROLS_TIMED_TV.concat(TIME_CONTROLS_CORRESPONDANCE_TV);
        for (let tv of allTimeControlsTvs) {
            if (value === tv.value) {
                return true;
            }
        }
        return false;
    }

    const getTimeControl = () => {
        if (timeMode === TIMEMODE_CORRESPONDANCE) {
            return timeControlCorrespondance;
        }
        return timeControlTimed;
    }

    const handleCreateGame = () => {
        let chosenSide = sideSelect;
        if( !(sideSelect === side.BLACK || sideSelect === side.WHITE) ){
            let options = [ side.BLACK, side.WHITE ];
            chosenSide = options[ 
                Math.floor( options.length * Math.random() )
            ];
        }
        let chosenTimeControl = getTimeControl();
        if( ! timeControlIsValid( chosenTimeControl ) ){
            return;
        }
        let chosenTimeMode = timeMode;
        createGame(
            loginState.loginInfo,
            chosenSide,
            chosenTimeControl,
            chosenTimeMode
        ).then( (gameId) => {
            navigate( "/game/" + gameId );
        } );
    }

    const renderTimeControlInput = () => {
        if (timeMode === TIMEMODE_CORRESPONDANCE) {
            return <ToggleButtons
                toggleValues={TIME_CONTROLS_CORRESPONDANCE_TV}
                value={timeControlCorrespondance}
                onChange={setTimeControlCorrespondance}
            />
        }
        return <ToggleButtons
            toggleValues={TIME_CONTROLS_TIMED_TV}
            value={timeControlTimed}
            onChange={setTimeControlTimed}
        />
    }

    return <div>
        <Header loginState={loginState}/>
        <div className='Title'>Create a game</div>
        <div className='inputSpace'>
            <ToggleButtons
                toggleValues={TIME_MODE_TV}
                value={timeMode}
                onChange={setTimeMode}
            />
        </div>
        <div className='inputSpace'>
            {renderTimeControlInput()}
        </div>
        <div className='inputSpace'>
            <ToggleButtons
                toggleValues={SIDE_TOGGLES_TV}
                value={sideSelect}
                onChange={setSide}
            />
        </div>
        <div className='line'/>
        <div>
            <button
                className='btn myBtn'
                onClick={handleCreateGame}
            >
                Create
            </button>
        </div>
    </div>
}

function minTv(minutes) {
    return newToggleValue(minutes.toString() + " min", minutes * 60);
}

function dayTv(days) {
    return newToggleValue(days.toString() + " day", days * 24 * 60 * 60);
}