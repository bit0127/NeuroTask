import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // useNavigate instead of useHistory
import './Home.css';
import config from '../../Config';

const Home = () => {
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });
  const [loginErrors, setLoginErrors] = useState({});
  const [loginMessage, setLoginMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // useNavigate for navigation

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const validateLoginForm = () => {
    const errors = {};

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(loginData.email)) {
      errors.email = 'Invalid email address';
    }

    // Validate password
    if (loginData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }

    setLoginErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (validateLoginForm()) {
      setLoading(true);
      try {
        localStorage.setItem('email', loginData.email);  // Store the token
        const response = await fetch(config.loginUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: loginData.email,
            password: loginData.password,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          localStorage.setItem('token', data.token);  // Store the token
          setLoginMessage('Login successful!');
          navigate('/dashboard'); // Redirect to the Task Dashboard after successful login
        } else {
          const errorData = await response.json();
          setLoginMessage(errorData.message || 'Login failed. Please try again.');
        }
      } catch (error) {
        setLoginMessage('An error occurred. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="home-container">
      <h2>Welcome to NeuroTask</h2>
      <p>Manage your tasks effectively with AI-powered tools.</p>

      <div className="form-container">
        <h3>Login</h3>
        {loginMessage && <p className="status-message">{loginMessage}</p>}
        
        <form onSubmit={handleLoginSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={loginData.email}
              onChange={handleLoginChange}
              placeholder="Enter your email"
              autoComplete="off"
            />
            {loginErrors.email && <p className="error-text">{loginErrors.email}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={loginData.password}
              onChange={handleLoginChange}
              placeholder="Enter your password"
              autoComplete="off"
            />
            {loginErrors.password && <p className="error-text">{loginErrors.password}</p>}
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>

      <div className="button-container">
        <Link to="/register">
          <button className="register-btn">Register</button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
