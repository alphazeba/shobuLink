import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getLoginInfo } from './LoginPage';
import { GamePreviewLogic } from '../webAppLogic/GamePreviewLogic';
import { Board } from '../bits/game/Board';
import { parsePreview } from '../util/stateHelper';
import { buildTestBoard } from '../util/testUtil';
import { side } from '../gameLogic/token';

export const PlayerPage = () => {
    const loginInfo = getLoginInfo();
    const { userId } = useParams();
    const gamePreviewState = GamePreviewLogic();
    const navigate = useNavigate();
    var alreadyRequestedGame = false;

    useEffect( () => {
        if( ! alreadyRequestedGame ){
            gamePreviewState.loadGamePreviews( userId );
            alreadyRequestedGame = true;
        }
    } );

    const handleClickGame = ( gameId ) => {
        navigate( "/game/" + gameId );
    }

    const renderGamePreview = ( gamePreview ) => {
        let userName = "User"
        let bId = gamePreview.oId;
        let bName = gamePreview.oName;
        let wId = userId;
        let wName = userName;
        if( gamePreview.userSide == side.BLACK ){
            wId = gamePreview.oId;
            wName = gamePreview.oName;
            bId = userId;
            bName = userName
        }

        return <div key={gamePreview.gameId}>
            <button className='btn myBtn' onClick={()=>handleClickGame( gamePreview.gameId )}>
                <Board boardState={ parsePreview( gamePreview.prv ) }
                    blackId={bId} blackName={bName} whiteId={wId} whiteName={wName} />
            </button>
        </div>
    }

    return <div>
        <div>
        userId: {userId}
        </div>
        <div>
            { gamePreviewState.gamePreviews.map((gp)=>renderGamePreview(gp)) }
        </div>
    </div>;
}

// the preview is not being parsed properly.
// there are sometimes too many stones on the board.
// I can't really see a pattern  relating the original to deparsed broken one.