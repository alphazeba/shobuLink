

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { GameLoader } from './GameLoader';
import { ForceUserToLogin } from './LoginPage';

export const GamePage = () => {
    const { gameId } = useParams();
    return <div>
            <ForceUserToLogin/>
            <GameLoader gameId={gameId} />
        </div>
}