import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getLoginInfo } from './LoginPage';
import { GamePreviewLogic } from '../webAppLogic/GamePreviewLogic';
import { Board } from '../bits/game/Board';
import { parsePreview } from '../util/stateHelper';
import { buildTestBoard } from '../util/testUtil';

export const PlayerPage = () => {
    const loginInfo = getLoginInfo();
    const { userId } = useParams();
    const gamePreviewState = GamePreviewLogic();

    useEffect( () => {
        gamePreviewState.loadGamePreviews( userId );
    } );

    const renderGamePreview = ( gamePreview ) => {
        return <div key={gamePreview.gameId}>
            <Board ></Board>
            {JSON.stringify( gamePreview )}
        </div>
    }
    /*
        <div>
            { gamePreviewState.gamePreviews.map((gp)=>renderGamePreview(gp)) }
        </div>
    */

    return <div>
        <div>
        userId: {userId}
        </div>
        <Board
            boardState={parsePreview( "AQCiABBAxAAb4AAElAABIBI=" )}
        />
        <Board 
            boardState={ buildTestBoard([
                "Wc1c3Wc1c3",
                "Wa4c2Wb4d2",
                "Wb1c2Wb1c2",
                "Bc4c3Wc2c1",
                "Bc1b2Bc3b4",
                "Wc4c2Wc3c1",
                "Bd1c1Bb4a4",
                "Wb4c4Wc1d1",
                "Bc1c3Bc2c4",
                "Wd4b2Wd4b2",
                "Bb1c1Bc4d4",
            ]) }
        />
    </div>;
}

// the preview is not being parsed properly.
// there are sometimes too many stones on the board.
// I can't really see a pattern  relating the original to deparsed broken one.