import React, { useState, useEffect } from 'react';

const AddStudent = () => {
    const [formData, setFormData] = useState({
        studentNumber: '',
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        address: '',
        city: '',
        phone: '',
        program: '',
        volunteer: '',
        language: ''
    });

    // State to store the highest student number
    const [highestStudentNumber, setHighestStudentNumber] = useState('');

    // Fetch the highest student number when the component mounts
    useEffect(() => {
        fetchHighestStudentNumber();
    }, []);

    const fetchHighestStudentNumber = () => {
        fetch('http://localhost:3000/students/')
            .then(response => response.json())
            .then(data => {
                // Find the highest student number from the data
                const highestStudentNumber = data.reduce((highest, student) => {
                    const currentStudentNumber = parseInt(student.studentNumber);
                    return currentStudentNumber > highest ? currentStudentNumber : highest;
                }, 0);

                // Set the highest student number + 1 as the placeholder
                setHighestStudentNumber(highestStudentNumber + 1);
                setFormData({
                    //...formData,
                    studentNumber: (highestStudentNumber + 1).toString()
                });
            })
            .catch(error => {
                console.error('Error fetching highest student number:', error);
            });
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch('http://localhost:3000/students', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Student added:', data);
            // Clear form inputs after successful submission
            fetchHighestStudentNumber();
            setFormData({
                ...formData,
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                address: '',
                city: '',
                phone: '',
                program: '',
                volunteer: '',
                language: ''
            });
        })
        .catch(error => {
            console.error('Error adding student:', error);
        });
    };    
    
    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
            <h2 className="text-2xl font-semibold mb-6">Add Student</h2>
            <form onSubmit={handleSubmit}>
                <label className="block mb-4">
                    Student Number:
                    <input type="text" name="studentNumber" placeholder={highestStudentNumber} value={formData.studentNumber} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded" disabled required />
                </label>
                <label className="block mb-4">
                    First Name:
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded" required />
                </label>
                <label className="block mb-4">
                    Last Name:
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded" required />
                </label>
                <label className="block mb-4">
                    Email:
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded" />
                </label>
                <label className="block mb-4">
                    Password:
                    <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded" />
                </label>
                <label className="block mb-4">
                    Address:
                    <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded" />
                </label>
                <label className="block mb-4">
                    City:
                    <input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded" />
                </label>
                <label className="block mb-4">
                    Phone:
                    <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded" />
                </label>
                <label className="block mb-4">
                    Program:
                    <select name="program" value={formData.program} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded" required>
                        <option value="" disabled>Select a program</option>
                        <option value="Computer Science">Computer Science</option>
                        <option value="Software Engineering">Software Engineering</option>
                        <option value="Information Technology">Information Technology</option>
                        <option value="Web Development">Web Development</option>
                    </select>
                </label>
                <label className="block mb-4">
                    Volunteer:
                    <select name="volunteer" value={formData.volunteer} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded">
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                    </select>
                </label>
                <label className="block mb-4">
                    Language:
                    <input type="text" name="language" placeholder='Python, Java' value={formData.language} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded" />
                </label>
                <button type="submit" className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded">
                    Submit
                </button>
            </form>
        </div>
    );    
};

export default AddStudent;
