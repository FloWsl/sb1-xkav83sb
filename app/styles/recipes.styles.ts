// app/styles/recipes.styles.ts

import { StyleSheet } from 'react-native';
import globalStyles from '../../styles';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCFCFC',
  },
  containerDark: {
    backgroundColor: globalStyles.colors.darkBackground,
  },
  header: {
    paddingHorizontal: globalStyles.spacing.md,
    paddingVertical: globalStyles.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: globalStyles.colors.lightGray,
  },
  title: {
    ...globalStyles.typography.body,
    fontWeight: '600',
    marginBottom: 2,
  },
  planName: {
    ...globalStyles.typography.caption,
    color: globalStyles.colors.mediumGray,
  },
  textLight: {
    color: globalStyles.colors.darkTextPrimary,
  },
  textLightSecondary: {
    color: globalStyles.colors.darkTextSecondary,
  },
  recipesTitle: {
    ...globalStyles.typography.body,
    fontWeight: '600',
    marginHorizontal: globalStyles.spacing.md,
    marginTop: globalStyles.spacing.md,
    marginBottom: globalStyles.spacing.sm,
    color: '#4A6FA5',
  },
  equipmentContainer: {
    paddingVertical: globalStyles.spacing.sm,
    paddingHorizontal: globalStyles.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  equipmentRow: {
    flexDirection: 'row',
    paddingVertical: globalStyles.spacing.sm,
    gap: globalStyles.spacing.sm,
  },
  equipmentItem: {
    alignItems: 'center',
    backgroundColor: globalStyles.colors.surface,
    padding: globalStyles.spacing.sm,
    borderRadius: globalStyles.borderRadius.md,
    width: 100,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    ...globalStyles.shadows.sm,
  },
  equipmentItemDark: {
    backgroundColor: globalStyles.colors.darkSurface,
    borderColor: '#333333',
  },
  equipmentName: {
    marginTop: globalStyles.spacing.xs,
    ...globalStyles.typography.caption,
    fontWeight: '500',
    textAlign: 'center',
  },
  equipmentDescription: {
    marginTop: globalStyles.spacing.xs,
    ...globalStyles.typography.caption,
    fontSize: 10,
    textAlign: 'center',
    color: globalStyles.colors.mediumGray,
  },
  recipesGrid: {
    padding: globalStyles.spacing.md,
  },
  recipeCard: {
    backgroundColor: globalStyles.colors.surface,
    borderRadius: globalStyles.borderRadius.md,
    marginBottom: globalStyles.spacing.md,
    overflow: 'hidden',
    ...globalStyles.shadows.sm,
    padding: globalStyles.spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: '#7E94B4',
  },
  recipeCardDark: {
    backgroundColor: globalStyles.colors.darkSurface,
  },
  selectedRecipeCard: {
    borderLeftColor: '#4A6FA5',
    borderLeftWidth: 5,
    backgroundColor: '#F7FAFD',
  },
  recipeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recipeName: {
    ...globalStyles.typography.body,
    fontWeight: '600',
    flex: 1,
  },
  servingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EDF2F9',
    paddingHorizontal: globalStyles.spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
  },
  servingText: {
    ...globalStyles.typography.caption,
    fontSize: 11,
    color: '#4A6FA5',
  },
  recipeDetails: {
    marginTop: globalStyles.spacing.md,
    paddingTop: globalStyles.spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  section: {
    marginBottom: globalStyles.spacing.md,
  },
  sectionTitle: {
    ...globalStyles.typography.body,
    fontWeight: '600',
    marginBottom: globalStyles.spacing.sm,
    color: '#4A6FA5',
  },
  ingredientText: {
    ...globalStyles.typography.body2,
    marginBottom: globalStyles.spacing.xs,
    fontSize: 14,
    lineHeight: 20,
  },
  instructionText: {
    ...globalStyles.typography.body2,
    marginBottom: globalStyles.spacing.sm,
    lineHeight: 20,
    fontSize: 14,
  },
  notesText: {
    ...globalStyles.typography.body2,
    fontStyle: 'italic',
    color: globalStyles.colors.mediumGray,
    fontSize: 14,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: globalStyles.spacing.xl,
    backgroundColor: '#FCFCFC',
  },
  emptyStateIcon: {
    width: 120,
    height: 120,
    marginBottom: globalStyles.spacing.lg,
    opacity: 0.85,
  },
  emptyStateTitle: {
    ...globalStyles.typography.h3,
    marginBottom: globalStyles.spacing.md,
    textAlign: 'center',
    color: '#4A6FA5',
    fontWeight: '600',
  },
  emptyStateText: {
    ...globalStyles.typography.body,
    textAlign: 'center',
    color: globalStyles.colors.mediumGray,
    marginBottom: globalStyles.spacing.xl,
    lineHeight: 22,
    maxWidth: 300,
  },
  browseButton: {
    backgroundColor: '#5CB85C',
    paddingVertical: 12,
    paddingHorizontal: globalStyles.spacing.xl,
    borderRadius: 25,
    ...globalStyles.shadows.md,
  },
  browseButtonText: {
    color: '#FFFFFF',
    ...globalStyles.typography.button,
    fontWeight: '600',
  },
});