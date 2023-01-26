import logo from './logo.svg';
import './App.css';
import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom';
import { GamePage } from './GamePage';
import { LoginPage } from './LoginPage';
import { CreateGamePage } from './CreateGamePage';
import { Board } from './Board'
import { GameLoader } from './GameLoader';
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
