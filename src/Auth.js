import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

const Auth = ({ user, setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const auth = getAuth();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleSignUp = async () => {
    const auth = getAuth();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
    } catch (error) {
      console.error("Signup error:", error);
    }
  };

  return (
    <div className="text-center mb-8">
      {user ? (
        <p>Welcome, {user.email}!</p>
      ) : (
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-2 rounded-lg mr-2"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-4 py-2 rounded-lg mr-2"
          />
          <button onClick={handleLogin} className="px-4 py-2 bg-blue-500 rounded-lg">
            Login
          </button>
          <button onClick={handleSignUp} className="px-4 py-2 bg-green-500 rounded-lg ml-2">
            Sign Up
          </button>
        </div>
      )}
    </div>
  );
};

export default Auth;