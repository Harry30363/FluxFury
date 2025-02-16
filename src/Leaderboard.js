import React, { useEffect, useState } from "react";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "./firebase";

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

  const addScore = async (name, score) => {
    await addDoc(collection(db, "scores"), { name, score });
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Leaderboard</h2>
      <ul>
        {scores.map((score, index) => (
          <li key={index} className="text-lg">
            {score.name}: {score.score}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Leaderboard;