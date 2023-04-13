import React, { useEffect, useRef, useState } from 'react';
import useSpeechToText from 'react-hook-speech-to-text';
import './RoomPage.scss';
import VideoGrid from '../../components/VideoBox/VideoBox';
import { socket, peer } from '../../socket';
import logo from "../../assets/TheRoom.jpeg"
import { Link, useLocation } from 'react-router-dom';

function RoomPage() {

  const [myVideoStream, setMyVideoStream] = useState(null);
  const [messages, setMessages] = useState([]);
  const [transcription, setTranscription] = useState('');
  const [isAccessGranted, setIsAccessGranted] = useState(false);

  const location = useLocation();

  let userName = 'Guest';

  if (location.state) {
    userName = location.state.userName;
  }

  const handleSend = () => {
    const message = document.getElementById("chat-input").value;
    console.log(message);
    const name = userName || "Guest";
    console.log(location.state)
    socket.emit("chat-message", { message, name });
    document.getElementById("chat-input").value = "";
    setMessages(prevMessages => [...prevMessages, { name, message }]);
  };

  useEffect(() => {
    socket.on("chat-message", data => {
      console.log(data);
      setMessages(prevMessages => [...prevMessages, data]);
    });
  }, []);

  if(!myVideoStream){
                        
    navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    }).then(stream => {
      setMyVideoStream(stream);
      setIsAccessGranted(true); // Set the flag to indicate access has been granted
      console.log("Video stream has loaded.");
    });
    
  }

  return (
    <>
      <div id="header">
        <h1>Hamza's Room <span id="roomID"></span></h1>
        <Link to='/'>
          <img className="homepage__logo" src={logo} alt="TheRoom Logo" />
        </Link>
      </div>
      <div id="main">
          <div id="video-container">
            
            <VideoGrid myVideoStream={myVideoStream} isAccessGranted={isAccessGranted} />
            
            <div id="video-controls">

            </div>

          </div>

          <div id="chat-container" className="chat">
            <div id="chat-screen">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`message-container ${
                    message.name === userName ? "message-right" : "message-left"
                  }`}
                >
                  <strong>{message.name}: </strong>
                  {message.message}
                </div>
              ))}
            </div>
            <div className='chat__input'>
              <input type="text" id="chat-input" placeholder="Type your message here" />
              <button id="send-btn" onClick={handleSend}>Send</button>
            </div>
          </div>
      </div>
    </>
  );
}

export default RoomPage;
