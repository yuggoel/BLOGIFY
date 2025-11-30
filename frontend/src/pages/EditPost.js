import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { postsAPI } from '../services/api';

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const response = await postsAPI.getPost(id);
      const post = response.data;
      setTitle(post.title);
      setContent(post.content);
      setTags(post.tags ? post.tags.join(', ') : '');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load post');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const postData = {
        title: title || undefined,
        content: content || undefined,
        tags: tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) : undefined
      };

      // Remove undefined fields
      Object.keys(postData).forEach(key => postData[key] === undefined && delete postData[key]);

      await postsAPI.updatePost(id, postData);
      navigate(`/post/${id}`);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update post');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Edit Post</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label>Content:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="10"
          />
        </div>
        <div>
          <label>Tags (comma separated):</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="tech, programming, react"
          />
        </div>
        <button type="submit" disabled={saving}>
          {saving ? 'Updating...' : 'Update Post'}
        </button>
        <button type="button" onClick={() => navigate(`/post/${id}`)}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default EditPost;