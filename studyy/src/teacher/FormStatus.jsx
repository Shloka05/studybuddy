import { useState, useEffect } from 'react';
import axios from 'axios';
import TeacherForm from './teacherForm';
import { useNavigate } from 'react-router-dom';
import { Button, Col, Container } from 'react-bootstrap';
import Teacher from './Teacher';

const FormStatus = () => {
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        const authToken = localStorage.getItem('authToken');
        const id = localStorage.getItem('id');
        if (!authToken) {
          setError('No authentication token found. Please log in.');
          setLoading(false);
          return;
        }

        const response = await axios.get(`${import.meta.env.VITE_BACKEND}/api/teachers/forms`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        console.log(response.data)

        // Search for the teacher with the matching teachId
        const matchingTeacher = response.data.find((form) => form.teachId === id);

        if (matchingTeacher) {
          setTeacher(matchingTeacher);
        }
      } catch (err) {
        setError(`Failed to fetch teacher data. Please try again later. ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-danger">{error}</div>;
  }

  // Logout Function
  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.setItem('isTeacherLoggedIn', 'false');
    navigate('/login'); // Redirect to login page
  };

  if (teacher) {
    const { formStatus } = teacher;

    if (formStatus === 6) {
      return <Teacher />;
    } else if ([0, 2, 4].includes(formStatus)) {
      // Awaiting admin approval
      return (
        <Container fluid className="relative top-80 -translate-y-52">
          <Col className='relative end-0 pb-5'>
            <Button onClick={logout}>Logout</Button>
          </Col>
          <div className="bg-warning text-center text-dark p-3">
            <h4>Your form is awaiting admin approval. Please wait.</h4>
          </div>
        </Container>
      );
    } else if ([1, 3, 5].includes(formStatus)) {
      // Form rejected
      const remainingTries = 3 - Math.floor(formStatus / 2); // Calculate remaining tries
      return (
        <div className="bg-danger text-center text-white p-3">
          <h4>Your form has been rejected.</h4>
          <p>{`You have ${remainingTries} attempt(s) left to resubmit the form.`}</p>
          <TeacherForm />
        </div>
      );
    }
  }

  // If no teacher data or formStatus is undefined
  return <TeacherForm />;
};

export default FormStatus;