import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import { motion } from "framer-motion";

const Leaderboard = () => {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    const fetchScores = async () => {
      const querySnapshot = await getDocs(collection(db, "scores"));
      const scoresData = querySnapshot.docs.map((doc) => doc.data());
      setScores(scoresData);
    };
    fetchScores();
  }, []);

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Leaderboard</h2>
      <motion.ul
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {scores.map((score, index) => (
          <motion.li
            key={index}
            initial={{ x: -100 }}
            animate={{ x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="text-lg mb-2"
          >
            {score.name}: {score.score}
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
};

export default Leaderboard;