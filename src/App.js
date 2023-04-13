import { BrowserRouter, Routes, Route } from 'react-router-dom';
import useSpeechToText from 'react-hook-speech-to-text';
import './App.scss';
import RoomPage from './pages/RoomPage/RoomPage';
import { socket, peer } from './socket';
import HomePage from './pages/HomePage/HomePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element ={<HomePage/>}></Route>
        <Route path="/room/:roomname" element ={<RoomPage/>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
