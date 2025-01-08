import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CourseChat from './CourseChat';
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

  const handleSearch = () => {
    // This is called when the Search button is clicked
    const filtered = courses.filter((course) =>
      course.courseName.toLowerCase().includes(query.toLowerCase())
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

            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND}/api/teachers/courses/register`,
                courseDataToSubmit, 
                {
                  headers: {
                    Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NzkxNzE2YWUyZjIzMDc2ZjMzYmM1NCIsInJvbGUiOiJ0ZWFjaGVyIiwiaWF0IjoxNzM2MzE2MTcyLCJleHAiOjE3MzY0MDI1NzJ9.1wc8FVLy6kcdikRjDqOGNklU0swb9ouLB8lAOEGIYpA',
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
    setSelectedCourse(course);
  };

  if (!isTeacherLoggedIn) {
    return <div>You do not have access to this page.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white d-flex">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-800 p-6">
        <h2 className="text-2xl mb-4">Dashboard</h2>
        
        <div style={{ margin: '20px', textAlign: 'center' }}>
          <div className="search-bar flex flex-wrap justify-center sm:justify-start my-4">
            <input
              type="text"
              placeholder="Search for courses..."
              value={query}
              onChange={handleInputChange}
              className="w-full sm:w-64 md:w-80 lg:w-96 px-4 py-2 text-lg text-black border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSearch}
              className="w-full sm:w-auto px-4 py-2 text-lg font-semibold text-white bg-blue-500 hover:bg-blue-600 rounded-r-lg sm:rounded-l-none transition-colors duration-200"
            >
              Search
            </button>
          </div>
          <button
            className="btn btn-primary w-100 mb-4"
            onClick={() => setShowModal(true)}
          >
            Add Course
          </button>
        </div>

        <h3 className="text-lg font-semibold mb-2">Your Courses</h3>
        <ul className="list-group">
          {filteredCourses.map((course, index) => (
            <li
              key={index}
              className="list-group-item bg-gray-700 text-black cursor-pointer"
              onClick={() => handleCourseClick(course)}
            >
              {course.courseName} - {course.category}
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content - Chat */}
      <div className="flex-1 p-6 bg-gray-800">
        {selectedCourse ? (
          <div>
            <h2 className="text-2xl mb-4">Chat for {selectedCourse.courseName}</h2>
            <div className="bg-gray-700 p-4 rounded-lg shadow-lg">
              <p className="text-sm text-gray-300">Chat with your course members here...</p>
              <CourseChat/>
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
