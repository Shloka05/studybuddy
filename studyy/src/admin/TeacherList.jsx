import { useState, useEffect } from "react";
import { Container, Table } from 'react-bootstrap'
import axios from "axios";

const TeacherList = () => {
  const [teachers, setTeachers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const authToken = localStorage.getItem("authToken");

        if (!authToken) {
          throw new Error("No auth token found. Please log in.");
        }

        const teacherName = await axios.get(`${import.meta.env.VITE_BACKEND}/api/users/`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        const teacherInfo = await axios.get(`${import.meta.env.VITE_BACKEND}/api/users/teachers`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (teacherInfo.data.length === 0) {
          throw new Error("No teacher data found");
        }

        setTeachers(teacherInfo.data);
      } catch (err) {
        console.error("Error fetching teacher data:", err.message);
        setError("Failed to fetch teacher data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchTeachers();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }


  return (
    <Container className="my-6">
      <Table variant="dark" striped bordered hover>
        <thead>
          <tr className="text-center">
            <th>Sr. No.</th>
            <th>Teacher Name</th>
            <th>Subject</th>
            <th>Status</th>
            <th>View</th>
          </tr>
        </thead>
        <tbody>
          {teachers.map((teacher, index) => (
            <tr key={index}>
              <td>{index+1}.</td>
              <td>{teacher.name}</td>
              <td>{teacher.subject}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  )
}

export default TeacherList
