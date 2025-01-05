import React, { useState } from 'react';

const courses = [
  { id: 1, name: 'Math 101', teacher: 'Mr. Smith', icon: 'fa fa-calculator', groups: [] },
  { id: 2, name: 'Computer Science 201', teacher: 'Dr. Johnson', icon: 'fa fa-laptop', groups: [] },
  { id: 3, name: 'Physics 102', teacher: 'Mrs. Taylor', icon: 'fa fa-atom', groups: [] },
];

function TeacherPage() {
  const [selectedCourse, setSelectedCourse] = useState('');
  const [groupName, setGroupName] = useState('');
  const [step, setStep] = useState(1); // 1: Course selection, 2: Group creation
  const [selectedTeacher, setSelectedTeacher] = useState('Mr. Smith'); // Simulate the logged-in teacher (can be dynamic)
  
  // Handle creating a group in the selected course
  const handleCreateGroup = () => {
    if (groupName.trim() !== '') {
      const updatedCourses = courses.map(course => {
        if (course.name === selectedCourse && course.teacher === selectedTeacher) {
          // Create a group only for the teacher's course
          course.groups.push(groupName);
        }
        return course;
      });
      setStep(1); // Reset to course selection after creating group
      setGroupName('');
      // Force a re-render by updating the courses array (optional step)
      courses.splice(0, courses.length, ...updatedCourses);
    }
  };

  return (
    <div className="container py-5 bg-dark text-light">
      <div className="d-flex">
        {/* Left Sidebar (Inboxes) */}
        <div className="inboxes-sidebar bg-dark text-light p-3 rounded-left shadow-lg" style={{ width: '250px', height: '500px', overflowY: 'auto' }}>
          <h4 className="mb-4">Courses</h4>
          {step === 1 && (
            <ul className="list-group">
              {/* Display only the courses created by the logged-in teacher */}
              {courses.filter(course => course.teacher === selectedTeacher).map(course => (
                <li
                  key={course.id}
                  className={`list-group-item d-flex align-items-center justify-content-between ${selectedCourse === course.name ? 'bg-success text-light' : 'bg-dark text-light'}`}
                  onClick={() => { setSelectedCourse(course.name); setStep(2); }} // Step 2 (Group creation)
                  style={{ cursor: 'pointer', transition: 'background-color 0.3s' }}
                >
                  <i className={`${course.icon} mr-2`} style={{ fontSize: '1.5em' }}></i>
                  {course.name}
                </li>
              ))}
            </ul>
          )}
          
          {step === 2 && selectedCourse && selectedTeacher && (
            <div>
              <h5>Create a Group for {selectedCourse}</h5>
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Enter group name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />
              <button className="btn btn-success mb-3" onClick={handleCreateGroup}>Create Group</button>
            </div>
          )}
        </div>

        {/* Right Chat Area */}
        <div className="chat-area flex-grow-1 p-4 rounded-right shadow-lg" style={{
          height: '500px', 
          overflowY: 'auto', 
          background: 'rgba(255, 255, 255, 0.1)', 
          backdropFilter: 'blur(8px)', 
          borderRadius: '15px',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)',
        }}>
          {!selectedCourse && <p className="text-center">Select a course to create a group.</p>}
        </div>
      </div>
    </div>
  );
}

export default TeacherPage;
