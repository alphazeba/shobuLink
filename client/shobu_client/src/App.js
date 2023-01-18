import logo from './logo.svg';
import './App.css';

import { Board } from './Board'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <Board>
          this is the children
        </Board>
      </header>
    </div>
  );
}

export default App;
