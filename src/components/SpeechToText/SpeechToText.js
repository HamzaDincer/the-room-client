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
    results,
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
    if (results && results.length > 0) {
      const latestTranscript = results[results.length - 1].transcript;
      setText(latestTranscript);
      console.log(interimResult);

      socket.emit('caption-message', { message: latestTranscript });
    }
    socket.on('caption-message', message => {
        setText(message)
    }) 

  }, [results]);

  if (error) return <p>Web Speech API is not available in this browser 🤷‍</p>;

  return (
    <div className='caption'>
      <button onClick={isRecording ? stopSpeechToText : startSpeechToText}>
        {isRecording ? 'Stop Caption' : 'Start Caption'}
      </button>
      <p className='caption__text'>{text}</p>
      {interimResult && <p className='caption__text'>{interimResult}</p>}
    </div>
  );
}
