import React, { useState, useEffect } from "react";

function ManageCourse({ studentId }) {
    // State variable to manage courses
    const [courses, setCourses] = useState([]);
    const [enrolledCourses, setEnrolledCourses] = useState([]);

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

            // Filter courses to include only those where the student is enrolled
            const enrolledCourses = data.filter(course => course.students.includes(studentId));

            // Update the state variables with the fetched data
            setEnrolledCourses(enrolledCourses);
            setCourses(data);
        } catch (error) {
            // If an error occurs during fetching, log the error
            console.error("Error fetching course data:", error.message);
        }
    };

    // Function to drop a course
    const dropCourse = async (course) => {
        try {
            // Confirm with the user before dropping the course
            const confirmDrop = window.confirm("Are you sure you want to drop this course?");
            if (!confirmDrop) {
                return; // If user cancels, exit the function
            }
            // Construct the course object with the desired data
            const courseToUpdate = {
                "_id": course._id,
                "courseCode": course.courseCode,
                "courseName": course.courseName,
                "section": course.section,
                "semester": course.semester,
                // Remove the student from the course's student list
                "students": course.students.filter(id => id !== studentId)
            };

            // Send PUT request to update the course by dropping the student
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
            // Refresh course data after dropping
            fetchCourses();
        } catch (error) {
            // If an error occurs during dropping, log the error
            console.error("Error dropping the course:", error.message);
        }
    };

    const handleSectionChange = async (e, course) => {
        try {
            // Confirm with the user before changing the section
            const confirmChange = window.confirm("Are you sure you want to change sections?");
            if (!confirmChange) {
                return;
            }
            
            if (!studentId) {
                throw new Error("No student logged in");
            }
    
            const updatedCourseWithoutStudent = {
                ...course,
                students: course.students.filter(id => id !== studentId)
            };
    
            const response = await fetch(`http://localhost:3000/courses/${course._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedCourseWithoutStudent),
            });
    
            if (!response.ok) {
                throw new Error("Failed to update the course");
            }
    
            const newCourseSection = parseInt(e.target.value);
            const newCourse = courses.find(c => c.courseCode === course.courseCode && c.section === newCourseSection);
    
            if (!newCourse) {
                throw new Error("New section not found");
            }
    
            const updatedCourseWithStudent = {
                ...newCourse,
                students: [...newCourse.students, studentId]
            };
    
            const enrollmentResponse = await fetch(`http://localhost:3000/courses/${newCourse._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedCourseWithStudent),
            });
    
            if (!enrollmentResponse.ok) {
                throw new Error("Failed to enroll student in the new section");
            }
    
            fetchCourses();
            alert("You have successfully changed sections.");
        } catch (error) {
            console.error("Error changing section:", error.message);
            alert("An error occurred while changing sections. Please try again later.");
        }
    };
      
    // Function to show alternate sections of a course
    const showAlternateSections = (course, allCourses) => {
        // Function to show alternate sections of a course
        // Get all sections of the course
        const allSections = allCourses.filter(c => c.courseCode === course.courseCode);

        // Filter out the current section
        const alternateSections = allSections.filter(c => c.section !== course.section);
        
        // Return the list of alternate sections
        return alternateSections;
    };

    // Render the ManageCourse component UI
    return (
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
            <h2 className="text-xl font-semibold mb-4">Manage Course</h2>
            <table className="w-full">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="px-4 py-2">Course Code</th>
                        <th className="px-4 py-2">Course Name</th>
                        <th className="px-4 py-2">Section</th>
                        <th className="px-4 py-2">Action</th>
                        <th className="px-4 py-2">Alternate Sections</th>
                    </tr>
                </thead>
                <tbody>
                    {enrolledCourses.map(course => (
                        <tr key={course._id}>
                            <td className="border px-4 py-2">{course.courseCode}</td>
                            <td className="border px-4 py-2">{course.courseName}</td>
                            <td className="border px-4 py-2">{course.section}</td>
                            <td className="border px-4 py-2">
                                <button onClick={() => dropCourse(course)} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">Drop</button>
                            </td>
                            <td className="border px-4 py-2">
                                {showAlternateSections(course, courses).length > 0 ? (
                                    <select onChange={(e) => handleSectionChange(e, course)} className="border rounded px-2 py-1">
                                        <option value="">Select alternate section</option>
                                        {showAlternateSections(course, courses).map(section => (
                                            <option key={section._id} value={section.section}>Section {section.section}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <span>No alternate sections</span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ManageCourse;
