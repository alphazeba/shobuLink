

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { GameLoader } from '../bits/game/GameLoader';
import { HomeButton } from '../bits/game/HomeButton';
import { ForceUserToLogin } from './LoginPage';

export const GamePage = () => {
    const { gameId } = useParams();
    return <div>
            <HomeButton />
            <ForceUserToLogin />
            <div className='topSpace'>
                .
            </div>
            <GameLoader gameId={gameId} />
        </div>;
}