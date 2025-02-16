import React, { useState } from "react";
import CameraPoseDetector from "./CameraPoseDetector";
import { motion, AnimatePresence } from "framer-motion";
import Leaderboard from "./Leaderboard";
import VoiceCommands from "./VoiceCommands";

function App() {
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [exerciseType, setExerciseType] = useState("squats"); // Default exercise
  const [feedback, setFeedback] = useState("Get ready to flex!"); // Feedback for the user

  // Handle voice commands
  const handleCommand = (command) => {
    if (command.includes("start squats")) {
      setExerciseType("squats");
      setFeedback("Starting squats! Get ready!");
    } else if (command.includes("next exercise")) {
      setExerciseType("push-ups");
      setFeedback("Next exercise: Push-ups!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white relative overflow-hidden">
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <motion.header
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-pink-500">
            FLEX-IT-OUT
          </h1>
          <p className="text-xl md:text-2xl font-light text-gray-300">
            AI-Powered Fitness Revolution
          </p>
        </motion.header>

        {/* Voice Commands */}
        <VoiceCommands onCommand={handleCommand} />

        {/* Camera and Workout */}
        {!cameraEnabled ? (
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex flex-col items-center"
            >
              <motion.button
                onClick={() => setCameraEnabled(true)}
                className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-500 rounded-2xl text-xl font-semibold flex items-center space-x-3 shadow-2xl hover:shadow-lg transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>🎥 Start AI Session</span>
              </motion.button>
            </motion.div>
          </div>
        ) : (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <CameraPoseDetector
                onClose={() => setCameraEnabled(false)}
                exerciseType={exerciseType}
                feedback={feedback}
                setFeedback={setFeedback}
              />
            </motion.div>
          </AnimatePresence>
        )}

        {/* Leaderboard */}
        <Leaderboard />
      </div>
    </div>
  );
}

export default App;