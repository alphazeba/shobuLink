import React from 'react';
import { useParams } from 'react-router-dom';
import { GameLoader } from '../bits/game/GameLoader';
import { Header } from '../bits/Header';

export const GamePage = () => {
    const { gameId } = useParams();
    return <div>
            <Header />
            <div className='topSpace'>
                .
            </div>
            <GameLoader gameId={gameId} />
        </div>;
}