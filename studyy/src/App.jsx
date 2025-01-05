import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Quiz from './pages/Quizz';
import Register from './pages/Register';
import Login from './pages/Login';
import TeacherForm from './teacher/teacherForm';
import { useState, useEffect } from 'react';
import Admin from './admin/Admin';

function App() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    const savedStatus = localStorage.getItem('isAdminLoggedIn');
    return savedStatus === 'true'; // Convert from string to boolean
  });

  // Save the login status to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('isAdminLoggedIn', isAdminLoggedIn.toString());
  }, [isAdminLoggedIn]);

  return (
    <div style={{ backgroundColor: '#222', minHeight: '100vh' }}>
      <Navbar />
      <Router>
        <Routes>
          <Route path="/" element={<Quiz />} />
          <Route path="/register" element={<Register />} />
          <Route path="/form/:id" element={<TeacherForm/>} />
          
          <Route
            path="/login"
            element={<Login onLogin={() => setIsAdminLoggedIn(true)} />}
          />
          <Route
            path="/admin/*"
            element={isAdminLoggedIn ? <Admin /> : <Navigate to="/login" />}
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;