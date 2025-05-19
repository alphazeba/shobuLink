import './App.css';
import {
    createHashRouter,
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

    const wrap = (content) => {
        return <>
            <div className='mainContent'>
                {content}
            </div>
            <Footer/>
        </>
    }

    const router = createHashRouter([
        {
            path: "/",
            element: wrap(<HomePage loginState={loginState} />),
        },
        {
            path: "game/:gameId",
            element: wrap(<GamePage loginState={loginState} />),
        },
        {
            path: "login/:redirect",
            element: wrap(<LoginPage loginState={loginState} />),
        },
        {
            path: "createGame",
            element: wrap(<CreateGamePage loginState={loginState} />),
        },
        {
            path: "user/:userId",
            element: wrap(<PlayerPage loginState={loginState} />),
        },
        {
            path: "findGame",
            element: wrap(<FindGamePage loginState={loginState} />),
        },
        {
            path: "howToPlay",
            element: wrap(<HowToPlay loginState={loginState} />),
        }
    ]);

    return (
        <div className="App">
            <header className="App-container">
                <RouterProvider router={router} />
            </header>
        </div>
    );
}

export default App;
