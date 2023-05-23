import './App.css';
import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom';
import { GamePage } from './pages/GamePage';
import { LoginPage } from './pages/LoginPage';
import { CreateGamePage } from './pages/CreateGamePage';
import { PlayerPage } from './pages/PlayerPage';
import { Board } from './bits/game/Board'
import { GameLoader } from './bits/game/GameLoader';
import React, { useState } from 'react'

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <div> Try creating a game <a href={"/createGame"}> here</a> </div>,
    },
    {
      path: "game/:gameId",
      element: <GamePage />
    },
    {
      path: "login/:redirect",
      element: <LoginPage />
    },
    {
      path: "createGame",
      element: <CreateGamePage />
    },
    {
      path: "user/:userId",
      element: <PlayerPage />
    }
  ]);

  return (
    <div className="App">
      <header className="App-header">
        <RouterProvider router={router} />
      </header>
    </div>
  );
}

export default App;
