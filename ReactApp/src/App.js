import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Cookies from 'universal-cookie';
import Login from './components/pages/Login'  
import Dashboard from './components/pages/Dashboard';
import Folders from './components/pages/Folders';
import Projects from './components/pages/Projects';


function App() {
  
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Dashboard />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/folders/:id" element={<Folders />} />
        <Route exact path="/projects/:id" element={<Projects />} />
      </Routes>
    </Router>
  );
}

export default App