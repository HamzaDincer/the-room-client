import React, { useEffect, useState } from 'react';
import useSpeechToText from 'react-hook-speech-to-text';
import './SpeechToText.scss'

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
      setText(results[results.length - 1].transcript);
      console.log(text);
    }
  }, [results, text]);

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
