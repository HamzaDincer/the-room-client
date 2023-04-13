import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.scss';
import logo from "../../assets/TheRoom.jpeg"
import { socket, peer } from '../../socket';

function HomePage() {

  const [roomName, setRoomName] = useState('');
  const [userName, setUserName] = useState('');
  const [guestName, setGuestName] = useState('');
  const [roomID, setRoomId] = useState('');

  const navigate = useNavigate();

  const handleCreateRoom = (e) => {
    e.preventDefault();
    if (!roomName || !userName) {
      alert("Please enter both room name and user name.");
      return;
    }
    if (roomName.length < 3 || roomName.length > 10) {
      alert("Room name must be between 3 and 10 characters.");
      return;
    }
    if (userName.length < 3 || userName.length > 10) {
      alert("User name must be between 3 and 10 characters.");
      return;
    }
     socket.emit('create-room', { roomName, userName });
    navigate(`/room/${roomName}`, { state: { userName } });
  };

  const handleJoinRoom = (e) => {
    e.preventDefault();
    if (!roomID) {
      alert("Please enter a room ID.");
      return;
    }
    socket.emit('join-room-by-id', roomID, userName);
    navigate(`/room/${roomName}`, { state: { userName } });
  };
    

  return (
    <div className="homepage">
      <div className="homepage__header">
        <img className="homepage__logo" src={logo} alt="TheRoom Logo" />
      </div>
      <div className='homepage__form'>
      <form className="homepage__form-create" onSubmit={handleCreateRoom}>
        <input
          className="homepage__input"
          type="text"
          placeholder="Enter Room Name"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
        />
        <input
          className="homepage__input"
          type="text"
          placeholder="Enter Your Name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <button className="homepage__button" type="submit">Create My Room</button>
      </form>
      <form className="homepage__form-join" onSubmit={handleJoinRoom}>
        <input
          className="homepage__input"
          type="text"
          placeholder="Enter Room ID"
          value={roomID}
          onChange={(e) => setRoomId(e.target.value)}
        />
        <input
          className="homepage__input"
          type="text"
          placeholder="Enter Your Name"
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
        />
        <button className="homepage__button" type="submit">Join Room</button>
      </form>
      </div>
    </div>
  );
}

export default HomePage;
