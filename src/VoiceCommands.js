import React, { useEffect, useState } from "react";

const VoiceCommands = ({ onCommand }) => {
  const [listening, setListening] = useState(false);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript;
      onCommand(transcript.toLowerCase());
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };

    if (listening) {
      recognition.start();
    } else {
      recognition.stop();
    }

    return () => {
      recognition.stop();
    };
  }, [listening]);

  return (
    <div>
      <button
        onClick={() => setListening((prev) => !prev)}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg"
      >
        {listening ? "Stop Listening" : "Start Listening"}
      </button>
    </div>
  );
};

export default VoiceCommands;