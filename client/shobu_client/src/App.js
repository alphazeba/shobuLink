import logo from './logo.svg';
import './App.css';

import { Board } from './Board'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Board>
          this is the children
        </Board>
      </header>
    </div>
  );
}

export default App;
