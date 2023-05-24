import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoginState } from './LoginPage';
import { side } from '../gameLogic/token';
import { createGame } from '../webAppLogic/api';
import './CreateGamePage.css';
import { Header } from '../bits/Header';
import { MyInput } from '../bits/login/MyInput';

export const CreateGamePage = () => {
    const SIDE_RANDOM = 777;
    const [ timeControl, setTimeControl ] = useState( 420 );
    const [ sideSelect, setSide ] = useState( SIDE_RANDOM );
    const [ timeControlError, setTimeControlError ] = useState( false );
    const minTimeControl = 10;
    const maxTimeControl = 10 * 60;
    const navigate = useNavigate();
    const loginState = useLoginState();

    const getLabel = ( sideValue ) => {
        switch( sideValue ){
            case side.BLACK:
                return "Black";
            case side.WHITE:
                return "White";
            case SIDE_RANDOM:
                return "Random";
        }
    }

    const renderSideSelectable = ( sideValue ) => {
        return <Selectable selected={sideSelect==sideValue} onClick={()=>setSide(sideValue)}>
            {getLabel( sideValue )}
        </Selectable>
    }

    const handleTimeChange = (e) => {
        var value = parseInt( e.target.value );
        if( isNaN(value) ){
            value = 0;
        }
        setTimeControlError( !timeControlIsValid( value ) );
        setTimeControl( value );
    }

    const timeControlIsValid = ( value ) => {
        return value < 10 * 60 && value >= 30;
    }

    const handleCreateGame = () => {
        var chosenSide = sideSelect;
        if( !(sideSelect == side.BLACK || sideSelect == side.WHITE) ){
            var options = [ side.BLACK, side.WHITE ];
            chosenSide = options[ Math.floor( options.length * Math.random() ) ];
        }
        var chosenTimeControl = timeControl;
        if( ! timeControlIsValid( chosenTimeControl ) ){
            return;
        }
        createGame( loginState.loginInfo, chosenSide, chosenTimeControl )
            .then( (gameId) => {
                navigate( "/game/" + gameId );
            } );
    }

    const renderTimeControlError = () => {
        if( ! timeControlError ){
            return;
        }
        return <div className="error">
            Time control must be greater than {minTimeControl} and less than {maxTimeControl}
            </div>
    }

    return <div>
        <Header />
        <h1>Create a game</h1>
        <div className='inputSpace'>
            {renderTimeControlError()}<MyInput title='Seconds' value={timeControl} onChange={ (e)=>handleTimeChange( e ) } />
        </div>
        <div>
            {renderSideSelectable(side.BLACK)}
            {renderSideSelectable(SIDE_RANDOM)}
            {renderSideSelectable(side.WHITE)}
        </div>
        <div className='line'></div>
        <div>
            <button className='btn myBtn' onClick={handleCreateGame}>Create</button>
        </div>
    </div>
}


const Selectable = ({children,selected,onClick}) => {
    var className = "btn myBtn sideSelector btn ";
    if( selected ){
        className += " selected";
    }
    return <button className={className} onClick={onClick} >
        {children}
    </button>
}