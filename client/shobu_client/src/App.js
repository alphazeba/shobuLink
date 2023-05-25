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
import React from 'react'

function App() {
  const loginState = useLoginState();
  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomePage loginState={loginState}/>,
    },
    {
      path: "game/:gameId",
      element: <GamePage loginState={loginState}/>
    },
    {
      path: "login/:redirect",
      element: <LoginPage loginState={loginState}/>
    },
    {
      path: "createGame",
      element: <CreateGamePage loginState={loginState}/>
    },
    {
      path: "user/:userId",
      element: <PlayerPage loginState={loginState}/>
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
