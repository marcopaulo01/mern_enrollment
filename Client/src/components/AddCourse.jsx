import React, { useState, useEffect } from "react";

// Define AddCourse component
const AddCourse = ({ studentId }) => {
    // State variable to manage courses
    const [courses, setCourses] = useState([]); // State for storing courses

    // Function to fetch course data when the component mounts
    useEffect(() => {
        fetchCourses();
    }, []);

    // Function to fetch course data from the API
    const fetchCourses = async () => {
        try {
            // Perform API call to fetch course data
            const response = await fetch("http://localhost:3000/courses");
            if (!response.ok) {
                // If response is not OK, throw an error
                throw new Error("Failed to fetch course data");
            }
            // If response is OK, parse the JSON response
            const data = await response.json();

            // Preprocess courses data to mark courses as already enrolled
            const updatedCourses = data.map(course => {
                // Check if the student is already enrolled in at least one course with the same course code
                const isEnrolled = course.students.includes(studentId) ||
                                data.some(c => c.courseCode === course.courseCode && c.students.includes(studentId));
                return { ...course, isEnrolled };
            });

            // Update the courses state with the preprocessed data
            setCourses(updatedCourses);
        } catch (error) {
            // If an error occurs during fetching, log the error
            console.error("Error fetching course data:", error.message);
        }
    };

    // Function to enroll in a course
    const enrollInCourse = async (course) => {
        try {
            // Confirm with the user before adding the course
            const confirmEnrollment = window.confirm("Are you sure you want to enroll this course?");
            if (!confirmEnrollment) {
                return; // If user cancels, exit the function
            }
            // Check if a student is logged in (studentId is not null)
            if (studentId) {
                // Construct the course object with the desired data
                const courseToUpdate = {
                    "_id": course._id,
                    "courseCode": course.courseCode,
                    "courseName": course.courseName,
                    "section": course.section,
                    "semester": course.semester,
                    "students": [...course.students, studentId]
                };

                // Send PUT request to update the course with the enrolled student
                const response = await fetch(`http://localhost:3000/courses/${course._id}`, {
                    method: 'PUT', // Use PUT method
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(courseToUpdate), // Send the updated course object as JSON
                });

                // Check if the PUT request is successful
                if (!response.ok) {
                    // If PUT request fails, throw an error
                    throw new Error("Failed to update the course");
                }
                // Refresh course data after enrollment
                fetchCourses();
            } else {
                // If no student is logged in, log an error
                console.error("No student logged in");
                // You can handle this case by showing a message to the user
            }
        } catch (error) {
            // If an error occurs during enrollment, log the error
            console.error("Error updating the course:", error.message);
        }
    };

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
            <h1 className="text-2xl font-semibold mb-4">List of Courses</h1>
            <table className="w-full">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="px-4 py-2 text-center">Course Code</th>
                        <th className="px-4 py-2 text-center">Course Name</th>
                        <th className="px-4 py-2 text-center">Section</th>
                        <th className="px-4 py-2 text-center">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {courses.map((course, index) => (
                        <tr key={index}>
                            <td className="border px-4 py-2 text-center">{course.courseCode}</td>
                            <td className="border px-4 py-2 text-center">{course.courseName}</td>
                            <td className="border px-4 py-2 text-center">{course.section}</td>
                            <td className="border px-4 py-2 text-center">
                                {course.isEnrolled ? (
                                    <span className="text-gray-500">Already Enrolled</span>
                                ) : (
                                    <button onClick={() => enrollInCourse(course)} className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded">Enroll</button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AddCourse;
