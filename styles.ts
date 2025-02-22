// app/styles.ts
import { ColorSchemeName } from 'react-native';

// Define the color palette based on the documented design system
const colors = {
  // Primary Colors
  primary: '#FF7A50', // Updated to warm orange from mockups
  primaryDark: '#E05A30', // Darker orange for pressed states
  primaryLight: '#FFE4D9', // Light orange for backgrounds

  // Secondary Colors
  secondary: '#4A90E2', // Soft blue
  secondaryDark: '#3A73B5', // Darker blue for pressed states
  secondaryLight: '#E6F3F8', // Light blue for backgrounds

  // Neutral Colors
  background: '#FAFAFA', // Light gray for app background
  backgroundWarm: '#FAFAF7', // Warm light background from mockups
  surface: '#FFFFFF', // White for cards and elevated surfaces
  surfaceWarm: '#F8F3E8', // Beige surface for pills and tags
  surfaceCool: '#E6F3F8', // Light blue surface for badges
  darkGray: '#2C2C2C', // For primary text
  mediumGray: '#6B6B6B', // For secondary text
  lightGray: '#E0E0E0', // For borders and dividers
  divider: '#EEEEEE', // Light divider color

  // Semantic Colors
  success: '#4CAF50', // Green for success
  warning: '#FFC107', // Amber for warnings
  error: '#F44336', // Red for errors
  info: '#2196F3', // Blue for information
  accentPink: '#F1D5CE', // Soft pink for premium badges

  // Food Category Colors
  protein: '#F0988C', // Soft red for meat/protein
  carbs: '#F8D49F', // Golden for grains/carbs
  produce: '#B4E0A2', // Light green for vegetables/fruits
  dairy: '#E6F3F8', // Light blue for dairy
  spices: '#FFB74D', // Orange for spices/seasonings

  // Dark Mode Variants
  darkBackground: '#1A1A1A', // Dark background
  darkSurface: '#1E1E1E', // Dark surface
  darkSurfaceElevated: '#2A2A2A', // Slightly lighter surface for dark mode
  darkTextPrimary: '#FFFFFF', // White for primary text in dark mode
  darkTextSecondary: '#B0B0B0', // Light gray for secondary text in dark mode
};

// Typography following the design system
const typography = {
  h1: {
    fontSize: 28,
    fontWeight: '700' as const, // Bold (700)
    lineHeight: 34,
    color: colors.darkGray,
  },
  h2: {
    fontSize: 24,
    fontWeight: '700' as const, // Bold (700)
    lineHeight: 30,
    color: colors.darkGray,
  },
  h3: {
    fontSize: 20,
    fontWeight: '700' as const, // Bold (700)
    lineHeight: 26,
    color: colors.darkGray,
  },
  h4: {
    fontSize: 18,
    fontWeight: '600' as const, // Semi-Bold (600)
    lineHeight: 24,
    color: colors.darkGray,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500' as const, // Medium (500)
    lineHeight: 22,
    color: colors.primary,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const, // Regular (400)
    lineHeight: 22,
    color: colors.darkGray,
  },
  body2: {
    fontSize: 14,
    fontWeight: '400' as const, // Regular (400)
    lineHeight: 20,
    color: colors.mediumGray,
  },
  caption: {
    fontSize: 12,
    fontWeight: '500' as const, // Medium (500)
    lineHeight: 16,
    color: colors.darkGray,
  },
  button: {
    fontSize: 16,
    fontWeight: '600' as const, // Semi-Bold (600)
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
  xxl: 32,
  pill: 100, // For pill-shaped buttons and badges
};

// Shadows for elevation based on the design system
const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    // iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    // Android
    elevation: 1,
  },
  md: {
    // iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    // Android
    elevation: 3,
  },
  lg: {
    // iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
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
    backgroundWarm: isDark ? colors.darkBackground : colors.backgroundWarm,
    surface: isDark ? colors.darkSurface : colors.surface,
    surfaceElevated: isDark ? colors.darkSurfaceElevated : colors.surface,
    surfaceWarm: isDark ? colors.darkSurfaceElevated : colors.surfaceWarm,
    surfaceCool: isDark ? colors.darkSurfaceElevated : colors.surfaceCool,
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
    divider: isDark ? '#333333' : colors.divider,
    success: colors.success,
    warning: colors.warning,
    error: colors.error,
    info: colors.info,
    accentPink: isDark ? '#5D4A48' : colors.accentPink,
    // Food category colors
    protein: colors.protein,
    carbs: colors.carbs,
    produce: colors.produce,
    dairy: colors.dairy,
    spices: colors.spices,
  };
};

// Button styles matching the design system specs
export const buttonStyles = {
  primary: {
    height: 56,
    borderRadius: borderRadius.md, // 12px rounded corners
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondary: {
    height: 56,
    borderRadius: borderRadius.md, // 12px rounded corners
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: 'transparent',
  },
  pillFilter: {
    backgroundColor: colors.surfaceWarm,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: borderRadius.pill,
    marginRight: 8,
    marginBottom: 8,
  },
  pillFilterActive: {
    backgroundColor: colors.surfaceWarm, // Same background when active
  },
};

// Card styles based on the design system
export const cardStyles = {
  standard: {
    borderRadius: borderRadius.md, // 12px
    overflow: 'hidden',
    backgroundColor: colors.surface,
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    // Android elevation
    elevation: 2,
  },
  rounded: {
    backgroundColor: colors.surface,
    borderRadius: 24, // Extra rounded corners
    overflow: 'hidden',
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    // Android
    elevation: 3,
  },
  elevated: {
    borderRadius: borderRadius.lg, // 16px
    overflow: 'hidden',
    backgroundColor: colors.surface,
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    // Android elevation
    elevation: 3,
  },
  task: {
    borderRadius: borderRadius.md, // 12px
    padding: spacing.md,
    borderLeftWidth: 4, // Left accent
    backgroundColor: colors.surface,
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
  standard: {
    height: 24,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.xs,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: borderRadius.pill, // Fully rounded corners
  },
  premium: {
    backgroundColor: colors.accentPink, // Soft pink
  },
  free: {
    backgroundColor: colors.surfaceCool, // Light blue
  },
  timer: {
    backgroundColor: colors.surface,
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    // Android
    elevation: 1,
  },
  active: {
    backgroundColor: colors.surface,
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    // Android
    elevation: 2,
  },
  tag: {
    backgroundColor: colors.surfaceWarm,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: borderRadius.pill,
  },
  badgeText: {
    ...typography.caption,
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
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 16,
    color: colors.mediumGray,
    fontWeight: '400',
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: '600',
  },
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

// Common UI components
export const commonUI = {
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginRight: 12,
  },
  infoRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 12,
    marginBottom: 16,
    backgroundColor: colors.backgroundWarm,
    padding: 16,
    borderRadius: 12,
  },
  infoIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surface,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    // Android
    elevation: 1,
  },
  closeButton: {
    position: 'absolute' as const,
    top: 12,
    right: 12,
    zIndex: 1,
    backgroundColor: colors.surface,
    borderRadius: 100,
    width: 32,
    height: 32,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    // Android
    elevation: 2,
  },
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
  commonUI,
};