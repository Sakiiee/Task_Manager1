import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../assets/css/ResetPassword.css'

const ResetPassword = () => {
  const [username, setUsername] = useState('');
  const [otp, setOTP] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showGenerateOTP, setShowGenerateOTP] = useState(true);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [message, setMessage] = useState('');

  const handleGenerateOTP = async () => {
    try {
      const response = await axios.post('http://localhost:5000/request-otp', { username });
      const { otp } = response.data;
      console.log('Generated OTP:', otp);
      setShowGenerateOTP(false);
      setShowResetPassword(true);
      setMessage('OTP generated successfully');
    } catch (error) {
      setMessage('Error generating OTP. Please try again later.');
    }
  };

  const handleChangePassword = async () => {
    try {
      await axios.post('http://localhost:5000/reset-password', { username, otp, newPassword });
      setMessage('Password changed successfully');
    } catch (error) {
      setMessage('Wrong or Expired OTP. Please try again.');
    }
  };

  return (
    <div>
      {showGenerateOTP && (
        <div className="center">
          <div className='reset-password-box'>
            <h2>Reset Password</h2>
            <div className="form-row">
              <label style={{ width: '90px' }}>Username:</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} style={{ width: '250px' }} />
            </div>
            <div className="button-container">
              <button onClick={handleGenerateOTP} className='submit-button'>Generate OTP</button>
            </div>
            <Link to="/" style={{ textDecoration: 'none', color: 'white', marginTop: '20px' }}>Back to Login</Link>
          </div>
        </div>
      )}

      {showResetPassword && (
        <div className='center'>
          <div className='reset-password-box'>
            <h2>Reset Password</h2>
            <form>
              <div className="form-row">
                <label>Username:</label>
                <input type="text" style={{ color: 'white' }} value={username} disabled />
              </div>
              <div className="form-row">
                <label>OTP:</label>
                <input type="text" value={otp} onChange={(e) => setOTP(e.target.value)} />
              </div>
              <div className="form-row">
                <label>New Password:</label>
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
              </div>
              <div className="button-container">
                <button onClick={handleChangePassword} className='submit-button'>Change Password</button>
              </div>
            </form>
            {message && <p>{message}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResetPassword;