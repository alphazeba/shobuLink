import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCompletePreview, useActivePreview } from '../webAppLogic/GamePreviewLogic';
import { Board } from '../bits/game/Board';
import { nameToSide, side } from '../gameLogic/token';
import { Header } from '../bits/Header';
import { ToggleButtons, newToggleValue } from '../bits/ToggleButtons';
import './PlayerPage.css';
import { isBlackMove, isWhiteMove } from '../util/stateHelper';

const TAB_ACTIVE = 69;
const TAB_COMPLETED = 420;
const TAB_TV = [
    newToggleValue("Active", TAB_ACTIVE),
    newToggleValue("Completed", TAB_COMPLETED),
];

export const PlayerPage = ({loginState}) => {
    const { userId } = useParams();
    const [tab, setTab] = useState(TAB_ACTIVE);
    const completeGamePreviews = useCompletePreview();
    const activeGamePreviews = useActivePreview();
    const navigate = useNavigate();

    useEffect( () => {
        if (tab === TAB_COMPLETED
            && userId !== completeGamePreviews.loadedUserId
        ) {
            completeGamePreviews.loadGamePreviews( userId );
        }
        if (tab === TAB_ACTIVE
            && userId !== activeGamePreviews.loadedUserId
        ) {
            activeGamePreviews.loadGamePreviews( userId );
        }
    }, [
        tab,
        userId,
        completeGamePreviews.loadedUserId,
        activeGamePreviews.loadedUserId,
    ]);

    const handleClickGame = ( gameId ) => {
        navigate( "/game/" + gameId );
    }

    const renderGamePreview = ( gamePreview, activeNotification=false ) => {
        let userName = userId;
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
        let startTime = new Date(gamePreview.startTime).toLocaleDateString(
            undefined,
        {
            year: "numeric",
            month: "2-digit",
            day: "2-digit"
        });
        let state = gamePreview.state;

        return <div className='preview' key={gamePreview.gameId}>
            {activeNotification ? <div className='activeNotification'/> : <div/>}
            <button
                className='btn myBtn'
                onClick={()=>handleClickGame( gamePreview.gameId )}
            >
                <div className='previewBoardContainer'>
                    <Board boardState={ gamePreview.boardState }
                        blackId={bId} blackName={bName}
                        whiteId={wId} whiteName={wName}
                        gameState={gamePreview.state}
                        justBoard={true}
                    />
                </div>
                <div className='metaDataContainer'>
                    <div>
                        {startTime}
                    </div>
                    <div>
                        {state}
                    </div>
                </div>
            </button>
        </div>
    }

    const renderActivePreviews = () => {
        if (activeGamePreviews.loadedUserId !== userId) {
            return <div>loading...</div>
        }
        let yourTurnGames = [];
        let otherGames = [];
        for (const gamePreview of activeGamePreviews.gamePreviews) {
            // get gameState
            const gameState = gamePreview.state;
            // get players Side
            const playersSide = nameToSide(gamePreview.userSide);
            if (
                (isBlackMove(gameState) && playersSide === side.BLACK)
                || (isWhiteMove(gameState) && playersSide === side.WHITE)
            ) {
                yourTurnGames.push(renderGamePreview(gamePreview, true));
            } else {
                otherGames.push(renderGamePreview(gamePreview));
            }
        }
        const games = yourTurnGames.concat(otherGames);
        if (games.length === 0) {
            return <div>
                No currently active games
            </div>
        }
        return yourTurnGames.concat(otherGames);
    }

    const renderCompletedGames = () => {
        if (completeGamePreviews.loadedUserId !== userId) {
            return <div>loading...</div>
        }
        const games = completeGamePreviews.gamePreviews
            .map((gp)=>renderGamePreview(gp));
        if (games.length <= 0) {
            return <div>
                No completed games
            </div>
        }
        return games;
    }

    const renderPreviews = () => {
        if (tab === TAB_ACTIVE) {
            return renderActivePreviews();
        }
        return renderCompletedGames();
    }

    return <div>
        <Header loginOptional={true} loginState={loginState} />
        <div className='playerPageContent'>
            <div className='Title'>
            {userId}'s games
            </div>
            <div>
                <ToggleButtons
                    toggleValues={TAB_TV}
                    value={tab}
                    onChange={setTab}
                />
            </div>
            <div>
                {renderPreviews()}
            </div>
        </div>
    </div>;
}