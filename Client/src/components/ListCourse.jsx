import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';

function ListCourse() {
    const [courses, setCourses] = useState([]);

    // Fetch course data when the component mounts
    useEffect(() => {
        fetchCourses();
    }, []);

    // Function to fetch course data
    const fetchCourses = async () => {
        try {
            // Perform API call to fetch course data
            const response = await fetch("http://localhost:3000/courses");
            if (!response.ok) {
                throw new Error("Failed to fetch course data");
            }
            const data = await response.json();
            setCourses(data);
        } catch (error) {
            console.error("Error fetching course data:", error.message);
        }
    };

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
            <h1 className="text-2xl font-semibold mb-6">List all courses</h1>
            <table className="w-full">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="px-4 py-2">Course Code</th>
                        <th className="px-4 py-2">Course Name</th>
                        <th className="px-4 py-2">Section</th>
                        <th className="px-4 py-2">Semester</th>
                        <th className="px-4 py-2">Students Enrolled</th>
                        <th className="px-4 py-2"></th>
                    </tr>
                </thead>
                <tbody>
                    {courses.map((course, index) => (
                        <tr key={index}>
                            <td className="border px-4 py-2">{course.courseCode}</td>
                            <td className="border px-4 py-2">{course.courseName}</td>
                            <td className="border px-4 py-2 text-center">{course.section}</td>
                            <td className="border px-4 py-2">{course.semester}</td>
                            <td className="border px-4 py-2 text-center">{course.students.length}</td>
                            <td className="border px-4 py-2">
                                <Link to={`/course/${course._id}`}>
                                <button className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded">View Details</button>
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ListCourse;
