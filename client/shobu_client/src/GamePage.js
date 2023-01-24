

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { GameLoader } from './GameLoader';


export const GamePage = ({userId}) => {
    const { gameId } = useParams();
    return <GameLoader gameId={gameId} userId={userId} />
}