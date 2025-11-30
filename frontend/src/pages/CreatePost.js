import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postsAPI } from '../services/api';
import { 
  StyledContainer, 
  StyledForm, 
  StyledFormGroup, 
  StyledInput, 
  StyledTextarea, 
  StyledButton,
  Heading1,
  Paragraph
} from '../components/StyledComponents';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // Basic validation
    if (!title || !content) {
      setError('Title and content are required');
      setLoading(false);
      return;
    }
    
    try {
      // Get user ID from localStorage
      const userData = localStorage.getItem('user');
      const userId = userData ? JSON.parse(userData).id : null;
      
      if (!userId) {
        throw new Error('User not found');
      }
      
      // Prepare post data
      const postData = {
        title,
        content,
        user_id: userId,
        tags: tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) : []
      };
      
      await postsAPI.createPost(postData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledContainer>
      <Heading1>Create New Post</Heading1>
      
      {error && (
        <StyledCard style={{ backgroundColor: '#fff5f5', border: '1px solid #fed7d7', marginBottom: '1rem' }}>
          <Paragraph style={{ color: '#c53030', margin: 0 }}>{error}</Paragraph>
        </StyledCard>
      )}
      
      <StyledCard>
        <StyledForm onSubmit={handleSubmit}>
          <StyledFormGroup label="Title">
            <StyledInput
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Enter a compelling title"
            />
          </StyledFormGroup>
          
          <StyledFormGroup label="Content">
            <StyledTextarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              placeholder="Share your thoughts..."
            />
          </StyledFormGroup>
          
          <StyledFormGroup label="Tags (comma separated)">
            <StyledInput
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="tech, programming, react"
            />
          </StyledFormGroup>
          
          <div style={{ display: 'flex', gap: '10px', marginTop: '2rem' }}>
            <StyledButton 
              type="submit" 
              disabled={loading}
              variant="secondary"
            >
              {loading ? 'Publishing...' : 'Publish Post'}
            </StyledButton>
            <StyledButton 
              type="button" 
              variant="outline" 
              onClick={() => navigate('/dashboard')}
            >
              Cancel
            </StyledButton>
          </div>
        </StyledForm>
      </StyledCard>
    </StyledContainer>
  );
};

export default CreatePost;