import logo from './logo.svg';
import './App.css';

import { Board } from './Board'
import { GameLoader } from './GameLoader';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <GameLoader gameId="f0802b2c-60ec-4bb5-b718-d912ae8e3f54" />
      </header>
    </div>
  );
}

export default App;
