// app/styles/discovery.styles.ts

import { StyleSheet, Dimensions } from 'react-native';
import globalStyles from '../../styles';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  // Main container
  container: {
    flex: 1,
    backgroundColor: globalStyles.colors.backgroundWarm,
  },
  containerDark: {
    backgroundColor: globalStyles.colors.darkBackground,
  },

  // Header area
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 8,
  },
  title: {
    ...globalStyles.typography.h1,
  },
  subtitle: {
    ...globalStyles.typography.subtitle,
    marginTop: 4,
  },
  textLight: {
    color: globalStyles.colors.darkTextPrimary,
  },

  // Filters Section (Improved)
  filtersContainer: {
    backgroundColor: globalStyles.colors.surface,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: globalStyles.colors.divider,
    ...globalStyles.shadows.sm,
  },
  filterRow: {
    paddingHorizontal: 22,
    marginBottom: 12,
  },
  filterRowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  filterIcon: {
    marginRight: 6,
  },
  filterRowTitle: {
    ...globalStyles.typography.caption,
    color: globalStyles.colors.mediumGray,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  filtersScrollContainer: {
    flexDirection: 'row',
    paddingRight: 16,
  },
  filterChip: {
    backgroundColor: globalStyles.colors.surfaceWarm,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 100,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  filterChipActive: {
    backgroundColor: globalStyles.colors.primaryLight,
    borderColor: globalStyles.colors.primary,
  },
  filterText: {
    ...globalStyles.typography.caption,
    color: globalStyles.colors.darkGray,
  },
  filterTextActive: {
    color: globalStyles.colors.primary,
    fontWeight: '600',
  },

  // Menu list
  menuList: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },

  // Menu card styling
  menuCard: {
    ...globalStyles.cardStyles.rounded,
    marginBottom: 24,
  },
  menuCardDark: {
    backgroundColor: globalStyles.colors.darkSurfaceElevated,
  },
  selectedMenuCard: {
    borderWidth: 2,
    borderColor: globalStyles.colors.primary,
  },
  menuImage: {
    width: '100%',
    height: 220,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },

  // Active indicator
  selectedIndicator: {
    position: 'absolute',
    top: 12,
    left: 12,
    ...globalStyles.badgeStyles.active,
    paddingHorizontal: 16,
    paddingVertical: 6,
    zIndex: 10,
  },
  selectedIndicatorText: {
    ...globalStyles.typography.caption,
    color: globalStyles.colors.primary,
    fontWeight: '600',
  },

  // Badge styling
  badgeContainer: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  premiumBadge: {
    ...globalStyles.badgeStyles.pill,
    ...globalStyles.badgeStyles.premium,
  },
  freeBadge: {
    ...globalStyles.badgeStyles.pill,
    ...globalStyles.badgeStyles.free,
  },
  timeBadge: {
    ...globalStyles.badgeStyles.pill,
    ...globalStyles.badgeStyles.timer,
  },
  badgeText: {
    ...globalStyles.badgeStyles.badgeText,
  },
  badgeTextLight: {
    color: globalStyles.colors.surface,
  },

  // Card content styling
  cardContent: {
    padding: 16,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  cardContentDark: {
    backgroundColor: globalStyles.colors.darkSurfaceElevated,
  },
  menuTitle: {
    ...globalStyles.typography.h3,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  tag: {
    ...globalStyles.badgeStyles.tag,
  },
  tagText: {
    ...globalStyles.typography.caption,
  },

  // Recipe list styling
  recipesSectionContainer: {
    marginTop: 8,
  },
  recipesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: globalStyles.colors.darkGray,
    marginBottom: 12,
  },
  recipeItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  recipeBullet: {
    ...globalStyles.commonUI.bullet,
  },
  recipeItem: {
    ...globalStyles.typography.body2,
  },

  // Modal styling
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: globalStyles.colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '92%',
  },
  modalContentDark: {
    backgroundColor: globalStyles.colors.darkBackground,
  },
  modalImage: {
    width: '100%',
    height: 240,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  closeButton: {
    ...globalStyles.commonUI.closeButton,
  },
  closeButtonDark: {
    backgroundColor: globalStyles.colors.darkSurfaceElevated,
  },

  // Modal header
  modalHeader: {
    padding: 16,
    paddingBottom: 8,
  },
  modalTitle: {
    ...globalStyles.typography.h2,
    marginBottom: 12,
  },
  modalBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },

  // Tabs
  tabButtons: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: globalStyles.colors.divider,
  },
  tabButton: {
    ...globalStyles.tabBarStyles.tab,
  },
  activeTab: {
    ...globalStyles.tabBarStyles.activeTab,
  },
  tabButtonText: {
    ...globalStyles.tabBarStyles.tabText,
  },
  activeTabText: {
    ...globalStyles.tabBarStyles.activeTabText,
  },
  tabContent: {
    padding: 16,
  },

  // Info rows
  infoRow: {
    ...globalStyles.commonUI.infoRow,
  },
  infoIcon: {
    ...globalStyles.commonUI.infoIcon,
  },
  infoText: {
    ...globalStyles.typography.body,
  },

  // Section titles
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: globalStyles.colors.darkGray,
    marginBottom: 16,
    marginTop: 8,
  },

  // Ingredient category styling
  ingredientCategory: {
    marginBottom: 24,
    backgroundColor: globalStyles.colors.backgroundWarm,
    borderRadius: 12,
    padding: 16,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: globalStyles.colors.darkGray,
    marginBottom: 12,
  },
  ingredientItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ingredientItem: {
    fontSize: 14,
    color: globalStyles.colors.darkGray,
  },
  ingredientQuantity: {
    fontSize: 14,
    color: globalStyles.colors.primary,
    fontWeight: '500',
  },

  // Action buttons
  selectButton: {
    ...globalStyles.buttonStyles.primary,
    margin: 16,
  },
  selectedButton: {
    backgroundColor: globalStyles.colors.error,
  },
  selectButtonText: {
    ...globalStyles.typography.button,
    color: globalStyles.colors.surface,
  },
  customizeButton: {
    ...globalStyles.buttonStyles.secondary,
    marginHorizontal: 16,
    marginBottom: 24,
    marginTop: 0,
  },
  customizeButtonText: {
    ...globalStyles.typography.button,
    color: globalStyles.colors.primary,
  },

  // Loading state
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    ...globalStyles.typography.body,
    marginTop: 16,
    textAlign: 'center',
  },
});