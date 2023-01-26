import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { GameLoader } from './GameLoader';
import { ForceUserToLogin } from './LoginPage';
import { side } from './logic/token';
import { createGame } from './api';
import './CreateGamePage.css';

export const CreateGamePage = () => {
    const SIDE_RANDOM = 777;
    const [ timeControl, setTimeControl ] = useState( 420 );
    const [ sideSelect, setSide ] = useState( SIDE_RANDOM );
    const [ timeControlError, setTimeControlError ] = useState( false );
    const minTimeControl = 10;
    const maxTimeControl = 10 * 60;
    const navigate = useNavigate();

    {

    }

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
            chosenSide = options[ Math.floor( options.length * Math.random() )];
        }
        var chosenTimeControl = timeControl;
        if( ! timeControlIsValid( chosenTimeControl ) ){
            return;
        }
        createGame( chosenSide, chosenTimeControl )
            .then( (gameId) => {
                navigate( "/game/" + gameId );
            });
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
        <ForceUserToLogin />
        <div>
            {renderTimeControlError()}<input value={timeControl} onChange={ (e)=>handleTimeChange( e ) } />
        </div>
        <div>
            {renderSideSelectable(side.BLACK)}
            {renderSideSelectable(SIDE_RANDOM)}
            {renderSideSelectable(side.WHITE)}
        </div>
        <div>
            <button onClick={handleCreateGame}>Create</button>
        </div>
    </div>
}


const Selectable = ({children,selected,onClick}) => {

    var className = "sideSelector btn ";
    if( selected ){
        className += " selected";
    }
    return <button className={className} onClick={onClick} >
        {children}
    </button>
}