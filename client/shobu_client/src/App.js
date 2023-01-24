import logo from './logo.svg';
import './App.css';

import { Board } from './Board'
import { GameLoader } from './GameLoader';
import React, { useState } from 'react'
function App() {
  const [userId, setUserId ] = useState("qwer");
  return (
    <div className="App">
      <header className="App-header">
        <input value={userId} onChange={(event)=>setUserId(event.target.value)}/>
        <div>{userId}</div>
        <GameLoader gameId="f0802b2c-60ec-4bb5-b718-d912ae8e3f54" userId={userId}/>
      </header>
    </div>
  );
}

export default App;
