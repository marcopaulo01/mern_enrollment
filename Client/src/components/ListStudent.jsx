import React, { useState, useEffect } from "react";

function ListStudent() {
    const [students, setStudents] = useState([]);

    // Fetch student data when the component mounts
    useEffect(() => {
        fetchStudents();
    }, []);

    // Function to fetch student data
    const fetchStudents = async () => {
        try {
            // Perform API call to fetch student data
            const response = await fetch("http://localhost:3000/students");
            if (!response.ok) {
                throw new Error("Failed to fetch student data");
            }
            const data = await response.json();
            setStudents(data);
        } catch (error) {
            console.error("Error fetching student data:", error.message);
        }
    };

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
            <h1 className="text-2xl font-semibold mb-4">List all students</h1>
            <table className="w-full">
                <thead className="bg-gray-200">
                    <tr>
                        <th className="px-4 py-2 text-center">Student Number</th>
                        <th className="px-4 py-2 text-center">First Name</th>
                        <th className="px-4 py-2 text-center">Last Name</th>
                        <th className="px-4 py-2 text-center">Program</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map((student, index) => (
                        <tr key={index}>
                            <td className="border px-4 py-2 text-center">{student.studentNumber}</td>
                            <td className="border px-4 py-2 text-center">{student.firstName}</td>
                            <td className="border px-4 py-2 text-center">{student.lastName}</td>
                            <td className="border px-4 py-2 text-center">{student.program}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ListStudent;
