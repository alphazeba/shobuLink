import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { side } from '../gameLogic/token';
import { createGame } from '../webAppLogic/api';
import './CreateGamePage.css';
import { Header } from '../bits/Header';
import { MyInput } from '../bits/login/MyInput';

const TIMEMODE_TIMED = "std";
const TIMEMODE_CORRESPONDANCE = "cor";

export const CreateGamePage = ({loginState}) => {
    const SIDE_RANDOM = 777;
    const [ timeMode, setTimeMode ] = useState(TIMEMODE_TIMED)
    const [ timeControl, setTimeControl ] = useState( 420 );
    const [ sideSelect, setSide ] = useState( SIDE_RANDOM );
    const [ timeControlError, setTimeControlError ] = useState( false );
    const minTimeControl = 30;
    const maxTimeControl = 2 * 24 * 60 * 60; // 2 days, hours, min, seconds
    const navigate = useNavigate();

    const getLabel = ( sideValue ) => {
        switch( sideValue ){
            case side.BLACK:
                return "Black";
            case side.WHITE:
                return "White";
            case SIDE_RANDOM:
                return "Random";
            default:
                throw new Error( "an invalid sideValue was provided" );
        }
    }

    const renderSideSelectable = ( sideValue ) => {
        return <Selectable
            selected={sideSelect===sideValue}
            onClick={()=>setSide(sideValue)}
        >
            {getLabel( sideValue )}
        </Selectable>
    }

    const handleTimeChange = (e) => {
        let value = parseInt( e.target.value );
        if( isNaN(value) ){
            value = 0;
        }
        setTimeControlError( !timeControlIsValid( value ) );
        setTimeControl( value );
    }

    const handleTimeModeChange = (e) => {
        let value = e.target.value;
        setTimeMode(value);
    }

    const timeControlIsValid = ( value ) => {
        return minTimeControl <= value && value < maxTimeControl;
    }

    const handleCreateGame = () => {
        let chosenSide = sideSelect;
        if( !(sideSelect === side.BLACK || sideSelect === side.WHITE) ){
            let options = [ side.BLACK, side.WHITE ];
            chosenSide = options[ 
                Math.floor( options.length * Math.random() )
            ];
        }
        let chosenTimeControl = timeControl;
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

    const renderTimeControlError = () => {
        if( ! timeControlError ){
            return;
        }
        return <div className="error">
            Time control must be greater than {minTimeControl-1} and less than {maxTimeControl}
        </div>
    }

    const renderSideInput = () => {
        return <div>
            {renderSideSelectable(side.BLACK)}
            {renderSideSelectable(SIDE_RANDOM)}
            {renderSideSelectable(side.WHITE)}
        </div>;
    }

    const renderTimeModeInput = () => {
        return <div className='input-group'>
            <span className='input-group-addon'>
                Time mode&nbsp;
            </span>
            <select
                className='myInput-input'
                value={timeMode}
                onChange={(e)=>handleTimeModeChange(e)}
            >
                <option value={TIMEMODE_TIMED}>
                    Timed
                </option>
                <option value={TIMEMODE_CORRESPONDANCE}>
                    Correspondance
                </option>
            </select>
        </div>
    }

    return <div>
        <Header loginState={loginState}/>
        <h1>Create a game</h1>
        <div className='inputSpace'>
            {renderTimeModeInput()}
        </div>
        <div className='inputSpace'>
            {renderTimeControlError()}
            <MyInput
                title='Seconds'
                value={timeControl}
                onChange={(e)=>handleTimeChange( e )}
            />
        </div>
        {renderSideInput()}
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


const Selectable = ({children,selected,onClick}) => {
    let className = "btn myBtn sideSelector btn ";
    if( selected ){
        className += " selected";
    }
    return <button className={className} onClick={onClick} >
        {children}
    </button>
}