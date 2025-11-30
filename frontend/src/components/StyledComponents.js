import React from 'react';
import { Link } from 'react-router-dom';
import { 
  COLORS, 
  SPACING, 
  TYPOGRAPHY, 
  BORDER_RADIUS, 
  BUTTON_STYLES, 
  INPUT_STYLES, 
  CARD_STYLES,
  TAG_STYLES,
  TEXT_STYLES
} from '../styles/designSystem';

// Styled Button Component
export const StyledButton = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  disabled = false, 
  onClick, 
  type = 'button',
  style = {}
}) => {
  const baseStyle = {
    ...BUTTON_STYLES.base,
    ...BUTTON_STYLES[variant] || BUTTON_STYLES.primary,
    padding: size === 'lg' ? `${SPACING.md} ${SPACING.xl}` : 
             size === 'sm' ? `${SPACING.xs} ${SPACING.md}` : 
             BUTTON_STYLES.base.padding,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    ...style
  };

  return (
    <button 
      style={baseStyle} 
      onClick={onClick} 
      disabled={disabled}
      type={type}
    >
      {children}
    </button>
  );
};

// Styled Input Component
export const StyledInput = ({ 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  style = {},
  ...props 
}) => {
  const baseStyle = {
    ...INPUT_STYLES.base,
    ...style
  };

  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      style={baseStyle}
      {...props}
    />
  );
};

// Styled Textarea Component
export const StyledTextarea = ({ 
  placeholder, 
  value, 
  onChange, 
  rows = 4,
  style = {},
  ...props 
}) => {
  const baseStyle = {
    ...INPUT_STYLES.base,
    minHeight: '120px',
    ...style
  };

  return (
    <textarea
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      rows={rows}
      style={baseStyle}
      {...props}
    />
  );
};

// Styled Card Component
export const StyledCard = ({ children, style = {}, variant = 'base' }) => {
  const baseStyle = {
    ...CARD_STYLES[variant] || CARD_STYLES.base,
    ...style
  };

  return (
    <div style={baseStyle}>
      {children}
    </div>
  );
};

// Styled Tag Component
export const StyledTag = ({ children, style = {} }) => {
  const baseStyle = {
    ...TAG_STYLES.base,
    ...style
  };

  return (
    <span style={baseStyle}>
      {children}
    </span>
  );
};

// Styled Container Component
export const StyledContainer = ({ children, style = {}, variant = 'base' }) => {
  const variants = {
    base: {
      maxWidth: '800px',
      margin: '0 auto',
      padding: `0 ${SPACING.md}`
    },
    wide: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: `0 ${SPACING.md}`
    }
  };

  const baseStyle = {
    ...variants[variant] || variants.base,
    ...style
  };

  return (
    <div style={baseStyle}>
      {children}
    </div>
  );
};

// Styled Header Component
export const StyledHeader = ({ title, subtitle, style = {} }) => {
  const baseStyle = {
    textAlign: 'center',
    marginBottom: SPACING.xl,
    ...style
  };

  const titleStyle = {
    ...TEXT_STYLES.heading1,
    marginBottom: SPACING.sm,
    textAlign: 'left'
  };

  const subtitleStyle = {
    ...TEXT_STYLES.body,
    color: COLORS.textSecondary,
    textAlign: 'left'
  };

  return (
    <header style={baseStyle}>
      <h1 style={titleStyle}>{title}</h1>
      {subtitle && <p style={subtitleStyle}>{subtitle}</p>}
    </header>
  );
};

