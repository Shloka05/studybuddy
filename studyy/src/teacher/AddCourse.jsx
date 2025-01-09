import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CourseChat from './CourseChat';
import { Modal, Button, Form, InputGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

function AddCourse() {
  const [courseName, setCourseName] = useState('');
  const [category, setCategory] = useState('');
  const [isTeacherLoggedIn, setIsTeacherLoggedIn] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [courses, setCourses] = useState([]);
  const [query, setQuery] = useState('');
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [courseData, setCourseData] = useState({
    courseName: '',
    category: '', 
    teacherCourseId: ''
  });

  const handleInputChangeforCourse = (e) => {
    const { name, value } = e.target;
    setCourseData({ ...courseData, [name]: value });
  };

  const handleInputChange = (event) => {
    const input = event.target.value;
    setQuery(input);

    // Filter courses based on query
    const filtered = courses.filter((course) =>
      course.courseName.toLowerCase().includes(input.toLowerCase())
    );
    setFilteredCourses(filtered);
  };



  useEffect(() => {
    const savedStatus = localStorage.getItem('isTeacherLoggedIn');
    if (savedStatus === 'true') {
      setIsTeacherLoggedIn(true);
    } else {
      setIsTeacherLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const teachId = localStorage.getItem("id");
        const authToken = localStorage.getItem("authToken");
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND}/api/teachers/${teachId}/courses`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        console.log(response.data);
        setCourses(response.data.course); // Set initial messages
      } catch (error) {
        console.error('Error fetching courses:', error.response?.data || error.message);
      }
    };

    fetchCourses();
  }, []);


  useEffect(() => {
    // Initially set filteredCourses to all courses
    setFilteredCourses(courses);
  }, [courses]);

  const handleSubmit = async (e) => 
    {
        e.preventDefault();
        try
        {
            if (courseData.courseName && courseData.category) {
            const newCourse = { ...courseData };
            setCourses([...courses, newCourse]);
            setCourseData({
                courseName: '',
                category: '',
                teacherCourseId: ''
            });
            setShowModal(false);
            console.log('Course data: ', courseData)
            const courseDataToSubmit = {
                courseName: newCourse.courseName,
                category: newCourse.category,
                teacherCourseId: newCourse.teacherCourseId
            };

            
            const authToken = localStorage.getItem("authToken");

            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND}/api/teachers/courses/register`,
                courseDataToSubmit, 
                {
                  headers: {
                    Authorization: `Bearer ${authToken}`,
                  },
                }
            );
            console.log('Course added successfully:', response.data);
            } 
        }
        catch (err) {
        console.error('Error adding teacher:', err.response || err);
        setError('Failed to submit the form. Please check your inputs.');
        }
        
  };

  const handleCourseClick = (course) => {
    console.log(course.chatId);
    setSelectedCourse(course);
  };

  if (!isTeacherLoggedIn) {
    return <div>You do not have access to this page.</div>;
  }

  return (
    <div className="min-h-screen text-white d-flex">
      {/* Sidebar */}
      <div className="sidebar border-e-2 p-3" style={{ width: '30%' }}>
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
          <Button variant="primary" onClick={() => setFilteredCourses(courses)}>
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

      {/* Main Content - Chat */}
      <div className="flex-1 p-6">
        {selectedCourse ? (
          <div>
            <div className="bg-dark p-4 rounded-lg shadow-lg">
              <h2 className="text-2xl mb-4">Chat for {selectedCourse.courseName}</h2>
              <CourseChat chatId={selectedCourse.chatId}/>
              {/* Add chat functionality here */}
            </div>
          </div>
        ) : (
          <p className="text-lg text-center">Select a course to start chatting.</p>
        )}
      </div>

      {/* Modal for Adding Course */}
      <div
        className={`modal fade ${showModal ? 'show' : ''}`}
        tabIndex="-1"
        style={{ display: showModal ? 'block' : 'none' }}
        aria-hidden={!showModal}
      >
        <div className="modal-dialog">
          <div className="modal-content text-white" style={{ backgroundColor: '#3c3c3c' }}>
            <div className="modal-header">
              <h5 className="modal-title">Add New Course</h5>
              <button
                type="button"
                className="btn-close text-black"
                onClick={() => setShowModal(false)}
                aria-label="Close"
              />
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="courseName" className="form-label">
                    Course Name
                  </label>
                  <input
                    id="courseName"
                    type="text"
                    name="courseName"
                    value={courseData.courseName}
                    onChange={handleInputChangeforCourse}
                    className="form-control bg-gray-700 text-black"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="category" className="form-label">
                    Category
                  </label>
                  <input
                    id="category"
                    type="text"
                    name="category"
                    value={courseData.category}
                    onChange={handleInputChangeforCourse}
                    className="form-control bg-gray-700 text-black"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                >
                  Add Course
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddCourse;
