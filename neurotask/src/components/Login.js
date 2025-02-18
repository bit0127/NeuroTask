import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // XSS Protection: Ensure values are sanitized before displaying or sending them.
  const handleLogin = async (e) => {
    e.preventDefault();

    // CSRF Protection: Send CSRF token with the login request
    try {
      const response = await fetch('YOUR_LOGIN_API_ENDPOINT', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': 'your-csrf-token-here', // Include CSRF token
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        navigate('/dashboard'); // Redirect to the dashboard after successful login
      } else {
        setError('Login failed!');
      }
    } catch (error) {
      setError('Error logging in');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p>{error}</p>}
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
