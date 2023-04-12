import React, { useEffect, useRef, useState } from 'react';
import useSpeechToText from 'react-hook-speech-to-text';
import './RoomPage.scss';
import VideoGrid from '../../components/VideoBox/VideoBox';
import { socket, peer } from '../../socket';
import logo from "../../assets/TheRoom.jpeg"
import {Link} from 'react-router-dom'



function RoomPage() {

  const [myVideoStream, setMyVideoStream] = useState(null);
  const [messages, setMessages] = useState([]);
  

  const handleSend = () => {
    const message = document.getElementById("chat-input").value;
    console.log(message);
    const name = "John";
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
            
            <VideoGrid myVideoStream={myVideoStream} />
            
            <div id="video-controls">

            </div>

          </div>

          <div id="chat-container" className="chat">
          <div id="chat-screen">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`message-container ${
                  message.name === "John" ? "message-right" : "message-left"
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
