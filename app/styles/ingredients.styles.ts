// app/styles/ingredients.styles.ts

import { StyleSheet } from 'react-native';
import globalStyles from '../../styles';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: globalStyles.colors.backgroundWarm,
  },
  containerDark: {
    backgroundColor: globalStyles.colors.darkBackground,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    ...globalStyles.typography.h1,
  },
  textLight: {
    color: globalStyles.colors.darkTextPrimary,
  },
  copyButton: {
    padding: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: globalStyles.colors.surface,
    marginHorizontal: 24,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: globalStyles.borderRadius.md,
    ...globalStyles.shadows.sm,
  },
  searchBarDark: {
    backgroundColor: globalStyles.colors.darkSurfaceElevated,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: globalStyles.colors.darkGray,
  },
  searchInputDark: {
    color: globalStyles.colors.darkTextPrimary,
  },
  content: {
    flex: 1,
  },
  categorySection: {
    marginBottom: 24,
    paddingHorizontal: 24,
  },
  categoryTitle: {
    ...globalStyles.typography.h3,
    marginBottom: 12,
  },
  ingredientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: globalStyles.colors.surface,
    padding: 16,
    borderRadius: globalStyles.borderRadius.md,
    marginBottom: 12,
    ...globalStyles.shadows.sm,
  },
  ingredientCardDark: {
    backgroundColor: globalStyles.colors.darkSurfaceElevated,
  },
  ingredientCardChecked: {
    opacity: 0.6,
    backgroundColor: globalStyles.colors.surfaceWarm,
  },
  checkboxContainer: {
    marginRight: 16,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: globalStyles.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: globalStyles.colors.primary,
  },
  ingredientInfo: {
    flex: 1,
  },
  ingredientName: {
    ...globalStyles.typography.body,
    marginBottom: 4,
  },
  ingredientQuantity: {
    ...globalStyles.typography.body2,
  },
  ingredientTextChecked: {
    textDecorationLine: 'line-through',
    color: globalStyles.colors.mediumGray,
  },
  recipeTag: {
    backgroundColor: globalStyles.colors.surfaceCool,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: globalStyles.borderRadius.xs,
    fontSize: 12,
    color: globalStyles.colors.secondary,
    marginLeft: 8,
  },
  recipeTagDark: {
    backgroundColor: '#1A237E',
    color: '#90CAF9',
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: globalStyles.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...globalStyles.shadows.md,
  },
  fabDark: {
    backgroundColor: globalStyles.colors.primaryDark,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyStateText: {
    ...globalStyles.typography.body,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  addItemModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 24,
  },
  addItemModalDark: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    backgroundColor: globalStyles.colors.surface,
    borderRadius: globalStyles.borderRadius.lg,
    padding: 24,
    ...globalStyles.shadows.lg,
  },
  modalContentDark: {
    backgroundColor: globalStyles.colors.darkSurfaceElevated,
  },
  modalTitle: {
    ...globalStyles.typography.h3,
    marginBottom: 24,
    textAlign: 'center',
  },
  modalInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: globalStyles.borderRadius.sm,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  modalInputDark: {
    backgroundColor: '#333333',
    color: globalStyles.colors.darkTextPrimary,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: globalStyles.borderRadius.sm,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
    marginRight: 8,
  },
  addButton: {
    backgroundColor: globalStyles.colors.primary,
    marginLeft: 8,
  },
  cancelButtonText: {
    color: globalStyles.colors.mediumGray,
    fontSize: 16,
    fontWeight: '600',
  },
  addButtonText: {
    color: globalStyles.colors.surface,
    fontSize: 16,
    fontWeight: '600',
  },
  premiumPrompt: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  premiumTitle: {
    ...globalStyles.typography.h2,
    marginTop: 16,
    marginBottom: 12,
  },
  premiumText: {
    ...globalStyles.typography.body,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  upgradeButton: {
    ...globalStyles.buttonStyles.primary,
    backgroundColor: globalStyles.colors.accentPink,
    paddingHorizontal: 24,
    paddingVertical: 12,
    height: 'auto',
  },
  upgradeButtonText: {
    ...globalStyles.typography.button,
    color: globalStyles.colors.darkGray,
  },
  browseButton: {
    ...globalStyles.buttonStyles.primary,
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
    height: 'auto',
  },
  browseButtonText: {
    ...globalStyles.typography.button,
    color: globalStyles.colors.surface,
  },
});