import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (username === "admin" && password === "a") {
      onLogin("admin");
      navigate('/');
    } else {
      fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ studentNumber: username, password }),
      })
      .then((res) => {
        if (res.ok) {
          return res.text(); // Parse response as text
        } else {
          throw new Error('Network response was not ok');
        }
      })
      .then((data) => {
        data = JSON.parse(data);
        if (data.success === true) {
          onLogin("student", data.studentId);
          navigate('/');
        } else {
          alert(data); // Display the error message sent from the server
        }
      })
      .catch((error) => {
        console.error('There was a problem with the fetch operation:', error);
        alert('Error during login. Please try again.');
      });
    }
  };
  
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h2 className="text-2xl font-semibold mb-6">Login</h2>
      <input 
        type="text" 
        placeholder="Student ID" 
        className="w-full mb-4 p-2 border border-gray-300 rounded"
        value={username} 
        onChange={(e) => setUsername(e.target.value)} 
      />
      <input 
        type="password" 
        placeholder="Password" 
        className="w-full mb-4 p-2 border border-gray-300 rounded"
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
      />
      <button 
        onClick={handleLogin} 
        className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded"
      >
        Login
      </button>
    </div>
  );
}

export default Login;
