import { useState } from 'react';


const courses = [
  { id: 1, name: 'Math 101', teacher: 'Mr. Smith', icon: 'fa fa-calculator', groups: [{ name: 'Integration Group', messages: [] }, { name: 'Differentiation Group', messages: [] }] },
  { id: 2, name: 'Computer Science 201', teacher: 'Dr. Johnson', icon: 'fa fa-laptop', groups: [{ name: 'Binary Trees Group', messages: [] }, { name: 'Data Structures Group', messages: [] }] },
  { id: 3, name: 'Physics 102', teacher: 'Mrs. Taylor', icon: 'fa fa-atom', groups: [{ name: 'Motion Group', messages: [] }, { name: 'Forces Group', messages: [] }] },
];

function StudentCommunity() {
  const [selectedCourse, setSelectedCourse] = useState('');
  const [searchGroup, setSearchGroup] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [step, setStep] = useState(1); // 1: Course selection, 2: Group search/join
  const [newMessage, setNewMessage] = useState('');

  // Handle entering a new message (doubt)
  const handleDoubtSubmit = () => {
    if (newMessage.trim() !== '') {
      const updatedCourses = courses.map(course => {
        if (course.name === selectedCourse) {
          // Find the selected group and add the new message
          course.groups.forEach(group => {
            if (group.name === selectedGroup) {
              group.messages.push({ student: 'Anonymous', doubt: newMessage });
            }
          });
        }
        return course;
      });
      setNewMessage('');
    //   setSearchGroup('');
    //   setSelectedGroup('');
      // Force re-render by updating courses
      courses.splice(0, courses.length, ...updatedCourses);
    }
  };

  // Handle searching for a group
  const handleGroupSearch = (e) => {
    setSearchGroup(e.target.value);
  };

  return (
    <div className="container py-5 bg-dark text-light">
      <div className="d-flex">
        {/* Left Sidebar (Inboxes) */}
        <div className="inboxes-sidebar bg-dark text-light p-3 rounded-left shadow-lg" style={{ width: '250px', height: '500px', overflowY: 'auto' }}>
          <h4 className="mb-4">Courses</h4>
          {step === 1 && (
            <ul className="list-group">
              {courses.map(course => (
                <li
                  key={course.id}
                  className={`list-group-item d-flex align-items-center justify-content-between ${selectedCourse === course.name ? 'bg-success text-light' : 'bg-dark text-light'}`}
                  onClick={() => { setSelectedCourse(course.name); setStep(2); }} // Step 2 (Group search)
                  style={{ cursor: 'pointer', transition: 'background-color 0.3s' }}
                >
                  <i className={`${course.icon} mr-2`} style={{ fontSize: '1.5em' }}></i>
                  {course.name}
                </li>
              ))}
            </ul>
          )}
          
          {step === 2 && selectedCourse && (
            <div>
              <h5>Search Groups for {selectedCourse}</h5>
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Search for a group..."
                value={searchGroup}
                onChange={handleGroupSearch}
              />
              <ul className="list-group mt-3">
                {courses.find(course => course.name === selectedCourse)?.groups.filter(group => group.name.toLowerCase().includes(searchGroup.toLowerCase())).map(group => (
                  <li
                    key={group.name}
                    className={`list-group-item ${selectedGroup === group.name ? 'bg-success text-light' : 'bg-dark text-light'}`}
                    onClick={() => setSelectedGroup(group.name)} // Move to group joined step
                    style={{ cursor: 'pointer' }}
                  >
                    {group.name}
                  </li>
                ))}
              </ul>
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
          {step === 2 && selectedCourse && selectedGroup && (
            <>
              <h3 className="mb-4 text-center">Doubts for {selectedCourse} - {selectedGroup}</h3>
              <div className="chat-messages mb-4" style={{ height: '350px', overflowY: 'auto', paddingRight: '15px' }}>
                {courses.find(course => course.name === selectedCourse)?.groups.find(group => group.name === selectedGroup)?.messages.map((message, index) => (
                  <div key={index} className="message-box mb-3 p-3 bg-dark text-light" style={{
                    borderRadius: '15px',
                    maxWidth: '70%',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                  }}>
                    <strong>{message.student}</strong>: {message.doubt}
                  </div>
                ))}
              </div>

              <div className="d-flex align-items-center mt-3">
                <input
                  type="text"
                  className="form-control bg-light text-dark border-secondary rounded-pill"
                  placeholder="Type your doubt..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleDoubtSubmit()}
                  style={{ maxWidth: '80%' }}
                />
                <button className="btn btn-success ml-2 px-4 rounded-pill" onClick={handleDoubtSubmit}>
                  Send
                </button>
              </div>
            </>
          )}
          {!selectedCourse && <p className="text-center">Select a course to start.</p>}
          {!selectedGroup && step === 2 && <p className="text-center">Please select a group to join.</p>}
        </div>
      </div>
    </div>
  );
}

export default StudentCommunity;