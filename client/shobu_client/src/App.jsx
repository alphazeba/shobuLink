import './App.css'
import { HashRouter, Routes, Route } from "react-router";
import { HomePage } from './pages/HomePage';
import { Footer } from './bits/Footer';
import { GamePage } from './pages/GamePage';
import { LoginPage, useLoginState } from './pages/LoginPage';
import { CreateGamePage } from './pages/CreateGamePage';
import { PlayerPage } from './pages/PlayerPage';
import { FindGamePage } from './pages/FindGamePage';
import { HowToPlay } from './pages/HowToPlay';

export default function App() {
  const loginState = useLoginState();

  return (
    <HashRouter>
      <div className='mainContent'>
        <Routes>
          <Route path="/" element={<HomePage loginState={loginState}/>}/>
          <Route path="game/:gameId" element={<GamePage loginState={loginState}/>}/>
          <Route path="login/:redirect" element={<LoginPage loginState={loginState}/>}/>
          <Route path="createGame" element={<CreateGamePage loginState={loginState}/>}/>

          <Route path="user/:userId" element={<PlayerPage loginState={loginState}/>}/>
          <Route path="findGame" element={<FindGamePage loginState={loginState}/>}/>
          <Route path="howToPlay" element={<HowToPlay loginState={loginState}/>}/>
        </Routes>
      </div>
      <Footer />
    </HashRouter>
  )
}
