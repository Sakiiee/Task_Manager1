import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import '../assets/css/Registration.css'

const Registration = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        contact: '',
        address: '',
        qualification: ''
    });

    const navigate = useNavigate(); 

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/register', formData);
            navigate('/Login'); 
            window.alert("User Registered Successfully");
            console.log(response.data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="center">
            <div className='registration-box'>
                <h2>Registration</h2>
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
                    <div className='form-row'>
                        <label htmlFor="contact">Contact:</label>
                        <input
                            type="contact"
                            id="contact"
                            name="contact"
                            value={formData.contact}
                            onChange={handleChange}
                        />
                    </div>
                    <div className='form-row'>
                        <label htmlFor="address">Address:</label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                        />
                    </div>
                    <div className='form-row'>
                        <label htmlFor="qualification">Qualification:</label>
                        <input
                            type="text"
                            id="qualification"
                            name="qualification"
                            value={formData.qualification}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="button-container">
                        <button type="submit" className='submit-button'>Register</button>
                    </div>
                </form>
                <div className='login-prompt'>
                    <span>Already a user?</span>
                    <Link to="/login" style={{textDecoration: 'none', color: 'white'}}>Login Here</Link>
                </div>
            </div>
        </div>
    );
};

export default Registration;