import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Quiz from './pages/Quizz';
import Register from './pages/Register';
import Login from './pages/Login';
<<<<<<< HEAD
import TeacherForm from './teacher/teacherForm';
=======
import { useState } from 'react';
import Admin from './admin/Admin';
>>>>>>> 040e8852915e7f12d87075978c505cbefe892167

function App() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  return (
    <div style={{ backgroundColor: '#222', minHeight: '100vh' }}>
      <Navbar />
      <Router>
        <Routes>
          <Route path="/" element={<Quiz />} />
          <Route path="/register" element={<Register />} />
<<<<<<< HEAD
          <Route path="/login" element={<Login />} />
          <Route path="/form" element={<TeacherForm/>} />
          
=======
          <Route
            path="/login"
            element={<Login onLogin={() => setIsAdminLoggedIn(true)} />}
          />
          <Route
            path="/admin/*"
            element={isAdminLoggedIn ? <Admin /> : <Navigate to="/login" />}
          />
>>>>>>> 040e8852915e7f12d87075978c505cbefe892167
        </Routes>
      </Router>
    </div>
  );
}

export default App;