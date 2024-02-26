import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function CoursePage() {
    const { courseId } = useParams();
    const [course, setCourse] = useState(null);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourseAndStudents = async () => {
            try {
                // Fetch course details and students concurrently
                const [courseResponse, studentsResponse] = await Promise.all([
                    axios.get(`http://localhost:3000/courses/${courseId}`),
                    axios.get(`http://localhost:3000/students/`)
                ]);

                setCourse(courseResponse.data);
                setStudents(studentsResponse.data);
            } catch (error) {
                console.error('Error fetching course and students:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourseAndStudents();
    }, [courseId]);

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
            {loading ? (
                <p>Loading course details...</p>
            ) : (
                <div>
                    <h1 className="text-2xl font-semibold mb-2">{course.courseName}</h1>
                    <p>Course Code: {course.courseCode}</p>
                    <p>Section: {course.section}</p>
                    <p>Semester: {course.semester}</p>

                    <h2 className="text-xl font-semibold mt-4 mb-2">Students Enrolled</h2>
                    <table className="w-full">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="px-4 py-2">Student ID</th>
                                <th className="px-4 py-2">Name</th>
                                <th className="px-4 py-2">Program</th>
                            </tr>
                        </thead>
                        <tbody>
                            {course.students.map(studentId => {
                                const student = students.find(student => student._id === studentId);
                                return (
                                    <tr key={studentId} className="border-b">
                                        <td className="px-4 py-2 text-center">{student ? student.studentNumber : 'N/A'}</td>
                                        <td className="px-4 py-2">{student ? student.fullName : 'N/A'}</td>
                                        <td className="px-4 py-2">{student ? student.program : 'N/A'}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default CoursePage;
