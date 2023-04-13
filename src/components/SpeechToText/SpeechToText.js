import React, { useEffect, useState } from 'react';
import useSpeechToText from 'react-hook-speech-to-text';
import './SpeechToText.scss';
import { socket } from '../../socket';

export default function SpeechToText() {
  const [text, setText] = useState(' Caption Here');
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
  });

  useEffect(() => {
    if (results && results.length > 0) {
      const latestTranscript = results[results.length - 1].transcript;
      setText(latestTranscript);

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
    </div>
  );
}
