import logo from './logo.svg';
import './App.css';
import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom';
import { GamePage } from './GamePage';
import { Board } from './Board'
import { GameLoader } from './GameLoader';
import React, { useState } from 'react'
function App() {
  const [ userId, setUserId ] = useState("qwer");


  const router = createBrowserRouter([
    {
      path: "/",
      element: <div> try going to the demo page <a href={"/demo"}> here </a> </div>,
    },
    {
      path: "/demo",
      element: <div><a href={"/game/f0802b2c-60ec-4bb5-b718-d912ae8e3f54"}>click here</a> </div>
    },
    {
      path: "game/:gameId",
      element: <div>test<GamePage userId={userId}/></div>
    }
  ])

  return (
    <div className="App">
      <header className="App-header">
        <input value={userId} onChange={(event)=>setUserId(event.target.value)}/>
        <div>{userId}</div>
        <RouterProvider router={router} />
      </header>
    </div>
  );
}

export default App;
