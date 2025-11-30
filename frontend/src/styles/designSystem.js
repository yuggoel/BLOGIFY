// Design System for Blogify - PointBlank.club inspired design
// This file contains reusable design tokens and components that match pointblank.club's aesthetic

export const COLORS = {
  // PointBlank.club inspired color palette
  primary: '#1a1a1a', // Dark background/main text
  primaryLight: '#2d2d2d', // Slightly lighter dark
  secondary: '#ff6b35', // Vibrant accent color (orange)
  secondaryHover: '#e55a2b', // Hover state for accent
  accent: '#f7931e', // Secondary accent (gold)
  background: '#ffffff', // Clean white background
  surface: '#f8f9fa', // Light surface color
  text: '#1a1a1a', // Dark text
  textSecondary: '#666666', // Secondary text
  textLight: '#999999', // Light text
  border: '#e0e0e0', // Subtle borders
  success: '#28a745',
  danger: '#dc3545',
  warning: '#ffc107',
  white: '#ffffff',
  black: '#000000'
};

export const SPACING = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  xxl: '3rem'
};

export const TYPOGRAPHY = {
  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    xxl: '1.5rem',
    xxxl: '2rem',
    xxxxl: '2.5rem'
  },
  fontWeight: {
    thin: 100,
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    black: 900
  }
};

export const BORDER_RADIUS = {
  none: '0',
  sm: '0.125rem',
  md: '0.25rem',
  lg: '0.5rem',
  xl: '0.75rem',
  full: '9999px'
};

export const SHADOWS = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
};

// Reusable component styles
export const CARD_STYLES = {
  base: {
    padding: SPACING.lg,
    border: `1px solid ${COLORS.border}`,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.background,
    boxShadow: SHADOWS.sm,
    marginBottom: SPACING.md
  },
  elevated: {
    padding: SPACING.lg,
    border: 'none',
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.background,
    boxShadow: SHADOWS.md,
    marginBottom: SPACING.md
  }
};

export const BUTTON_STYLES = {
  base: {
    padding: `${SPACING.sm} ${SPACING.md}`,
    border: 'none',
    borderRadius: BORDER_RADIUS.sm,
    cursor: 'pointer',
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    transition: 'all 0.2s ease-in-out',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  primary: {
    backgroundColor: COLORS.primary,
    color: COLORS.white
  },
  secondary: {
    backgroundColor: COLORS.secondary,
    color: COLORS.white
  },
  accent: {
    backgroundColor: COLORS.accent,
    color: COLORS.white
  },
  outline: {
    backgroundColor: 'transparent',
    border: `1px solid ${COLORS.border}`,
    color: COLORS.text
  },
  ghost: {
    backgroundColor: 'transparent',
    border: 'none',
    color: COLORS.text
  }
};

export const INPUT_STYLES = {
  base: {
    width: '100%',
    padding: SPACING.sm,
    border: `1px solid ${COLORS.border}`,
    borderRadius: BORDER_RADIUS.sm,
    fontSize: TYPOGRAPHY.fontSize.base,
    boxSizing: 'border-box',
    transition: 'border-color 0.2s ease-in-out'
  },
  focus: {
    borderColor: COLORS.secondary,
    outline: 'none',
    boxShadow: `0 0 0 3px rgba(255, 107, 53, 0.1)`
  }
};

export const TAG_STYLES = {
  base: {
    display: 'inline-block',
    padding: `${SPACING.xs} ${SPACING.sm}`,
    marginRight: SPACING.xs,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.full,
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textSecondary,
    fontWeight: TYPOGRAPHY.fontWeight.medium
  }
};

// Layout components
export const CONTAINER_STYLES = {
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

export const HEADER_STYLES = {
  base: {
    padding: `${SPACING.lg} 0`,
    borderBottom: `1px solid ${COLORS.border}`,
    marginBottom: SPACING.xl
  }
};

export const NAVIGATION_STYLES = {
  base: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: `${SPACING.md} 0`,
    borderBottom: `1px solid ${COLORS.border}`
  },
  link: {
    textDecoration: 'none',
    padding: `${SPACING.xs} ${SPACING.md}`,
    borderRadius: BORDER_RADIUS.sm,
    color: COLORS.text,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    transition: 'color 0.2s ease-in-out'
  },
  activeLink: {
    color: COLORS.secondary
  }
};

// Typography styles
export const TEXT_STYLES = {
  heading1: {
    fontSize: TYPOGRAPHY.fontSize.xxxxl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.primary,
    lineHeight: 1.2,
    marginBottom: SPACING.lg
  },
  heading2: {
    fontSize: TYPOGRAPHY.fontSize.xxl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.primary,
    lineHeight: 1.3,
    marginBottom: SPACING.md
  },
  heading3: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.primary,
    lineHeight: 1.4,
    marginBottom: SPACING.sm
  },
  body: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.normal,
    color: COLORS.text,
    lineHeight: 1.6,
    marginBottom: SPACING.md
  },
  caption: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.normal,
    color: COLORS.textSecondary,
    lineHeight: 1.5
  }
};