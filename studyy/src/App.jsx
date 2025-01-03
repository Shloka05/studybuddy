import './App.css';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Quiz from './pages/Quizz';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Quiz />} />
      </Routes>
    </>
  );
}

export default App;