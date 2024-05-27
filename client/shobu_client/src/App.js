import './App.css';
import {
    createBrowserRouter,
    RouterProvider
} from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { GamePage } from './pages/GamePage';
import { LoginPage, useLoginState } from './pages/LoginPage';
import { CreateGamePage } from './pages/CreateGamePage';
import { PlayerPage } from './pages/PlayerPage';
import { FindGamePage } from './pages/FindGamePage';
import React from 'react'
import { Footer } from './bits/Footer';
import { HowToPlay } from './pages/HowToPlay';

function App() {
    const loginState = useLoginState();
    const router = createBrowserRouter([
        {
            path: "/",
            element: <HomePage loginState={loginState} />,
        },
        {
            path: "game/:gameId",
            element: <GamePage loginState={loginState} />,
        },
        {
            path: "login/:redirect",
            element: <LoginPage loginState={loginState} />,
        },
        {
            path: "createGame",
            element: <CreateGamePage loginState={loginState} />,
        },
        {
            path: "user/:userId",
            element: <PlayerPage loginState={loginState} />,
        },
        {
            path: "findGame",
            element: <FindGamePage loginState={loginState} />,
        },
        {
            path: "howToPlay",
            element: <HowToPlay loginState={loginState} />,
        }
    ]);

    return (
        <div className="App">
            <header className="App-container">
                <div className='mainContent'>
                    <RouterProvider router={router} />
                </div>
                <Footer/>
            </header>
        </div>
    );
}

export default App;
