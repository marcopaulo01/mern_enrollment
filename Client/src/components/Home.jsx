import React from "react";

function Home() {
    return (
        <div className="bg-gradient-to-b from-teal-50 to-teal-100 min-h-screen flex flex-col items-center justify-center p-6">
            <h1 className="text-4xl font-bold text-center text-teal-800 mb-8">Comp 308 Emerging Technologies Assignment 1</h1>
            <p>Assignment 1 entails developing a student/course system using the MERN stack. It includes creating an Express REST 
                API with CRUD functionalities for managing student and course data, implementing authentication with JWT, and 
                building a React front-end with features such as login, course management for students, and student/course listing 
                for admins, all following MVC architecture principles.
            </p> <br></br>
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Student Feature</h2>
                <ul className="list-disc pl-4">
                    <li>Add a course</li>
                    <li>Update a course (e.g., change section)</li>
                    <li>Drop a course</li>
                    <li>List all courses taken by student</li>
                </ul>
            </div>
            <div>
                <h2 className="text-xl font-semibold mb-4">Admin Feature</h2>
                <ul className="list-disc pl-4">
                    <li>Add a student</li>
                    <li>List all students</li>
                    <li>List all courses</li>
                    <li>List all students taking a specific course</li>
                </ul>
            </div>
        </div>
    );
}

export default Home;
