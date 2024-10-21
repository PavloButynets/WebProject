import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Home from './Pages/Home'
import Login from './Pages/Login/Login';
import Signup from './Pages/Signup/SignUp';

function App() {
  return (
    <Router>
      <div className="App">

        <Routes>
          <Route path="/" element ={<Home />} />
          <Route path="/login" element ={<Login />} />
          <Route path="/signup" element ={<Signup />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
