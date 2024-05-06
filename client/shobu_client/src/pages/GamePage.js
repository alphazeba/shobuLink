import React from 'react';
import { useParams } from 'react-router-dom';
import { GameLoader } from '../bits/game/GameLoader';
import { Header } from '../bits/Header';

export const GamePage = ({loginState}) => {
    const { gameId } = useParams();
    return <div>
            <Header loginOptional={true} loginState={loginState}/>
            <div className='topSpace'>
                .
            </div>
            <GameLoader
                gameId={gameId}
                loginState={loginState}
            />
        </div>;
}