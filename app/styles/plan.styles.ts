// app/styles/plan.styles.ts

import { StyleSheet } from 'react-native';
import styles from '../../styles';

// For convenience, reference the main styles
const globalStyles = styles;

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: globalStyles.colors.background,
  },
  containerDark: {
    backgroundColor: globalStyles.colors.darkBackground,
  },
  header: {
    paddingHorizontal: globalStyles.spacing.md,
    paddingVertical: globalStyles.spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: globalStyles.colors.lightGray,
  },
  headerLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    ...globalStyles.typography.body,
    fontWeight: '600',
  },
  resetButton: {
    padding: globalStyles.spacing.xs,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: globalStyles.spacing.sm,
    flex: 1,
  },
  progressText: {
    ...globalStyles.typography.caption,
    marginRight: globalStyles.spacing.xs,
  },
  progressBar: {
    height: 3,
    flex: 1,
    maxWidth: 80,
    backgroundColor: globalStyles.colors.lightGray,
    borderRadius: globalStyles.borderRadius.xs,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: globalStyles.colors.success,
  },
  phaseChipsContainer: {
    paddingVertical: globalStyles.spacing.sm,
    paddingHorizontal: globalStyles.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: globalStyles.colors.lightGray,
    backgroundColor: '#FCFCFC',
  },
  phaseChipsScroll: {
    flexDirection: 'row',
  },
  phaseChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: globalStyles.colors.surface,
    paddingVertical: 8,
    paddingHorizontal: globalStyles.spacing.md,
    borderRadius: 18,
    marginRight: globalStyles.spacing.sm,
    borderWidth: 1,
    borderColor: globalStyles.colors.lightGray,
    ...globalStyles.shadows.sm,
  },
  phaseChipActive: {
    backgroundColor: '#4A6FA5', // A more pleasing blue
    borderColor: '#4A6FA5',
  },
  phaseChipText: {
    ...globalStyles.typography.caption,
    color: globalStyles.colors.darkGray,
    fontWeight: '500',
  },
  phaseChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  phaseChipDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#5CB85C', // A cleaner green
    marginRight: 6,
  },
  phaseSelectModal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  phaseSelectContainer: {
    backgroundColor: globalStyles.colors.surface,
    borderTopLeftRadius: globalStyles.borderRadius.lg,
    borderTopRightRadius: globalStyles.borderRadius.lg,
    paddingBottom: 30, // For bottom safe area
  },
  phaseSelectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: globalStyles.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: globalStyles.colors.lightGray,
  },
  phaseSelectHeaderText: {
    ...globalStyles.typography.h4,
  },
  phaseSelectList: {
    maxHeight: 300,
  },
  phaseSelectItem: {
    paddingVertical: globalStyles.spacing.md,
    paddingHorizontal: globalStyles.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: globalStyles.colors.lightGray,
  },
  phaseSelectItemActive: {
    backgroundColor: globalStyles.colors.primaryLight,
  },
  phaseSelectItemText: {
    ...globalStyles.typography.body,
  },
  toggleCompletedContainer: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: globalStyles.colors.surface,
    borderRadius: 50,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    ...globalStyles.shadows.md,
  },
  toggleCompletedText: {
    ...globalStyles.typography.caption,
    marginLeft: globalStyles.spacing.xs,
    color: globalStyles.colors.mediumGray,
  },
  content: {
    flex: 1,
  },
  taskList: {
    padding: globalStyles.spacing.md,
  },
  sectionContainer: {
    marginBottom: globalStyles.spacing.md,
  },
  sectionTitle: {
    ...globalStyles.typography.caption,
    fontWeight: '600',
    marginBottom: globalStyles.spacing.xs,
    color: globalStyles.colors.mediumGray,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  taskCard: {
    backgroundColor: globalStyles.colors.surface,
    padding: globalStyles.spacing.md,
    borderRadius: globalStyles.borderRadius.md,
    marginBottom: globalStyles.spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: '#7E94B4', // Softer blue for better aesthetics
    ...globalStyles.shadows.sm,
  },
  taskCardDark: {
    backgroundColor: globalStyles.colors.darkSurface,
  },
  taskCardCompleted: {
    backgroundColor: globalStyles.colors.background,
    borderLeftColor: '#5CB85C',
    opacity: 0.7,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  taskContent: {
    flex: 1,
    paddingRight: globalStyles.spacing.sm,
  },
  taskTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  taskTime: {
    ...globalStyles.typography.caption,
    color: globalStyles.colors.mediumGray,
    marginLeft: 6,
    fontSize: 10,
  },
  taskInstruction: {
    ...globalStyles.typography.body,
    fontSize: 15,
    lineHeight: 20,
    marginBottom: 2,
  },
  taskActions: {
    alignItems: 'center',
    paddingLeft: globalStyles.spacing.xs,
  },
  completedIcon: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerButtonContainer: {
    marginTop: globalStyles.spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
  },
  timerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: globalStyles.colors.primaryLight,
    paddingVertical: 4,
    paddingHorizontal: globalStyles.spacing.sm,
    borderRadius: globalStyles.borderRadius.pill,
  },
  timerButtonActive: {
    backgroundColor: globalStyles.colors.error,
  },
  timerButtonText: {
    ...globalStyles.typography.caption,
    fontWeight: '500',
    marginLeft: 4,
    color: globalStyles.colors.primary,
    fontSize: 11,
  },
  timerButtonTextActive: {
    color: globalStyles.colors.darkTextPrimary,
  },
  timerOverlay: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    flexDirection: 'row',
    borderRadius: globalStyles.borderRadius.md,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: globalStyles.spacing.xs,
    ...globalStyles.shadows.md,
  },
  timerCount: {
    ...globalStyles.typography.caption,
    color: '#FFFFFF',
    marginLeft: 4,
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