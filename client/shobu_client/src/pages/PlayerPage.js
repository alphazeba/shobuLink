import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GamePreviewLogic } from '../webAppLogic/GamePreviewLogic';
import { Board } from '../bits/game/Board';
import { nameToSide, side } from '../gameLogic/token';
import { Header } from '../bits/Header';

export const PlayerPage = ({loginState}) => {
    const { userId } = useParams();
    const gamePreviewState = GamePreviewLogic();
    const navigate = useNavigate();
    let alreadyRequestedGame = false;

    useEffect( () => {
        if( ! alreadyRequestedGame ){
            gamePreviewState.loadGamePreviews( userId );
            // eslint-disable-next-line
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
        if( nameToSide( gamePreview.userSide ) === side.BLACK ){
            wId = gamePreview.oId;
            wName = gamePreview.oName;
            bId = userId;
            bName = userName
        }

        return <div className='preview' key={gamePreview.gameId}>
            <button className='btn myBtn' onClick={()=>handleClickGame( gamePreview.gameId )}>
                <Board boardState={ gamePreview.boardState }
                    blackId={bId} blackName={bName} whiteId={wId} whiteName={wName} gameState={gamePreview.gameState} />
            </button>
        </div>
    }

    return <div>
        <Header loginOptional={true} loginState={loginState} />
        <div>
        userId: {userId}
        </div>
        <div>
            { gamePreviewState.gamePreviews.map((gp)=>renderGamePreview(gp)) }
        </div>
    </div>;
}