import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Quiz from './pages/Quizz';
import Register from './pages/Register';
import Login from './pages/Login';

function App() {
  return (
    <div style={{ backgroundColor: '#222', minHeight: '100vh' }}>
      <Navbar />
      <Router>
        <Routes>
          <Route path="/" element={<Quiz />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;