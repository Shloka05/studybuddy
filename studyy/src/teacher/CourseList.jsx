import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form, InputGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

function CourseList() {
  const [isTeacherLoggedIn, setIsTeacherLoggedIn] = useState(false);
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [query, setQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [courseData, setCourseData] = useState({
    courseName: '',
    category: '',
    teacherCourseId: ''
  });

  // Handle search input changes
  const handleInputChange = (event) => {
    const input = event.target.value;
    setQuery(input);
    const filtered = courses.filter((course) =>
      course.courseName.toLowerCase().includes(input.toLowerCase())
    );
    setFilteredCourses(filtered);
  };

  // Handle modal form input changes
  const handleInputChangeforCourse = (e) => {
    const { name, value } = e.target;
    setCourseData({ ...courseData, [name]: value });
  };

  // Handle course submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (courseData.courseName && courseData.category) {
        const newCourse = { ...courseData };
        setCourses([...courses, newCourse]);
        setCourseData({ courseName: '', category: '', teacherCourseId: '' });
        setShowModal(false);

        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND}/api/teachers/courses/register`,
          newCourse
        );
        console.log('Course added successfully:', response.data);
      }
    } catch (err) {
      console.error('Error adding course:', err);
    }
  };
  
  useEffect(() => {
    const savedStatus = localStorage.getItem('isTeacherLoggedIn');
    setIsTeacherLoggedIn(savedStatus === 'true');
  }, []);

  // Update filtered courses when the courses list changes
  useEffect(() => {
    setFilteredCourses(courses);
  }, [courses]);

  const handleCourseClick = (course) => {
    setSelectedCourse(course);
  };

  if (!isTeacherLoggedIn) {
    return <div>You do not have access to this page.</div>;
  }

  return (
    <div className="min-h-screen d-flex">
      {/* Sidebar */}
      <div className="sidebar border-e-2 p-3" style={{ width: '25%' }}>
        <Button
          variant="success"
          className="w-100 mb-3"
          onClick={() => setShowModal(true)}
        >
          Add Course
        </Button>
        <InputGroup className="mb-3">
          <Form.Control
            type="text"
            placeholder="Search for courses..."
            value={query}
            onChange={handleInputChange}
          />
          <Button variant="outline-secondary" onClick={() => setFilteredCourses(courses)}>
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </Button>
        </InputGroup>
        <h5>Your Community</h5>
        <ul className="list-unstyled">
          {filteredCourses.map((course, index) => (
            <li
              key={index}
              className="p-2 border-bottom cursor-pointer"
              style={{ cursor: 'pointer' }}
              onClick={() => handleCourseClick(course)}
            >
              {course.courseName} - {course.category}
            </li>
          ))}
        </ul>
      </div>
      <hr />
      {/* Main Content */}
      <div className="flex-grow-1 p-3">
        {selectedCourse ? (
          <div>
            <h2>Chat for {selectedCourse.courseName}</h2>
            <div className="border p-3">
              <p>Chat with your community members here...</p>
              {/* Add chat functionality here */}
            </div>
          </div>
        ) : (
          <p>Select a community to start chatting.</p>
        )}
      </div>

      {/* Add Course Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header style={{ backgroundColor:'#222', color:'#ccc' }} closeButton>
          <Modal.Title>Add New Course</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor:'#222', color:'#ccc' }}>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Course Name</Form.Label>
              <Form.Control
                type="text"
                name="courseName"
                value={courseData.courseName}
                onChange={handleInputChangeforCourse}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                name="category"
                value={courseData.category}
                onChange={handleInputChangeforCourse}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">
              Add Course
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default CourseList;