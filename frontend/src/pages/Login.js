import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // Basic validation
    if (!email || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }
    
    try {
      const response = await authAPI.login({ email, password });
      const { id, name } = response.data;
      
      // Store user info and token in localStorage
      localStorage.setItem('token', 'fake-jwt-token'); // In real app, this would come from backend
      localStorage.setItem('user', JSON.stringify({ id, name, email }));
      
      navigate('/dashboard');
    } catch (err) {
      // Provide more detailed error information
      if (err.response) {
        // Server responded with error status
        if (err.response.status === 401) {
          setError(err.response.data.detail || 'Invalid email or password');
        } else {
          setError(`Server error: ${err.response.status} - ${err.response.data.detail || 'Unknown error'}`);
        }
      } else if (err.request) {
        // Request was made but no response received
        setError('Network error: Unable to connect to server. Please check if the backend is running.');
      } else {
        // Something else happened
        setError(`Error: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p>
        Don't have an account? <Link to="/signup">Sign up</Link>
      </p>
    </div>
  );
};

export default Login;