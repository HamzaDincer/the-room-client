import React, { useEffect, useRef, useState } from 'react';
import useSpeechToText from 'react-hook-speech-to-text';
import './RoomPage.scss';
import VideoGrid from '../../components/VideoBox/VideoBox';
import { socket, peer } from '../../socket';


function RoomPage() {

  const [myVideoStream, setMyVideoStream] = useState(null);


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
        <h1>Room - <span id="roomID"></span></h1>
      </div>
      <div id="main">
          <div id="video-container">
            
            <VideoGrid myVideoStream={myVideoStream} />
            
            <div id="video-controls">

            </div>

          </div>

          <div id="chat-container" className="chat">
            <div id="chat-screen">
              <p>Lorem ipsum dolar sit amet</p>
            </div>
            <div id="chat-input">

            </div>
          
          </div>
      </div>
    </>
  );
}

export default RoomPage;
