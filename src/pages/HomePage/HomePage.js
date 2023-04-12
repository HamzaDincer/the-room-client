import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.scss';
import logo from "../../assets/TheRoom.jpeg"

function HomePage() {
  const [roomName, setRoomName] = useState('');
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  const handleJoinRoom = (e) => {
    e.preventDefault();
    if (roomName && userName) {
      navigate(`/room`);
    }
  };

  return (
    <div className="homepage">
      <div className="homepage__header">
        <img className="homepage__logo" src={logo} alt="TheRoom Logo" />
      </div>
      <form className="homepage__form" onSubmit={handleJoinRoom}>
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
    </div>
  );
}

export default HomePage;
