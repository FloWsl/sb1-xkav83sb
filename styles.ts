// app/styles.ts
import { ColorSchemeName } from 'react-native';

// Define the color palette based on the documented design system
const colors = {
  // Primary Colors
  primary: '#4CAF50', // Fresh green representing healthy food
  primaryDark: '#388E3C', // Darker green for pressed states
  primaryLight: '#A5D6A7', // Light green for backgrounds

  // Secondary Colors
  secondary: '#FF9800', // Warm orange representing cooking
  secondaryDark: '#F57C00', // Darker orange for pressed states
  secondaryLight: '#FFCC80', // Light orange for backgrounds

  // Neutral Colors
  background: '#FAFAFA', // Light gray for app background
  surface: '#FFFFFF', // White for cards and elevated surfaces
  darkGray: '#424242', // For primary text
  mediumGray: '#757575', // For secondary text
  lightGray: '#E0E0E0', // For borders and dividers

  // Semantic Colors
  success: '#4CAF50', // Green (same as primary)
  warning: '#FFC107', // Amber for warnings
  error: '#F44336', // Red for errors
  info: '#2196F3', // Blue for information

  // Dark Mode Variants
  darkBackground: '#121212',
  darkSurface: '#1E1E1E',
  darkTextPrimary: '#FFFFFF',
  darkTextSecondary: '#B0B0B0',
};

// Typography following the design system
const typography = {
  h1: {
    fontSize: 32,
    fontWeight: '700' as const, // Bold (700)
    lineHeight: 38,
  },
  h2: {
    fontSize: 24,
    fontWeight: '700' as const, // Bold (700)
    lineHeight: 32,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600' as const, // Semi-Bold (600)
    lineHeight: 26,
  },
  h4: {
    fontSize: 18,
    fontWeight: '600' as const, // Semi-Bold (600)
    lineHeight: 24,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const, // Regular (400)
    lineHeight: 22,
  },
  body2: {
    fontSize: 14,
    fontWeight: '400' as const, // Regular (400)
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400' as const, // Regular (400)
    lineHeight: 16,
  },
  button: {
    fontSize: 16,
    fontWeight: '500' as const, // Medium (500)
    lineHeight: 24,
  },
};

// Spacing scale
const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Border radius scale (based on the design system)
const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 25, // For pill-shaped buttons
};

// Shadows for elevation based on the design system
const shadows = {
  sm: {
    // iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    // Android
    elevation: 2,
  },
  md: {
    // iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    // Android
    elevation: 3,
  },
  lg: {
    // iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.10,
    shadowRadius: 16,
    // Android
    elevation: 6,
  },
};

// Get theme-aware colors
export const getThemeColors = (colorScheme: ColorSchemeName) => {
  const isDark = colorScheme === 'dark';
  
  return {
    background: isDark ? colors.darkBackground : colors.background,
    surface: isDark ? colors.darkSurface : colors.surface,
    text: {
      primary: isDark ? colors.darkTextPrimary : colors.darkGray,
      secondary: isDark ? colors.darkTextSecondary : colors.mediumGray,
    },
    primary: colors.primary,
    primaryDark: colors.primaryDark,
    primaryLight: colors.primaryLight,
    secondary: colors.secondary,
    secondaryDark: colors.secondaryDark,
    secondaryLight: colors.secondaryLight,
    border: isDark ? '#333333' : colors.lightGray,
    success: colors.success,
    warning: colors.warning,
    error: colors.error,
    info: colors.info,
  };
};

// Button styles matching the design system specs
export const buttonStyles = {
  primary: {
    height: 50,
    borderRadius: borderRadius.pill, // 25px pill shape
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.primary, // Primary color (#4CAF50)
  },
  secondary: {
    height: 50,
    borderRadius: borderRadius.pill, // 25px pill shape
    paddingHorizontal: spacing.lg,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: colors.secondary, // Secondary color (#FF9800)
  },
  text: {
    height: 40,
    paddingHorizontal: spacing.md,
    backgroundColor: 'transparent',
  },
};

// Card styles based on the design system
export const cardStyles = {
  menuPlan: {
    borderRadius: borderRadius.lg, // 16px
    overflow: 'hidden',
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    // Android elevation
    elevation: 3,
  },
  recipe: {
    borderRadius: borderRadius.md, // 12px
    overflow: 'hidden',
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    // Android elevation
    elevation: 2,
  },
  task: {
    borderRadius: borderRadius.md, // 12px
    padding: spacing.md,
    borderLeftWidth: 4, // Left accent
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    // Android elevation
    elevation: 1,
  }
};

// Badge styles as specified in the design system
export const badgeStyles = {
  premium: {
    backgroundColor: colors.secondary, // Secondary color (#FF9800)
    height: 16,
    paddingHorizontal: 8,
    borderRadius: 8, // Pill shape
  },
  new: {
    backgroundColor: colors.success, // Success color (#4CAF50)
    height: 16,
    paddingHorizontal: 8,
    borderRadius: 8, // Pill shape
  },
  free: {
    backgroundColor: colors.info, // Info color (#2196F3)
    height: 16,
    paddingHorizontal: 8,
    borderRadius: 8, // Pill shape
  },
  badgeText: {
    ...typography.caption,
    fontWeight: '700' as const, // Bold
    color: colors.darkGray,
  }
};

// Tab bar styling based on the design system
export const tabBarStyles = {
  container: {
    height: 56,
    backgroundColor: colors.surface,
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    // Android elevation
    elevation: 8,
  },
  activeTab: {
    color: colors.primary,
  },
  inactiveTab: {
    color: colors.mediumGray,
  },
  indicator: {
    backgroundColor: colors.primary,
    height: 3,
    width: 3,
    borderRadius: 1.5,
  }
};

// Input styles based on the design system
export const inputStyles = {
  textInput: {
    height: 56,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    padding: 16,
  },
  search: {
    height: 48,
    backgroundColor: `${colors.lightGray}80`, // 50% opacity
    borderRadius: 24,
    paddingHorizontal: 16,
  },
  checkbox: {
    size: 24,
    borderRadius: 4,
    borderWidth: 2,
    touchSize: 44, // Minimum touch target
  },
  chip: {
    height: 32,
    borderRadius: 16,
    paddingHorizontal: 12,
    backgroundColor: `${colors.info}80`, // 50% opacity
  }
};

export default {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  getThemeColors,
  buttonStyles,
  cardStyles,
  badgeStyles,
  tabBarStyles,
  inputStyles,
};