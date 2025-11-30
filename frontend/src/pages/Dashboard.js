import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { postsAPI } from '../services/api';
import { 
  StyledContainer, 
  StyledButton, 
  StyledPostCard,
  Heading1,
  Paragraph
} from '../components/StyledComponents';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
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
    
    // Fetch user's posts
    fetchUserPosts();
  }, [navigate]);

  const fetchUserPosts = async () => {
    try {
      // Get user ID from localStorage
      const userData = localStorage.getItem('user');
      const userId = userData ? JSON.parse(userData).id : null;
      
      if (!userId) {
        throw new Error('User not found');
      }
      
      // Fetch all posts and filter by user ID
      // Note: In a real application, this would be done on the backend
      const response = await postsAPI.getAllPosts();
      const userPosts = response.data.filter(post => post.user_id === userId);
      setPosts(userPosts);
    } catch (err) {
      setError('Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) {
    return (
      <StyledContainer>
        <div style={{ textAlign: 'center', padding: '3rem 0' }}>
          <Paragraph>Loading...</Paragraph>
        </div>
      </StyledContainer>
    );
  }

  if (error) {
    return (
      <StyledContainer>
        <div style={{ textAlign: 'center', padding: '3rem 0' }}>
          <Paragraph style={{ color: '#dc3545' }}>Error: {error}</Paragraph>
        </div>
      </StyledContainer>
    );
  }

  if (!user) {
    return (
      <StyledContainer>
        <div style={{ textAlign: 'center', padding: '3rem 0' }}>
          <Paragraph style={{ color: '#dc3545' }}>Error: User not found</Paragraph>
        </div>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer>
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '2rem',
        padding: '1rem 0',
        borderBottom: '1px solid #e0e0e0'
      }}>
        <div>
          <Heading1 style={{ margin: 0 }}>Dashboard</Heading1>
          <Paragraph style={{ margin: '0.5rem 0 0 0', color: '#666666' }}>
            Welcome, {user.name}!
          </Paragraph>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <StyledButton 
            onClick={handleLogout} 
            variant="outline"
          >
            Logout
          </StyledButton>
          <StyledButton 
            onClick={() => navigate('/profile')}
            variant="secondary"
          >
            Profile
          </StyledButton>
        </div>
      </header>
      
      <section>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '2rem' 
        }}>
          <Heading2 style={{ margin: 0 }}>Your Posts</Heading2>
          <StyledButton 
            onClick={() => navigate('/create-post')}
            variant="secondary"
          >
            Create New Post
          </StyledButton>
        </div>
        
        {posts.length === 0 ? (
          <StyledCard>
            <Paragraph style={{ textAlign: 'center', margin: '2rem 0' }}>
              You haven't created any posts yet. Share your first story!
            </Paragraph>
          </StyledCard>
        ) : (
          <div>
            {posts.map(post => (
              <StyledPostCard 
                key={post.id} 
                post={post} 
                onEdit={() => navigate(`/edit-post/${post.id}`)}
                onDelete={async () => {
                  try {
                    await postsAPI.deletePost(post.id);
                    // Refresh the posts list
                    fetchUserPosts();
                  } catch (err) {
                    setError('Failed to delete post');
                  }
                }}
              />
            ))}
          </div>
        )}
      </section>
    </StyledContainer>
  );
};

export default Dashboard;