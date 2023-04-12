import { BrowserRouter, Routes, Route } from 'react-router-dom';
import useSpeechToText from 'react-hook-speech-to-text';
import './App.scss';
import RoomPage from './pages/RoomPage/RoomPage';
import { socket, peer } from './socket';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element ={<RoomPage/>}></Route>
        <Route path="/room" element ={<RoomPage/>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
