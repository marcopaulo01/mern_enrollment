import React from "react";
import { Link } from "react-router-dom";

function NavBar({ loggedInUser, handleLogout }) {
  return (
    <nav className="bg-gray-800 py-4">
      <ul className="flex items-center justify-between px-8">
        <li><Link to="/" className="text-white font-bold">Home</Link></li>
        {loggedInUser === "admin" && (
          <>
            <li><Link to="/addstudent" className="text-white hover:text-gray-300 mx-8">Add Student</Link></li>
            <li><Link to="/listcourse" className="text-white hover:text-gray-300 mx-8">List Courses</Link></li>
            <li><Link to="/liststudent" className="text-white hover:text-gray-300 mx-8">List Students</Link></li>
          </>
        )}
        {loggedInUser === "student" && (
          <>
            <li><Link to="/addcourse" className="text-white hover:text-gray-300 mx-8">Add Course</Link></li>
            <li><Link to="/managecourse" className="text-white hover:text-gray-300 mx-8">Manage Course</Link></li>
          </>
        )}
        {loggedInUser ? (
          <li className="ml-auto"><button onClick={handleLogout} className="text-white font-bold hover:text-gray-300 mx-8">Logout</button></li>
        ) : (
          <li><Link to="/login" className="text-white font-bold hover:text-gray-300 mx-8">Login</Link></li>
        )}
      </ul>
    </nav>
  );
}

export default NavBar;
