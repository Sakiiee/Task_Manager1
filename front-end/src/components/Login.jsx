import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import '../assets/css/Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate(); 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/login', formData);

      navigate('/TodoTable'); 

      window.alert("Successfully Logged In");
      console.log(response.data);
      setFormData({ username: '', password: '' });
      setError('');
    } catch (error) {
      setError(error.response.data.error || '*** Invalid Username or Password ***');
    }
  };

    // const handleForgotPassword = async () => {
  //   try {
  //     // Send request to backend to generate and send OTP
  //     await axios.post('http://localhost:5000/reset-password');
  //     window.alert("OTP sent successfully");
  //   } catch (error) {
  //     setError(error.response.data.error || '*** Error sending OTP. Please try again later. ***');
  //   }
  // };

  return (
    <div className='center'>
      <div className="login-box">
        <h2>Log In</h2>
        <form onSubmit={handleSubmit}>
          <div className='form-row'>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className='form-row'>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="button-container">
            <button type="submit" className='submit-button'>Login</button>
            {/* <Link to="//TodoTable" className='todo' style={{ textDecoration: 'none', color: 'white' }}>Task Mananger</Link> */}
            <Link to="/reset-password" style={{ textDecoration: 'none', color: 'white' }}>Forgot Password?</Link>
          </div>
        </form>
        
        {error && <p>{error}</p>}
        <div className='registration-prompt'>
          <span>Not a user yet?</span>
          <Link to="/registration" style={{ textDecoration: 'none', color: 'white' }}>Register Here</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
