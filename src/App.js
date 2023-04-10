import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import Peer from 'peerjs';
import useSpeechToText from 'react-hook-speech-to-text';

import './App.scss';

function App() {

  const [roomId, setRoomId] = useState(123);
  const [userId, setUserId] = useState("");
  const socketRef = useRef(null);
  const videoGridRef = useRef(null);

  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false
  });

  useEffect(() => {

    socketRef.current = io("https://1fc69763244a.ngrok.app");
    
    socketRef.current.on('room-created', (roomId) => {
      setRoomId(roomId);
    });
  
    const myPeer = new Peer();

    const videoGrid = videoGridRef.current; // Move the declaration here
  
    myPeer.on('open', (id) => {
      setUserId(id);
      if (roomId) {
        socketRef.current.emit('join-room', roomId, id);
      }
    });
  
    navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    })
    .then((stream) => {
      const myVideo = document.createElement('video');
      myVideo.classList.add('col-3');
      myVideo.muted = true;
      addVideoStream(myVideo, stream);
  
      myPeer.on('call', (call) => {
        call.answer(stream);
  
        const video = document.createElement('video');
        video.classList.add('col-3');
        video.id = call.peer;
        call.on('stream', (userVideoStream) => {
          addVideoStream(video, userVideoStream);
        });
        call.on("error", (err) => {
          console.log(err);
        });
      });
  
      socketRef.current.on('user-connected', (userId) => {
        addMessage(`New user (${userId}) connected to the room.`);
        connectToNewUser(userId, stream);
      });
  
      socketRef.current.on('user-disconnected', (userId) => {
        addMessage(`A user (${userId}) disconnected from the room.`);
        document.getElementById(userId).remove();
      });
    });
  
    function connectToNewUser(userId, stream) {
      const call = myPeer.call(userId, stream);
      const video = document.createElement('video');
      video.classList.add('col-3');
      video.id = userId;
  
      call.on('stream', (userVideoStream) => {
        addVideoStream(video, userVideoStream);
      });
  
      call.on("error", (err) => {
        console.log(err);
      });
    }
  
    function addVideoStream(video, stream) {
      video.srcObject = stream;
      video.addEventListener('loadedmetadata', () => {
        video.play()
      });
      videoGrid.append(video); // Access the videoGrid variable here
    }
  
    function addMessage(msgtxt) {
      const chatbox = document.getElementById("chatbox");
      const message = document.createElement("p");
      message.innerHTML = msgtxt;
      chatbox.append(message);
    }
  
    return () => {
      socketRef.current.disconnect();
      myPeer.disconnect();
    }
  }, []);
  

  return (
    <>
      <h1>Video Room - <span id="roomID">{roomId}</span></h1>
      <h2>User: <span id="userID">{userId}</span></h2>

      <div className="container">
        <div className="row">
          <div className="col-7">
            <div id="video-grid" className="row" ref={videoGridRef}>
            </div>
          </div>
          <div className="col-5">
            <div id="chatbox">
            </div>
          </div>
        </div>
      </div>
      <div>
      <h1>Recording: {isRecording.toString()}</h1>
      <button onClick={isRecording ? stopSpeechToText : startSpeechToText}>
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
      <ul>
        {results.map((result) => (
          <li key={result.timestamp}>{result.transcript}</li>
        ))}
        {interimResult && <li>{interimResult}</li>}
      </ul>
    </div>
    </>
  );
}

export default App;
