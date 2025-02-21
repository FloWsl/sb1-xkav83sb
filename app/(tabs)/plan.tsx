// app/[tabs]/plan.tsx
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
    setPhase,
    completeTask,
    uncompleteTask,
    isTaskCompleted,
    calculateProgress,
    clearActivePlan,
  } = useBatchCooking();

  // Local state
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [showCompletedTasks, setShowCompletedTasks] = useState(false);
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
          <ActivityIndicator size="large" color="#FF6B6B" />
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
            color="#F44336"
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

  // Simplified phase view
  const renderPhase = () => {
    if (!phases.length || currentPhaseIndex >= phases.length) {
      return (
        <View style={localStyles.noPhaseContainer}>
          <Text style={[localStyles.noPhaseText, isDark && localStyles.textLight]}>
            Aucune phase disponible
          </Text>
        </View>
      );
    }

    const currentPhaseObj = phases[currentPhaseIndex];

    return (
      <View style={localStyles.phaseContainer}>
        <Text style={[localStyles.phaseTitle, isDark && localStyles.textLight]}>
          {currentPhaseObj.n}
        </Text>
        <Text style={[localStyles.phaseTime, isDark && localStyles.textLight]}>
          {currentPhaseObj.st} - {currentPhaseObj.en}
        </Text>
        
        {currentPhaseObj.sec.map((section, sIndex) => (
          <View key={`section-${sIndex}`} style={localStyles.sectionContainer}>
            <Text style={[localStyles.sectionTitle, isDark && localStyles.textLight]}>
              {section.n}
            </Text>
            
            {section.t.map((task, tIndex) => {
              // Use a simple index-based ID - no complex concatenation
              const taskId = `${currentPhaseObj.num}-${sIndex}-${tIndex}`;
              const completed = isTaskCompleted(taskId);
              
              // Skip completed tasks if we're not showing them
              if (completed && !showCompletedTasks) return null;
              
              return (
                <TouchableOpacity
                  key={`task-${tIndex}`}
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
                >
                  <View style={localStyles.taskHeader}>
                    <View style={localStyles.taskTimeContainer}>
                      <Ionicons
                        name="time-outline"
                        size={18}
                        color={isDark ? '#FFFFFF' : '#000000'}
                      />
                      <Text style={[localStyles.taskTime, isDark && localStyles.textLight]}>
                        {task.t}
                      </Text>
                    </View>
                    
                    <Ionicons
                      name={completed ? "checkmark-circle" : "checkmark-circle-outline"}
                      size={24}
                      color={completed ? "#4CAF50" : "#CCCCCC"}
                    />
                  </View>
                  
                  <Text 
                    style={[
                      localStyles.taskInstruction,
                      isDark && localStyles.textLight,
                      completed && localStyles.taskCompletedText
                    ]}
                  >
                    {task.i}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView
      style={[localStyles.container, isDark && localStyles.containerDark]}
    >
      {/* Header */}
      <View style={localStyles.header}>
        <View style={localStyles.headerRow}>
          <Text style={[localStyles.title, isDark && localStyles.textLight]}>
            Plan de cuisine
          </Text>
          <TouchableOpacity
            style={localStyles.resetButton}
            onPress={() => {
              Alert.alert(
                'Réinitialiser',
                'Voulez-vous réinitialiser le plan?',
                [
                  { text: 'Annuler', style: 'cancel' },
                  { 
                    text: 'Confirmer', 
                    style: 'destructive',
                    onPress: () => {
                      clearActivePlan();
                      router.replace('/');
                    }
                  }
                ]
              );
            }}
          >
            <Ionicons name="refresh" size={24} color={isDark ? '#FFFFFF' : '#000000'} />
          </TouchableOpacity>
        </View>
        
        {/* Progress bar */}
        <View style={localStyles.progressContainer}>
          <Text style={[localStyles.progressText, isDark && localStyles.textLight]}>
            Progression: {calculateProgress()}%
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

      {/* Phase selector */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={localStyles.phaseSelector}
        contentContainerStyle={localStyles.phaseSelectorContent}
      >
        {phases.map((phase, index) => (
          <TouchableOpacity
            key={`phase-${index}`}
            style={[
              localStyles.phaseButton,
              currentPhaseIndex === index && localStyles.phaseButtonActive,
              isDark && localStyles.phaseButtonDark
            ]}
            onPress={() => handlePhaseChange(index)}
          >
            <Text 
              style={[
                localStyles.phaseButtonText,
                currentPhaseIndex === index && localStyles.phaseButtonTextActive
              ]}
            >
              {phase.n}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Toggle completed tasks */}
      <View style={localStyles.controlsContainer}>
        <TouchableOpacity
          style={localStyles.toggleButton}
          onPress={() => setShowCompletedTasks(!showCompletedTasks)}
        >
          <Ionicons
            name={showCompletedTasks ? "eye" : "eye-off"}
            size={20}
            color="#666666"
          />
          <Text style={localStyles.toggleText}>
            {showCompletedTasks ? "Masquer terminées" : "Afficher terminées"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Main content */}
      <ScrollView style={localStyles.content}>
        {renderPhase()}
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
    backgroundColor: '#121212',
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  headerRow: {
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
    marginTop: 15,
  },
  progressText: {
    fontSize: 14,
    marginBottom: 5,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  phaseSelector: {
    maxHeight: 50,
  },
  phaseSelectorContent: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    gap: 10,
  },
  phaseButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  phaseButtonDark: {
    backgroundColor: '#2A2A2A',
  },
  phaseButtonActive: {
    backgroundColor: '#FF6B6B',
  },
  phaseButtonText: {
    fontSize: 14,
    color: '#333333',
  },
  phaseButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  controlsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  toggleText: {
    fontSize: 14,
    color: '#666666',
  },
  content: {
    flex: 1,
  },
  phaseContainer: {
    padding: 20,
  },
  noPhaseContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noPhaseText: {
    fontSize: 16,
    color: '#666666',
  },
  phaseTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  phaseTime: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 20,
  },
  sectionContainer: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  taskCard: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  taskCardDark: {
    backgroundColor: '#2A2A2A',
  },
  taskCardCompleted: {
    backgroundColor: '#F5F5F5',
    borderLeftWidth: 3,
    borderLeftColor: '#4CAF50',
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  taskTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  taskTime: {
    fontSize: 14,
    fontWeight: '500',
  },
  taskInstruction: {
    fontSize: 16,
    lineHeight: 22,
  },
  taskCompletedText: {
    textDecorationLine: 'line-through',
    opacity: 0.7,
  },
  textLight: {
    color: '#FFFFFF',
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