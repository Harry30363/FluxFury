import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const VoiceCommands = ({ onCommand }) => {
  const [listening, setListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.error("Speech Recognition API not supported in this browser.");
      setIsSupported(false);
      return;
    }

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
  }, [listening, onCommand]);

  return (
    <div>
      {!isSupported ? (
        <p className="text-red-500">Speech Recognition not supported in this browser.</p>
      ) : (
        <motion.div
          animate={{ scale: listening ? 1.2 : 1 }}
          transition={{ duration: 0.3 }}
        >
          <button
            onClick={() => setListening((prev) => !prev)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            {listening ? "🎤 Listening..." : "🎤 Start Listening"}
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default VoiceCommands;