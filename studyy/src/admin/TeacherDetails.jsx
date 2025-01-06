import React, { useState, useEffect } from "react";
import axios from "axios";

const TeacherDetails = () => {
    const [teacher, setTeacher] = useState(null);
    const [qualificationBlob, setQualificationBlob] = useState(null);
    const [imageBlob, setImageBlob] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTeacher = async () => {
            try {
                const authToken = localStorage.getItem('authToken');
                
                if (!authToken) {
                    throw new Error("No auth token found. Please log in.");
                }

                const response = await axios.get('http://localhost:5000/api/users/teachers', {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                });

                if (response.data.length === 0) {
                    throw new Error("No teacher data found");
                }

                const teacherData = response.data[0];
                setTeacher(teacherData);

                // Directly use binary data for qualification (without Base64 decoding)
                const qualificationArray = new Uint8Array(teacherData.qualification.data.data);
                setQualificationBlob(
                    URL.createObjectURL(
                        new Blob([qualificationArray], {
                            type: teacherData.qualification.contentType,
                        })
                    )
                );

                // Directly use binary data for image (without Base64 decoding)
                const imageArray = new Uint8Array(teacherData.image.data.data);
                setImageBlob(
                    URL.createObjectURL(
                        new Blob([imageArray], {
                            type: teacherData.image.contentType,
                        })
                    )
                );
            } catch (err) {
                console.error("Error fetching teacher data:", err.message);
                setError("Failed to fetch teacher data. Please try again later.");
            }
        };

        fetchTeacher();
    }, []);

    if (error) {
        return <div>{error}</div>;
    }

    if (!teacher) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{ color: 'white', fontFamily: 'Arial, sans-serif', padding: '20px' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Teacher Profile</h1>
            
            <p>
                <strong>Sex:</strong> {teacher.sex}
            </p>
            <p>
                <strong>Age:</strong> {teacher.age}
            </p>
            <p>
                <strong>Subject:</strong> {teacher.subject}
            </p>
            <p>
                <strong>Past Experience:</strong> {teacher.pastExp}
            </p>
    
            <div style={{ marginTop: '20px' }}>
                <h2>Profile Image:</h2>
                <img 
                    src={imageBlob} 
                    alt="Teacher Profile" 
                    style={{ width: '150px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }} 
                />
            </div>
    
            <div style={{ marginTop: '20px' }}>
                <h2>Qualification Document:</h2>
                <iframe 
                    src={qualificationBlob} 
                    width="80%" 
                    height="300px" 
                    style={{ 
                        border: '1px solid #ddd', 
                        borderRadius: '8px', 
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', 
                        display: 'block', 
                        margin: '0 auto' 
                    }} 
                    title="Qualification Document Preview"
                ></iframe>
            </div>
        </div>
    );
    
};

export default TeacherDetails;
