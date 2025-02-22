// app/[tabs]/plan.tsx

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import useBatchCooking from '../../hooks/useBatchCooking';
import { usePlanStore } from '../../store/planStore';
import styles from '../../styles';
import { useRouter } from 'expo-router';
import type { Phase, Section, Task } from '../../types/schema';
import localStyles from '../styles/plan.styles';

export default function PlanScreen() {
  // Get batch cooking logic
  const {
    activePlanId,
    planData,
    isLoading,
    error,
    currentPhase,
    completedTasks,
    setPhase,
    completeTask,
    uncompleteTask,
    isTaskCompleted,
    calculateProgress,
    clearActivePlan,
    isInitialized,
    startTimer,
    activeTimers,
    isTimerActive,
  } = useBatchCooking();

  // Also get the plan from the global store
  const { selectedPlanId, clearPlanData } = usePlanStore();

  // Local state
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [showCompletedTasks, setShowCompletedTasks] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);
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
      }
    }
  }, [currentPhase, phases]);

  const handlePhaseChange = (index: number) => {
    if (index >= 0 && index < phases.length) {
      setCurrentPhaseIndex(index);
      setPhase(phases[index].num);
    }
  };

  // Handle plan reset
  const handleResetPlan = async () => {
    setLocalLoading(true);
    try {
      // Clear both stores
      await clearActivePlan();
      clearPlanData();
      router.replace('/');
    } catch (error) {
      console.error("Error resetting plan:", error);
      Alert.alert("Erreur", "Impossible de réinitialiser le plan. Veuillez réessayer.");
    } finally {
      setLocalLoading(false);
    }
  };

  // Task rendering function
  const renderTask = (task: Task, sectionIndex: number, taskIndex: number) => {
    // Use a consistent task ID format
    const currentPhaseObj = phases[currentPhaseIndex];
    const taskId = `${currentPhaseObj.num}-${sectionIndex}-${taskIndex}`;
    const completed = isTaskCompleted(taskId);
    const hasTimer = task.td && task.td > 0;
    const timerActive = hasTimer && isTimerActive(taskId);
    
    // Skip completed tasks if we're not showing them
    if (completed && !showCompletedTasks) return null;
    
    return (
      <TouchableOpacity
        key={`task-${taskIndex}`}
        style={[
          localStyles.taskCard,
          isDark && localStyles.taskCardDark,
          completed && localStyles.taskCardCompleted
        ]}
        onPress={() => {
          if (completed) {
            uncompleteTask(taskId);
          } else {
            completeTask(taskId);
          }
        }}
        activeOpacity={0.7}
      >
        <View style={localStyles.taskHeader}>
          <View style={localStyles.taskContent}>
            <View style={localStyles.taskTimeContainer}>
              <Ionicons
                name="time-outline"
                size={12}
                color={isDark ? themeColors.secondaryText : themeColors.secondaryText}
              />
              <Text style={localStyles.taskTime}>
                {task.t}
              </Text>
            </View>
            
            <Text 
              style={[
                localStyles.taskInstruction,
                isDark && { color: themeColors.text },
                completed && { textDecorationLine: 'line-through', opacity: 0.7 }
              ]}
            >
              {task.i}
            </Text>
            
            {hasTimer && (
              <View style={localStyles.timerButtonContainer}>
                <TouchableOpacity 
                  style={[
                    localStyles.timerButton,
                    timerActive && localStyles.timerButtonActive
                  ]}
                  onPress={() => {
                    if (!timerActive && startTimer) {
                      startTimer(taskId, task.td || 0, task.i);
                    }
                  }}
                >
                  <Ionicons 
                    name={timerActive ? "timer" : "timer-outline"} 
                    size={12} 
                    color={timerActive ? "#FFFFFF" : "#4A6FA5"} 
                  />
                  <Text style={[
                    localStyles.timerButtonText,
                    timerActive && localStyles.timerButtonTextActive
                  ]}>
                    {timerActive 
                      ? "Actif" 
                      : `${task.td} min`}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
          
          <View style={localStyles.taskActions}>
            <View style={localStyles.completedIcon}>
              <Ionicons
                name={completed ? "checkmark-circle" : "checkmark-circle-outline"}
                size={24}
                color={completed ? "#5CB85C" : themeColors.secondaryText}
              />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // Render current phase content
  const renderPhase = () => {
    if (!phases.length || currentPhaseIndex >= phases.length) {
      return (
        <View style={{ padding: 24, alignItems: 'center' }}>
          <Text style={{ color: themeColors.text }}>
            Aucune phase disponible
          </Text>
        </View>
      );
    }

    const currentPhaseObj = phases[currentPhaseIndex];

    return (
      <ScrollView 
        style={localStyles.content}
        contentContainerStyle={{ paddingBottom: 80 }} // Add padding for floating buttons
      >
        <View style={localStyles.taskList}>
          {currentPhaseObj.sec.map((section, sIndex) => {
            // Count visible tasks in section
            const visibleTasks = section.t.filter((_, tIndex) => {
              const taskId = `${currentPhaseObj.num}-${sIndex}-${tIndex}`;
              const completed = isTaskCompleted(taskId);
              return !completed || showCompletedTasks;
            });
            
            // Skip rendering empty sections
            if (visibleTasks.length === 0) return null;
            
            return (
              <View key={`section-${sIndex}`} style={localStyles.sectionContainer}>
                <Text style={[
                  localStyles.sectionTitle, 
                  isDark && { color: themeColors.secondaryText }
                ]}>
                  {section.n}
                </Text>
                
                {section.t.map((task, tIndex) => renderTask(task, sIndex, tIndex))}
              </View>
            );
          })}
        </View>
      </ScrollView>
    );
  };

  // Render empty state when no plan is active
  if ((!activePlanId && !selectedPlanId) || (!planData && isInitialized)) {
    return (
      <SafeAreaView
        style={[localStyles.container, isDark && localStyles.containerDark]}
      >
        <View style={localStyles.emptyStateContainer}>
          <View style={localStyles.emptyStateIcon}>
            <Ionicons
              name="restaurant-outline"
              size={120}
              color="#7E94B4"
            />
          </View>
          
          <Text
            style={[
              localStyles.emptyStateTitle,
              isDark && { color: '#6D9CDB' },
            ]}
          >
            Prêt à cuisiner efficacement?
          </Text>
          
          <Text
            style={[
              localStyles.emptyStateText,
              isDark && { color: themeColors.secondaryText },
            ]}
          >
            Choisissez un plan de batch cooking dans l'onglet Découverte pour préparer plusieurs repas en une seule session.
          </Text>
          
          <TouchableOpacity
            style={localStyles.browseButton}
            onPress={() => router.replace('/')}
            activeOpacity={0.8}
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
  if (isLoading || localLoading || !isInitialized) {
    return (
      <SafeAreaView
        style={[localStyles.container, isDark && localStyles.containerDark]}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={styles.colors.primary} />
          <Text
            style={[
              styles.typography.body,
              { marginTop: 16, color: themeColors.text }
            ]}
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
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
          <Ionicons
            name="alert-circle-outline"
            size={80}
            color="#F44336"
          />
          <Text
            style={[
              styles.typography.h3,
              { marginTop: 16, color: themeColors.text }
            ]}
          >
            Erreur
          </Text>
          <Text
            style={[
              styles.typography.body,
              { textAlign: 'center', marginTop: 8, color: themeColors.text }
            ]}
          >
            {error}
          </Text>
          <TouchableOpacity
            style={[styles.buttonStyles.primary, { marginTop: 24 }]}
            onPress={() => router.replace('/')}
          >
            <Text style={{ color: '#FFFFFF', ...styles.typography.button }}>
              RETOUR À L'ACCUEIL
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[localStyles.container, isDark && localStyles.containerDark]}
    >
      {/* Ultra Compact Header with Phase */}
      <View style={localStyles.header}>
        <View style={localStyles.headerLeft}>
          <Text style={[localStyles.title, isDark && { color: themeColors.text }]}>
            Plan de cuisine
          </Text>
          
          <View style={localStyles.progressContainer}>
            <Text style={[localStyles.progressText, isDark && { color: themeColors.secondaryText }]}>
              {calculateProgress()}%
            </Text>
            <View style={localStyles.progressBar}>
              <View 
                style={[
                  localStyles.progressFill, 
                  { width: `${calculateProgress()}%` }
                ]} 
              />
            </View>
          </View>
        </View>
        
        <View style={localStyles.headerRight}>
          <TouchableOpacity
            style={localStyles.resetButton}
            onPress={() => {
              Alert.alert(
                'Réinitialiser',
                'Voulez-vous réinitialiser le plan? Votre progression sera perdue.',
                [
                  { text: 'Annuler', style: 'cancel' },
                  { 
                    text: 'Confirmer', 
                    style: 'destructive',
                    onPress: handleResetPlan
                  }
                ]
              );
            }}
          >
            <Ionicons name="refresh" size={20} color={isDark ? themeColors.text : themeColors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Phase Chips Carousel */}
      {phases.length > 0 && (
        <View style={localStyles.phaseChipsContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={localStyles.phaseChipsScroll}
          >
            {phases.map((phase, index) => {
              // Calculate if there are incomplete tasks in this phase
              const hasIncompleteTasks = phase.sec.some(section => 
                section.t.some((_, tIndex) => {
                  const taskId = `${phase.num}-${index}-${tIndex}`;
                  return !isTaskCompleted(taskId);
                })
              );
              
              return (
                <TouchableOpacity
                  key={`phase-chip-${index}`}
                  style={[
                    localStyles.phaseChip,
                    currentPhaseIndex === index && localStyles.phaseChipActive
                  ]}
                  onPress={() => handlePhaseChange(index)}
                  activeOpacity={0.7}
                >
                  {hasIncompleteTasks && <View style={localStyles.phaseChipDot} />}
                  <Text 
                    style={[
                      localStyles.phaseChipText,
                      currentPhaseIndex === index && localStyles.phaseChipTextActive
                    ]}
                  >
                    {phase.n}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}

      {/* Main content - Task list */}
      {renderPhase()}
      
      {/* Floating toggle for completed tasks */}
      <TouchableOpacity
        style={[
          localStyles.toggleCompletedContainer,
          isDark && { backgroundColor: themeColors.darkSurface }
        ]}
        onPress={() => setShowCompletedTasks(!showCompletedTasks)}
      >
        <Ionicons
          name={showCompletedTasks ? "eye" : "eye-off"}
          size={16}
          color={themeColors.secondaryText}
        />
        <Text style={localStyles.toggleCompletedText}>
          {showCompletedTasks ? "Masquer" : "Afficher"} terminées
        </Text>
      </TouchableOpacity>
      
      {/* Active Timers Overlay */}
      {activeTimers && activeTimers.length > 0 && (
        <View style={localStyles.timerOverlay}>
          <Ionicons name="timer" size={16} color="#FFFFFF" />
          <Text style={localStyles.timerCount}>
            {activeTimers.length} {activeTimers.length === 1 ? 'minuteur actif' : 'minuteurs actifs'}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}