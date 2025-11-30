import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { postsAPI } from '../services/api';
import { 
  StyledContainer, 
  StyledHeader, 
  StyledPostCard,
  Heading1,
  Paragraph
} from '../components/StyledComponents';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAllPosts();
  }, []);

  const fetchAllPosts = async () => {
    try {
      const response = await postsAPI.getAllPosts();
      setPosts(response.data);
    } catch (err) {
      setError('Failed to fetch posts');
    } finally {
      setLoading(false);
    }
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

  return (
    <StyledContainer>
      <StyledHeader 
        title="Blogify" 
        subtitle="Share your thoughts with the world" 
      />
      
      <section>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '2rem' 
        }}>
          <Heading2 style={{ margin: 0 }}>Latest Posts</Heading2>
        </div>
        
        {posts.length === 0 ? (
          <StyledCard>
            <Paragraph style={{ textAlign: 'center', margin: '2rem 0' }}>
              No posts available yet. Be the first to share your thoughts!
            </Paragraph>
          </StyledCard>
        ) : (
          <div>
            {posts.map(post => (
              <StyledPostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>
    </StyledContainer>
  );
};

export default Home;