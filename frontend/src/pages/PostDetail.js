import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { postsAPI } from '../services/api';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPost = useCallback(async () => {
    try {
      const response = await postsAPI.getPost(id);
      setPost(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load post');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  const handleEdit = () => {
    navigate(`/edit-post/${id}`);
  };

  const handleDelete = async () => {
    try {
      await postsAPI.deletePost(id);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to delete post');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <div>
      <article>
        <h1>{post.title}</h1>
        <div>
          <p>By Anonymous User</p>
          <p>Created: {new Date(post.created_at).toLocaleDateString()}</p>
          {post.updated_at && post.updated_at !== post.created_at && (
            <p>Updated: {new Date(post.updated_at).toLocaleDateString()}</p>
          )}
        </div>
        <div>
          <p>{post.content}</p>
        </div>
        <div>
          {post.tags && post.tags.length > 0 && (
            <p>
              Tags: {post.tags.map(tag => (
                <span key={tag} style={{ marginRight: '5px', backgroundColor: '#eee', padding: '2px 5px' }}>
                  {tag}
                </span>
              ))}
            </p>
          )}
        </div>
      </article>
      
      <div>
        <button onClick={handleEdit}>Edit</button>
        <button onClick={handleDelete} style={{ marginLeft: '10px' }}>Delete</button>
      </div>
    </div>
  );
};

export default PostDetail;