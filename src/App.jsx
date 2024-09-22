import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import ForgotPassword from './components/ForgotPassword';
import { Navigate } from 'react-router-dom';
import Homepage from './components/Homepage';


const App = () => {
  
  return (
    <div>
      <Router>
        <Routes>
          
          <Route path='/' element={<ProtectedRoutes><Homepage /></ProtectedRoutes>} />
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />

          <Route path='/password-reset' element={<ForgotPassword />} />
        </Routes>
      </Router>
    </div>
  );
};

export function ProtectedRoutes(props) {
  if (localStorage.getItem('user')) {
    return props.children;
  } else {
    return <Navigate to='/login' />;
  }
}

export default App;