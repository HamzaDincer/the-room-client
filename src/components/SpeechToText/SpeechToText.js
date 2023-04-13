import React, { useEffect, useState } from 'react';
import useSpeechToText from 'react-hook-speech-to-text';
import './SpeechToText.scss';
import { socket } from '../../socket';

export default function SpeechToText() {
  const [text, setText] = useState('');
  const {
    error,
    interimResult,
    isRecording,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
    speechRecognitionProperties: {
      lang: 'en-US',
      interimResults: true // Allows for displaying real-time speech results
    }
  });

  useEffect(() => {
    if (interimResult && interimResult.length > 0) {
      setText(interimResult);
      console.log(interimResult);
      const latestTranscript = interimResult;
      socket.emit('caption-message', { message: latestTranscript });
    }
    socket.on('caption-message', message => {
        setText(message)
    }) 

  });

  if (error) return <p>Web Speech API is not available in this browser 🤷‍</p>;

  return (
    <div className='caption'>
      <button onClick={isRecording ? stopSpeechToText : startSpeechToText}>
        {isRecording ? 'Stop Caption' : 'Start Caption'}
      </button>
      {interimResult && <p className='caption__text'>{interimResult}</p>}
    </div>
  );
}
