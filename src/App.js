import React, { useEffect, useRef, useState } from 'react';
import useSpeechToText from 'react-hook-speech-to-text';
import './App.scss';
import VideoGrid from './components/VideoBox';
import { socket, peer } from './socket';


function App() {

  const [myVideoStream, setMyVideoStream] = useState(null);

  // useEffect(() => {

  //   async function enableStream() {
  //     try{
  //       navigator.mediaDevices.getUserMedia({
  //           video: true,
  //           audio: true
  //       }).then(stream => {
  //         setMyVideoStream(stream);
  //         console.log("Log: your Video Stream has loaded.");
  //       });
  //     }catch(err){
  //       console.log("Error: " + err);
  //     }
  //   }

  //   if (!myVideoStream) {
  //     enableStream();
  //   }else{
  //     console.log("Log: your Video Stream not loaded.");
  //   }


  // }, []);


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
        <h2>User: <span id="userID"></span></h2>
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

export default App;
