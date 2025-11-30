import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NAVIGATION_STYLES, COLORS, TYPOGRAPHY } from '../styles/designSystem';

const Navigation = () => {
  const location = useLocation();
  const token = localStorage.getItem('token');
  
  const isActive = (path) => location.pathname === path;
  
  const navStyle = {
    ...NAVIGATION_STYLES.base,
    padding: '1rem 0',
    backgroundColor: COLORS.background
  };
  
  const linkStyle = {
    ...NAVIGATION_STYLES.link,
    textDecoration: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    color: COLORS.text,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    transition: 'color 0.2s ease'
  };
  
  const activeLinkStyle = {
    ...linkStyle,
    color: COLORS.secondary
  };

  const logoStyle = {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.primary,
    textDecoration: 'none'
  };

  return (
    <nav style={navStyle}>
      <div>
        <Link to="/" style={logoStyle}>
          Blogify
        </Link>
      </div>
      
      <div>
        {token ? (
          <>
            <Link to="/dashboard" style={isActive('/dashboard') ? activeLinkStyle : linkStyle}>
              Dashboard
            </Link>
            <Link to="/profile" style={isActive('/profile') ? activeLinkStyle : linkStyle}>
              Profile
            </Link>
            <Link to="/create-post" style={isActive('/create-post') ? activeLinkStyle : linkStyle}>
              Create Post
            </Link>
          </>
        ) : (
          <>
            <Link to="/login" style={isActive('/login') ? activeLinkStyle : linkStyle}>
              Login
            </Link>
            <Link to="/signup" style={isActive('/signup') ? activeLinkStyle : linkStyle}>
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navigation;