// Styled Post Card Component
export const StyledPostCard = ({ post, onEdit, onDelete }) => {
  const cardStyle = {
    ...CARD_STYLES.elevated,
    marginBottom: SPACING.lg,
    transition: 'transform 0.2s ease, box-shadow 0.2s ease'
  };

  const cardHoverStyle = {
    ...cardStyle,
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
    }
  };

  const titleStyle = {
    ...TEXT_STYLES.heading2,
    margin: `${SPACING.sm} 0`,
    fontSize: TYPOGRAPHY.fontSize.xl
  };

  const linkStyle = {
    color: COLORS.primary,
    textDecoration: 'none',
    transition: 'color 0.2s ease'
  };

  const linkHoverStyle = {
    color: COLORS.secondary
  };

  const contentStyle = {
    ...TEXT_STYLES.body,
    marginBottom: SPACING.md,
    color: COLORS.textSecondary
  };

  const metaStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: `1px solid ${COLORS.border}`,
    paddingTop: SPACING.md,
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textLight
  };

  const tagContainerStyle = {
    marginTop: SPACING.sm
  };

  const buttonGroupStyle = {
    display: 'flex',
    gap: SPACING.sm
  };

  return (
    <article 
      style={cardStyle}
      onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
      onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
    >
      <h2 style={titleStyle}>
        <Link 
          to={`/post/${post.id}`} 
          style={linkStyle}
          onMouseEnter={(e) => e.target.style.color = COLORS.secondary}
          onMouseLeave={(e) => e.target.style.color = COLORS.primary}
        >
          {post.title}
        </Link>
      </h2>
      <p style={contentStyle}>
        {post.content.substring(0, 200)}...
      </p>
      
      {post.tags && post.tags.length > 0 && (
        <div style={tagContainerStyle}>
          {post.tags.map(tag => (
            <StyledTag key={tag}>{tag}</StyledTag>
          ))}
        </div>
      )}
      
      <div style={metaStyle}>
        <div>
          <span>By Anonymous User</span>
          <span style={{ margin: `0 ${SPACING.sm}` }}>•</span>
          <span>{new Date(post.created_at).toLocaleDateString()}</span>
        </div>
        {(onEdit || onDelete) && (
          <div style={buttonGroupStyle}>
            {onEdit && (
              <StyledButton 
                variant="ghost" 
                size="sm" 
                onClick={onEdit}
              >
                Edit
              </StyledButton>
            )}
            {onDelete && (
              <StyledButton 
                variant="ghost" 
                size="sm" 
                onClick={onDelete}
                style={{ color: COLORS.danger }}
              >
                Delete
              </StyledButton>
            )}
          </div>
        )}
      </div>
    </article>
  );
};

// Styled Form Component
export const StyledForm = ({ children, onSubmit, style = {} }) => {
  const baseStyle = {
    maxWidth: '600px',
    margin: '0 auto',
    ...style
  };

  return (
    <form onSubmit={onSubmit} style={baseStyle}>
      {children}
    </form>
  );
};

// Styled Form Group Component
export const StyledFormGroup = ({ label, children, style = {} }) => {
  const baseStyle = {
    marginBottom: SPACING.lg,
    ...style
  };

  const labelStyle = {
    display: 'block',
    marginBottom: SPACING.xs,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.text
  };

  return (
    <div style={baseStyle}>
      {label && <label style={labelStyle}>{label}</label>}
      {children}
    </div>
  );
};

// Typography Components
export const Heading1 = ({ children, style = {} }) => {
  const baseStyle = {
    ...TEXT_STYLES.heading1,
    ...style
  };
  
  return <h1 style={baseStyle}>{children}</h1>;
};

export const Heading2 = ({ children, style = {} }) => {
  const baseStyle = {
    ...TEXT_STYLES.heading2,
    ...style
  };
  
  return <h2 style={baseStyle}>{children}</h2>;
};

export const Heading3 = ({ children, style = {} }) => {
  const baseStyle = {
    ...TEXT_STYLES.heading3,
    ...style
  };
  
  return <h3 style={baseStyle}>{children}</h3>;
};

export const Paragraph = ({ children, style = {} }) => {
  const baseStyle = {
    ...TEXT_STYLES.body,
    ...style
  };
  
  return <p style={baseStyle}>{children}</p>;
};

export const Caption = ({ children, style = {} }) => {
  const baseStyle = {
    ...TEXT_STYLES.caption,
    ...style
  };
  
  return <p style={baseStyle}>{children}</p>;
};