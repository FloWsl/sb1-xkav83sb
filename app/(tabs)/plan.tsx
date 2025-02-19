import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
  FlatList,
  Alert,
  ActivityIndicator,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import useBatchCooking from '../../hooks/useBatchCooking';
import styles from '../../styles';
import { useRouter } from 'expo-router';
import type { Phase, Section, Task } from '../../types/schema';

const { width } = Dimensions.get('window');

export default function PlanScreen() {
  // Get batch cooking logic
  const {
    activePlanId,
    planData,
    isLoading,
    error,
    currentPhase,
    completedTasks,
    activeTimers,
    setPhase,
    completeTask,
    uncompleteTask,
    isTaskCompleted,
    startTimer,
    pauseTimer,
    resumeTimer,
    cancelTimer,
    addTimeToTimer,
    calculateProgress,
    getAllPhases,
    clearActivePlan,
  } = useBatchCooking();

  // Local state
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [showCompletedTasks, setShowCompletedTasks] = useState(false);
  const [expandedTimers, setExpandedTimers] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const themeColors = styles.getThemeColors(colorScheme);
  const phaseListRef = useRef<FlatList>(null);
  const router = useRouter();

  // Get phases from plan data
  const phases = planData?.b?.p || [];

  // Update current phase index when currentPhase changes
  useEffect(() => {
    if (currentPhase && phases.length > 0) {
      const index = phases.findIndex((phase) => phase.num === currentPhase);
      if (index !== -1) {
        setCurrentPhaseIndex(index);
        // Scroll phase list to current phase
        phaseListRef.current?.scrollToIndex({
          index,
          animated: true,
          viewPosition: 0.5,
        });
      }
    }
  }, [currentPhase, phases]);

  // Reset cooking session
  const resetSession = () => {
    Alert.alert(
      'Réinitialiser la session',
      'Voulez-vous vraiment recommencer depuis le début ? Tous vos progrès seront perdus.',
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Réinitialiser',
          style: 'destructive',
          onPress: () => {
            clearActivePlan();
            router.replace('/');
          },
        },
      ]
    );
  };

  // Toggle task completion
  const toggleTask = (taskId: string) => {
    if (isTaskCompleted(taskId)) {
      uncompleteTask(taskId);
    } else {
      completeTask(taskId);

      // Check if phase is complete
      const currentPhaseObj = phases[currentPhaseIndex];
      if (currentPhaseObj) {
        let totalTasks = 0;
        let completedTaskCount = 0;

        currentPhaseObj.sec.forEach((section) => {
          section.t.forEach((task) => {
            const taskKey = `${currentPhaseObj.num}-${task.t}-${task.i}`;
            totalTasks++;
            if (isTaskCompleted(taskKey) || taskId === taskKey) {
              completedTaskCount++;
            }
          });
        });

        if (completedTaskCount === totalTasks) {
          // Phase complete, show alert
          if (currentPhaseIndex < phases.length - 1) {
            setTimeout(() => {
              Alert.alert(
                'Phase terminée !',
                'Voulez-vous passer à la phase suivante ?',
                [
                  {
                    text: 'Rester ici',
                    style: 'cancel',
                  },
                  {
                    text: 'Phase suivante',
                    onPress: () => handlePhaseChange(currentPhaseIndex + 1),
                  },
                ]
              );
            }, 500);
          }
        }
      }
    }
  };

  // Handle phase change
  const handlePhaseChange = (index: number) => {
    if (index >= 0 && index < phases.length) {
      setCurrentPhaseIndex(index);
      setPhase(phases[index].num);
      phaseListRef.current?.scrollToIndex({
        index,
        animated: true,
        viewPosition: 0.5,
      });
    }
  };

  // Start a timer for a task
  const handleStartTimer = (task: Task) => {
    // Extract duration in minutes from task time (format: "10min")
    const durationMatch = task.t.match(/(\d+)/);
    if (durationMatch && durationMatch[1]) {
      const minutes = parseInt(durationMatch[1], 10);
      const seconds = minutes * 60;
      const timerId = startTimer(task.i, seconds);

      Alert.alert(
        'Minuteur démarré',
        `Un minuteur de ${minutes} minute${
          minutes > 1 ? 's' : ''
        } a été démarré pour "${task.i}".`,
        [{ text: 'OK' }]
      );
    }
  };

  // Render empty state when no plan is active
  if (!activePlanId || !planData) {
    return (
      <SafeAreaView
        style={[localStyles.container, isDark && localStyles.containerDark]}
      >
        <View style={localStyles.emptyStateContainer}>
          <Ionicons
            name="restaurant-outline"
            size={80}
            color={isDark ? '#555555' : '#CCCCCC'}
          />
          <Text
            style={[
              localStyles.emptyStateTitle,
              isDark && localStyles.textLight,
            ]}
          >
            Aucun plan actif
          </Text>
          <Text
            style={[
              localStyles.emptyStateText,
              isDark && localStyles.textLight,
            ]}
          >
            Prêt à cuisiner ? Choisissez d'abord un plan de batch cooking dans
            l'onglet Découverte.
          </Text>
          <TouchableOpacity
            style={localStyles.browseButton}
            onPress={() => router.replace('/')}
          >
            <Text style={localStyles.browseButtonText}>
              PARCOURIR LES PLANS
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Show loading indicator
  if (isLoading) {
    return (
      <SafeAreaView
        style={[localStyles.container, isDark && localStyles.containerDark]}
      >
        <View style={localStyles.loadingContainer}>
          <ActivityIndicator size="large" color={themeColors.primary} />
          <Text
            style={[localStyles.loadingText, isDark && localStyles.textLight]}
          >
            Chargement du plan de cuisine...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Show error state
  if (error) {
    return (
      <SafeAreaView
        style={[localStyles.container, isDark && localStyles.containerDark]}
      >
        <View style={localStyles.errorContainer}>
          <Ionicons
            name="alert-circle-outline"
            size={80}
            color={themeColors.error}
          />
          <Text
            style={[localStyles.errorTitle, isDark && localStyles.textLight]}
          >
            Erreur
          </Text>
          <Text
            style={[localStyles.errorText, isDark && localStyles.textLight]}
          >
            {error}
          </Text>
          <TouchableOpacity
            style={localStyles.errorButton}
            onPress={() => router.replace('/')}
          >
            <Text style={localStyles.errorButtonText}>RETOUR À L'ACCUEIL</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Render phase item for horizontal scroll
  const renderPhaseItem = ({ item, index }: { item: Phase; index: number }) => {
    // Count completed tasks in phase
    let totalTasks = 0;
    let completedTaskCount = 0;

    item.sec.forEach((section) => {
      section.t.forEach((task) => {
        const taskId = `${item.num}-${task.t}-${task.i}`;
        totalTasks++;
        if (isTaskCompleted(taskId)) {
          completedTaskCount++;
        }
      });
    });

    const progress =
      totalTasks > 0 ? Math.round((completedTaskCount / totalTasks) * 100) : 0;

    return (
      <TouchableOpacity
        style={[
          localStyles.phaseButton,
          currentPhaseIndex === index && localStyles.phaseButtonActive,
          isDark && localStyles.phaseButtonDark,
          currentPhaseIndex === index &&
            isDark &&
            localStyles.phaseButtonActiveDark,
        ]}
        onPress={() => handlePhaseChange(index)}
      >
        <Text
          style={[
            localStyles.phaseButtonText,
            currentPhaseIndex === index && localStyles.phaseButtonTextActive,
            isDark && localStyles.textLight,
          ]}
        >
          {item.n}
        </Text>
        <Text style={[localStyles.phaseTime, isDark && localStyles.textLight]}>
          {item.st} - {item.en}
        </Text>
        <View style={localStyles.progressBarBackground}>
          <View
            style={[localStyles.progressBarFill, { width: `${progress}%` }]}
          />
        </View>
      </TouchableOpacity>
    );
  };

  // Render task card
  const renderTask = (task: Task, phase: Phase, section: Section) => {
    const taskId = `${phase.num}-${task.t}-${task.i}`;
    const isCompleted = isTaskCompleted(taskId);

    // Don't render completed tasks if showCompletedTasks is false
    if (isCompleted && !showCompletedTasks) {
      return null;
    }

    // Check if there's an active timer for this task
    const taskTimer = activeTimers.find((timer) => timer.name === task.i);

    return (
      <View
        key={taskId}
        style={[
          localStyles.taskCard,
          isDark && localStyles.taskCardDark,
          isCompleted && localStyles.taskCardCompleted,
          task.pr === 'high' && localStyles.taskCardPriorityHigh,
          task.pr === 'medium' && localStyles.taskCardPriorityMedium,
          task.pr === 'low' && localStyles.taskCardPriorityLow,
        ]}
      >
        <View style={localStyles.taskHeader}>
          <View style={localStyles.taskTimeContainer}>
            <Ionicons
              name="time-outline"
              size={24}
              color={isDark ? '#FFFFFF' : '#000000'}
            />
            <Text
              style={[localStyles.taskTime, isDark && localStyles.textLight]}
            >
              {task.t}
            </Text>
          </View>

          <View style={localStyles.taskActions}>
            {!taskTimer && !isCompleted && (
              <TouchableOpacity
                style={localStyles.timerButton}
                onPress={() => handleStartTimer(task)}
              >
                <Ionicons
                  name="timer-outline"
                  size={24}
                  color={themeColors.secondary}
                />
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={localStyles.checkButton}
              onPress={() => toggleTask(taskId)}
            >
              <Ionicons
                name={
                  isCompleted ? 'checkmark-circle' : 'checkmark-circle-outline'
                }
                size={28}
                color={
                  isCompleted ? themeColors.success : themeColors.mediumGray
                }
              />
            </TouchableOpacity>
          </View>
        </View>

        <Text
          style={[
            localStyles.taskInstruction,
            isDark && localStyles.textLight,
            isCompleted && localStyles.taskCompletedText,
          ]}
        >
          {task.i}
        </Text>

        {taskTimer && (
          <View style={localStyles.activeTimerContainer}>
            <View style={localStyles.timerRow}>
              <Ionicons
                name="alarm-outline"
                size={20}
                color={themeColors.secondary}
              />
              <Text style={localStyles.timerText}>
                {taskTimer.isPaused ? 'En pause' : 'En cours'}
              </Text>

              <View style={localStyles.timerControls}>
                {taskTimer.isPaused ? (
                  <TouchableOpacity
                    style={localStyles.timerControlButton}
                    onPress={() => resumeTimer(taskTimer.id)}
                  >
                    <Ionicons
                      name="play"
                      size={20}
                      color={themeColors.success}
                    />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={localStyles.timerControlButton}
                    onPress={() => pauseTimer(taskTimer.id)}
                  >
                    <Ionicons
                      name="pause"
                      size={20}
                      color={themeColors.warning}
                    />
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={localStyles.timerControlButton}
                  onPress={() => cancelTimer(taskTimer.id)}
                >
                  <Ionicons name="close" size={20} color={themeColors.error} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </View>
    );
  };

  // Render current phase
  const renderCurrentPhase = () => {
    if (!phases.length || currentPhaseIndex >= phases.length) {
      return null;
    }

    const currentPhaseObj = phases[currentPhaseIndex];

    return (
      <View style={localStyles.phaseContainer}>
        {currentPhaseObj.sec.map((section, sectionIndex) => {
          // Check if section has any uncompleted tasks or if we're showing completed tasks
          const hasTasks = section.t.some((task) => {
            const taskId = `${currentPhaseObj.num}-${task.t}-${task.i}`;
            return !isTaskCompleted(taskId) || showCompletedTasks;
          });

          if (!hasTasks) {
            return null;
          }

          return (
            <View
              key={`${currentPhaseObj.num}-${sectionIndex}`}
              style={localStyles.sectionContainer}
            >
              <Text
                style={[
                  localStyles.sectionTitle,
                  isDark && localStyles.textLight,
                ]}
              >
                {section.n}
              </Text>
              {section.t.map((task) =>
                renderTask(task, currentPhaseObj, section)
              )}
            </View>
          );
        })}
      </View>
    );
  };

  // Render active timers section
  const renderActiveTimers = () => {
    if (activeTimers.length === 0) {
      return null;
    }

    return (
      <View
        style={[
          localStyles.activeTimersContainer,
          isDark && localStyles.activeTimersContainerDark,
          !expandedTimers && localStyles.activeTimersCollapsed,
        ]}
      >
        <TouchableOpacity
          style={localStyles.expandTimersButton}
          onPress={() => setExpandedTimers(!expandedTimers)}
        >
          <View style={localStyles.expandTimersHeader}>
            <Ionicons
              name="alarm-outline"
              size={24}
              color={themeColors.secondary}
            />
            <Text style={localStyles.expandTimersText}>
              {activeTimers.length} Minuteur{activeTimers.length > 1 ? 's' : ''}{' '}
              actif{activeTimers.length > 1 ? 's' : ''}
            </Text>
          </View>
          <Ionicons
            name={expandedTimers ? 'chevron-down' : 'chevron-up'}
            size={24}
            color={themeColors.mediumGray}
          />
        </TouchableOpacity>

        {expandedTimers && (
          <View style={localStyles.timersList}>
            {activeTimers.map((timer) => (
              <View key={timer.id} style={localStyles.timerItem}>
                <Text
                  style={localStyles.timerItemName}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {timer.name}
                </Text>
                <View style={localStyles.timerItemControls}>
                  {timer.isPaused ? (
                    <TouchableOpacity
                      style={localStyles.timerItemButton}
                      onPress={() => resumeTimer(timer.id)}
                    >
                      <Ionicons
                        name="play"
                        size={20}
                        color={themeColors.success}
                      />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={localStyles.timerItemButton}
                      onPress={() => pauseTimer(timer.id)}
                    >
                      <Ionicons
                        name="pause"
                        size={20}
                        color={themeColors.warning}
                      />
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity
                    style={localStyles.timerItemButton}
                    onPress={() => cancelTimer(timer.id)}
                  >
                    <Ionicons
                      name="close"
                      size={20}
                      color={themeColors.error}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  // Calculate progress for current phase
  const getCurrentPhaseProgress = () => {
    if (!phases.length || currentPhaseIndex >= phases.length) {
      return { completed: 0, total: 0 };
    }

    const currentPhaseObj = phases[currentPhaseIndex];
    let total = 0;
    let completed = 0;

    currentPhaseObj.sec.forEach((section) => {
      section.t.forEach((task) => {
        const taskId = `${currentPhaseObj.num}-${task.t}-${task.i}`;
        total++;
        if (isTaskCompleted(taskId)) {
          completed++;
        }
      });
    });

    return { completed, total };
  };

  const currentProgress = getCurrentPhaseProgress();
  const overallProgress = calculateProgress();

  return (
    <SafeAreaView
      style={[localStyles.container, isDark && localStyles.containerDark]}
    >
      <View style={localStyles.header}>
        <View style={localStyles.headerTop}>
          <Text style={[localStyles.title, isDark && localStyles.textLight]}>
            Plan de cuisine
          </Text>
          <TouchableOpacity
            style={localStyles.resetButton}
            onPress={resetSession}
          >
            <Ionicons
              name="refresh-circle-outline"
              size={28}
              color={isDark ? '#FFFFFF' : '#000000'}
            />
          </TouchableOpacity>
        </View>

        <View style={localStyles.progressContainer}>
          <Text
            style={[localStyles.progressText, isDark && localStyles.textLight]}
          >
            Phase {currentPhaseIndex + 1}: {currentProgress.completed}/
            {currentProgress.total} tâches
          </Text>
          <Text
            style={[
              localStyles.overallProgressText,
              isDark && localStyles.textLight,
            ]}
          >
            Progression totale: {overallProgress}%
          </Text>
        </View>

        <View style={localStyles.progressBarContainer}>
          <View
            style={[
              localStyles.progressBarFull,
              { width: `${overallProgress}%` },
            ]}
          />
        </View>
      </View>

      <FlatList
        ref={phaseListRef}
        data={phases}
        renderItem={renderPhaseItem}
        keyExtractor={(item) => item.num}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={localStyles.phaseList}
        snapToAlignment="center"
        decelerationRate="fast"
        onScrollToIndexFailed={() => {}}
        initialScrollIndex={currentPhaseIndex}
      />

      <View style={localStyles.controlRow}>
        <TouchableOpacity
          style={[
            localStyles.toggleButton,
            showCompletedTasks && localStyles.toggleButtonActive,
          ]}
          onPress={() => setShowCompletedTasks(!showCompletedTasks)}
        >
          <Ionicons
            name={showCompletedTasks ? 'eye-outline' : 'eye-off-outline'}
            size={20}
            color={
              showCompletedTasks ? themeColors.primary : themeColors.mediumGray
            }
          />
          <Text
            style={[
              localStyles.toggleButtonText,
              showCompletedTasks && localStyles.toggleButtonTextActive,
            ]}
          >
            {showCompletedTasks ? 'Masquer terminées' : 'Afficher terminées'}
          </Text>
        </TouchableOpacity>

        {currentPhaseIndex > 0 && (
          <TouchableOpacity
            style={localStyles.navButton}
            onPress={() => handlePhaseChange(currentPhaseIndex - 1)}
          >
            <Ionicons
              name="arrow-back"
              size={20}
              color={themeColors.mediumGray}
            />
            <Text style={localStyles.navButtonText}>Phase précédente</Text>
          </TouchableOpacity>
        )}

        {currentPhaseIndex < phases.length - 1 && (
          <TouchableOpacity
            style={localStyles.navButton}
            onPress={() => handlePhaseChange(currentPhaseIndex + 1)}
          >
            <Text style={localStyles.navButtonText}>Phase suivante</Text>
            <Ionicons
              name="arrow-forward"
              size={20}
              color={themeColors.mediumGray}
            />
          </TouchableOpacity>
        )}
      </View>

      {renderActiveTimers()}

      <ScrollView
        style={localStyles.content}
        showsVerticalScrollIndicator={false}
      >
        {renderCurrentPhase()}

        {currentProgress.completed === currentProgress.total &&
          currentProgress.total > 0 && (
            <View
              style={[
                localStyles.phaseComplete,
                isDark && localStyles.phaseCompleteDark,
              ]}
            >
              <Ionicons name="checkmark-circle" size={48} color="#4CAF50" />
              <Text
                style={[
                  localStyles.phaseCompleteText,
                  isDark && localStyles.textLight,
                ]}
              >
                Phase terminée !
              </Text>
              {currentPhaseIndex < phases.length - 1 && (
                <TouchableOpacity
                  style={localStyles.nextPhaseButton}
                  onPress={() => handlePhaseChange(currentPhaseIndex + 1)}
                >
                  <Text style={localStyles.nextPhaseButtonText}>
                    Passer à la phase suivante
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
      </ScrollView>
    </SafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  containerDark: {
    backgroundColor: '#000000',
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  resetButton: {
    padding: 8,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  progressText: {
    fontSize: 16,
    color: '#666666',
  },
  overallProgressText: {
    fontSize: 14,
    color: '#666666',
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressBarFull: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  textLight: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  phaseList: {
    paddingHorizontal: 10,
    gap: 10,
    paddingVertical: 5,
  },
  phaseButton: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    width: width * 0.4,
    marginHorizontal: 5,
  },
  phaseButtonDark: {
    backgroundColor: '#1A1A1A',
  },
  phaseButtonActive: {
    backgroundColor: '#FF6B6B',
  },
  phaseButtonActiveDark: {
    backgroundColor: '#FF6B6B',
  },
  phaseButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  phaseButtonTextActive: {
    color: '#FFFFFF',
  },
  phaseTime: {
    fontSize: 12,
    color: '#666666',
    marginTop: 4,
  },
  progressBarBackground: {
    height: 4,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 2,
    width: '90%',
    marginTop: 8,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  controlRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  toggleButtonActive: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  toggleButtonText: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 6,
  },
  toggleButtonTextActive: {
    color: '#4CAF50',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  navButtonText: {
    fontSize: 14,
    color: '#666666',
  },
  phaseContainer: {
    padding: 20,
  },
  sectionContainer: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
  },
  taskCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    minHeight: 100,
    borderLeftWidth: 4,
    borderLeftColor: '#E0E0E0',
  },
  taskCardDark: {
    backgroundColor: '#1A1A1A',
  },
  taskCardCompleted: {
    backgroundColor: '#F5F5F5',
    borderLeftColor: '#4CAF50',
  },
  taskCardPriorityHigh: {
    borderLeftColor: '#F44336',
  },
  taskCardPriorityMedium: {
    borderLeftColor: '#FF9800',
  },
  taskCardPriorityLow: {
    borderLeftColor: '#2196F3',
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  taskTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  taskTime: {
    fontSize: 16,
    fontWeight: '500',
  },
  taskActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  timerButton: {
    padding: 5,
  },
  checkButton: {
    padding: 5,
  },
  taskInstruction: {
    fontSize: 18,
    lineHeight: 24,
  },
  taskCompletedText: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  activeTimerContainer: {
    marginTop: 15,
    padding: 10,
    backgroundColor: 'rgba(255, 152, 0, 0.1)',
    borderRadius: 8,
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timerText: {
    fontSize: 14,
    color: '#FF9800',
    fontWeight: '500',
    flex: 1,
  },
  timerControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  timerControlButton: {
    padding: 5,
  },
  activeTimersContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    margin: 10,
    marginBottom: 0,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  activeTimersContainerDark: {
    backgroundColor: '#1A1A1A',
  },
  activeTimersCollapsed: {
    maxHeight: 60,
  },
  expandTimersButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  expandTimersHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  expandTimersText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666666',
  },
  timersList: {
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  timerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  timerItemName: {
    fontSize: 14,
    color: '#333333',
    flex: 1,
    marginRight: 10,
  },
  timerItemControls: {
    flexDirection: 'row',
    gap: 15,
  },
  timerItemButton: {
    padding: 5,
  },
  phaseComplete: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  phaseCompleteDark: {
    backgroundColor: '#1A1A1A',
  },
  phaseCompleteText: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 10,
  },
  nextPhaseButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 15,
  },
  nextPhaseButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  emptyStateTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666666',
    marginBottom: 30,
  },
  browseButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  browseButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  loadingText: {
    fontSize: 18,
    marginTop: 20,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666666',
    marginBottom: 30,
  },
  errorButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  errorButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
