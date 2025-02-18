import React, { useEffect, useRef, useState } from "react";

import * as poseDetection from "@tensorflow-models/pose-detection";
import { motion, AnimatePresence } from "framer-motion";

const CameraPoseDetector = ({ onClose }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [model, setModel] = useState(null);
  const [count, setCount] = useState(0);
  const [feedback, setFeedback] = useState("Get ready to flex!");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadModel = async () => {
      setIsLoading(true);
      try {
        const detector = await poseDetection.createDetector(
          poseDetection.SupportedModels.MoveNet,
          { modelType: "SinglePose.Lightning" }
        );
        setModel(detector);
      } catch (error) {
        console.error("Error loading model:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadModel();
    startCamera();
  }, []);



  const startCamera = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (!stream) {
          throw new Error("Camera stream not available.");
        }
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
          detectPose();
        };
      } catch (error) {
        console.error("Error accessing camera:", error);
        setFeedback("Failed to access camera. Please allow camera permissions.");
      }
    } else {
      console.error("getUserMedia not supported in this browser.");
      setFeedback("Camera access is not supported in this browser.");
    }
  };
  

  const detectPose = async () => {
    if (!model) return;

    const ctx = canvasRef.current.getContext("2d");
    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;

    let lastPose = null;
    let repCount = 0;

    const detect = async () => {
      const poses = await model.estimatePoses(videoRef.current);
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);

      if (poses.length > 0) {
        drawKeypoints(poses, ctx);

        const knee = poses[0].keypoints.find(kp => kp.name === "left_knee");
        if (knee && knee.score > 0.5) {
          if (lastPose && knee.y > lastPose.y + 10) {
            repCount++;
            setCount(repCount);
            setFeedback("Perfect form! 🔥");
          } else {
            setFeedback("Lower your hips! ⬇️");
          }
          lastPose = knee;
        }
      }

      requestAnimationFrame(detect);
    };
    detect();
  };

  const drawKeypoints = (poses, ctx) => {
    if (poses.length > 0) {
      poses[0].keypoints.forEach((keypoint) => {
        if (keypoint.score > 0.5) {
          ctx.beginPath();
          ctx.arc(keypoint.x, keypoint.y, 5, 0, 2 * Math.PI);
          ctx.fillStyle = "#ff4757";
          ctx.fill();
        }
      });
    }
  };

  return (
    <div className="relative max-w-4xl mx-auto">
      {/* Close Button */}
      <motion.button
        onClick={onClose}
        className="absolute top-4 right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        ✕
      </motion.button>

      {/* Loading Overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center rounded-2xl"
          >
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="text-4xl mb-4"
              >
                ⏳
              </motion.div>
              <p className="text-xl">Initializing AI Engine...</p>
              <p className="text-sm text-gray-400 mt-2">This might take a few seconds</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-white/10">
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-lg bg-white/5">
                🏃
              </div>
              <div>
                <h2 className="text-xl font-semibold">AI Workout Session</h2>
                <p className="text-sm text-gray-400">Real-time exercise tracking</p>
              </div>
            </div>
            <div className="bg-white/5 px-4 py-2 rounded-lg">
              <span className="text-sm text-gray-400">Current Exercise:</span>
              <span className="ml-2 font-semibold">Squats</span>
            </div>
          </div>
        </div>

{/* Camera Preview */}
<div className="relative aspect-video bg-black rounded-b-2xl overflow-hidden">
  <div className="relative w-full h-full">
    <video
      ref={videoRef}
      className="w-full h-full object-cover absolute inset-0"
      autoPlay
      playsInline
    />
    <canvas ref={canvasRef} className="w-full h-full absolute inset-0" />
  </div>

  {/* Overlay Elements */}
  <div className="absolute top-4 left-4 bg-black/50 px-4 py-2 rounded-lg">
    <span className="text-green-400">● LIVE</span>
  </div>
  <div className="absolute bottom-4 left-4 bg-black/50 px-4 py-2 rounded-lg">
    <span className="text-sm">AI Confidence: 98%</span>
  </div>
</div>


        {/* Stats Footer */}
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">{count}</div>
              <div className="text-sm text-gray-400">Total Reps</div>
            </div>
            <div className="h-12 w-px bg-white/10" />
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-400">A+</div>
              <div className="text-sm text-gray-400">Form Grade</div>
            </div>
          </div>

          <motion.div
            className="flex items-center space-x-3 bg-white/5 px-6 py-3 rounded-xl"
            animate={{ x: [-5, 5, -5] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <span className="font-semibold">{feedback}</span>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CameraPoseDetector;
