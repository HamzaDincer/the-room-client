import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.scss';
import RoomPage from './pages/RoomPage/RoomPage';
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
