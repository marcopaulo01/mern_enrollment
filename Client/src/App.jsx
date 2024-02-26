import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./components/Home";
import AddStudent from "./components/AddStudent";
import ListCourse from "./components/ListCourse";
import ListStudent from "./components/ListStudent";
import CoursePage from "./components/CoursePage";
import AddCourse from "./components/AddCourse";
import Login from "./components/Login"; 
import ManageCourse from "./components/ManageCourse";

function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [studentId, setStudentId] = useState(null);

  //check if a token is stored in local storage
  useEffect(() => {
    // Retrieve the token from local storage
    const token = localStorage.getItem('token');
  
    if (token) {
      // Token found, set the logged-in user state to "student"
      setLoggedInUser("student");
    }
  }, []);
  

  const handleLogin = (userType, id = null) => {
    setLoggedInUser(userType);
    // If the user is a student and a student ID is provided, set the studentId state
    if (userType === "student" && id) {
      setStudentId(id);
    }
  };

  const handleLogout = () => {
    alert('You have been logged out');
    setLoggedInUser(null);
    setStudentId(null);
  };

  return (
    <Router>
      <NavBar loggedInUser={loggedInUser} handleLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        {loggedInUser === "admin" ? (
          <>
            <Route path="/addstudent" element={<AddStudent />} />
            <Route path="/listcourse" element={<ListCourse />} />
            <Route path="/liststudent" element={<ListStudent />} />
            <Route path="/course/:courseId" element={<CoursePage />} />
          </>
        ) : loggedInUser === "student" ? (
          <>
            <Route path="/addcourse" element={<AddCourse studentId={loggedInUser === "student" ? studentId : null} />} />
            <Route path="/managecourse" element={<ManageCourse studentId={loggedInUser === "student" ? studentId : null} />} />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;
