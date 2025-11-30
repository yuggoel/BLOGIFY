import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usersAPI } from '../services/api';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token) {
      navigate('/login');
      return;
    }
    
    if (userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, [navigate]);

  const handleDeleteAccount = async () => {
    if (!user) return;
    
    const confirmed = window.confirm('Are you sure you want to delete your account? This action cannot be undone.');
    if (!confirmed) return;
    
    try {
      await usersAPI.deleteUser(user.id);
      // Logout user after account deletion
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/signup');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to delete account');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Error: User not found</div>;
  }

  return (
    <div>
      <h2>User Profile</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <div>
        <h3>Account Details</h3>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Member since:</strong> {new Date(user.created_at).toLocaleDateString()}</p>
      </div>
      
      <div>
        <h3>Account Actions</h3>
        <button 
          onClick={handleDeleteAccount}
          style={{ backgroundColor: '#dc3545', color: 'white' }}
        >
          Delete Account
        </button>
      </div>
      
      <div>
        <button onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default UserProfile;