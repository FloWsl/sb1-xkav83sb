import React, { useState, useRef } from 'react';
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import type { Phase, Section, Task } from '../../types/schema';

const { width } = Dimensions.get('window');

// Extended phases array for testing horizontal scroll
const phases: Phase[] = [
  {
    num: '1',
    n: 'Mise en place',
    st: '00:00',
    en: '00:30',
    sec: [
      {
        n: 'Préparation des légumes',
        t: [
          { t: '10min', i: 'Laver et éplucher les carottes', c: false, pr: 'high' },
          { t: '5min', i: 'Couper les oignons en dés', c: false, pr: 'medium' },
          { t: '15min', i: 'Préparer la marinade', c: false, pr: 'low' }
        ]
      }
    ]
  },
  {
    num: '2',
    n: 'Cuisson',
    st: '00:30',
    en: '01:30',
    sec: [
      {
        n: 'Viandes',
        t: [
          { t: '45min', i: 'Cuire le poulet au four', c: false, pr: 'high' },
          { t: '15min', i: 'Préparer la sauce', c: false, pr: 'medium' }
        ]
      }
    ]
  },
  {
    num: '3',
    n: 'Assemblage',
    st: '01:30',
    en: '02:00',
    sec: [
      {
        n: 'Finitions',
        t: [
          { t: '15min', i: 'Dresser les assiettes', c: false, pr: 'medium' },
          { t: '10min', i: 'Ajouter les garnitures', c: false, pr: 'low' }
        ]
      }
    ]
  }
];

export default function PlanScreen() {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const phaseListRef = useRef<FlatList>(null);

  const resetSession = () => {
    Alert.alert(
      'Réinitialiser la session',
      'Voulez-vous vraiment recommencer depuis le début ?',
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Réinitialiser',
          style: 'destructive',
          onPress: () => {
            setCompletedTasks(new Set());
            setCurrentPhase(0);
            phaseListRef.current?.scrollToOffset({ offset: 0, animated: true });
          },
        },
      ]
    );
  };

  const toggleTask = (phaseIndex: number, sectionIndex: number, taskIndex: number) => {
    const taskId = `${phaseIndex}-${sectionIndex}-${taskIndex}`;
    const newCompletedTasks = new Set(completedTasks);
    
    if (completedTasks.has(taskId)) {
      newCompletedTasks.delete(taskId);
    } else {
      newCompletedTasks.add(taskId);
    }
    
    setCompletedTasks(newCompletedTasks);
  };

  const renderPhaseItem = ({ item, index }: { item: Phase; index: number }) => (
    <TouchableOpacity
      style={[
        styles.phaseButton,
        currentPhase === index && styles.phaseButtonActive,
        isDark && styles.phaseButtonDark,
        currentPhase === index && isDark && styles.phaseButtonActiveDark,
      ]}
      onPress={() => {
        setCurrentPhase(index);
        phaseListRef.current?.scrollToIndex({
          index,
          animated: true,
          viewPosition: 0.5,
        });
      }}>
      <Text
        style={[
          styles.phaseButtonText,
          currentPhase === index && styles.phaseButtonTextActive,
          isDark && styles.textLight,
        ]}>
        {item.n}
      </Text>
      <Text
        style={[
          styles.phaseTime,
          isDark && styles.textLight,
        ]}>
        {item.st} - {item.en}
      </Text>
    </TouchableOpacity>
  );

  const renderTask = (task: Task, phaseIndex: number, sectionIndex: number, taskIndex: number) => {
    const taskId = `${phaseIndex}-${sectionIndex}-${taskIndex}`;
    const isCompleted = completedTasks.has(taskId);

    if (isCompleted) {
      return null; // Don't render completed tasks
    }

    return (
      <TouchableOpacity
        key={taskId}
        style={[
          styles.taskCard,
          isDark && styles.taskCardDark,
        ]}
        onPress={() => toggleTask(phaseIndex, sectionIndex, taskIndex)}>
        <View style={styles.taskHeader}>
          <View style={styles.taskTimeContainer}>
            <Ionicons
              name="time-outline"
              size={24}
              color={isDark ? '#FFFFFF' : '#000000'}
            />
            <Text style={[styles.taskTime, isDark && styles.textLight]}>{task.t}</Text>
          </View>
        </View>
        <Text style={[styles.taskInstruction, isDark && styles.textLight]}>{task.i}</Text>
      </TouchableOpacity>
    );
  };

  const renderPhase = (phase: Phase, phaseIndex: number) => {
    return (
      <View style={styles.phaseContainer} key={phase.num}>
        {phase.sec.map((section, sectionIndex) => {
          const hasUncompletedTasks = section.t.some((_, taskIndex) => 
            !completedTasks.has(`${phaseIndex}-${sectionIndex}-${taskIndex}`)
          );

          if (!hasUncompletedTasks) {
            return null; // Don't render sections with all tasks completed
          }

          return (
            <View key={`${phaseIndex}-${sectionIndex}`} style={styles.sectionContainer}>
              <Text style={[styles.sectionTitle, isDark && styles.textLight]}>
                {section.n}
              </Text>
              {section.t.map((task, taskIndex) =>
                renderTask(task, phaseIndex, sectionIndex, taskIndex)
              )}
            </View>
          );
        })}
      </View>
    );
  };

  const getPhaseProgress = (phaseIndex: number) => {
    let total = 0;
    let completed = 0;
    
    phases[phaseIndex].sec.forEach((section, sectionIndex) => {
      section.t.forEach((_, taskIndex) => {
        total++;
        if (completedTasks.has(`${phaseIndex}-${sectionIndex}-${taskIndex}`)) {
          completed++;
        }
      });
    });
    
    return { completed, total };
  };

  const currentProgress = getPhaseProgress(currentPhase);

  return (
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={[styles.title, isDark && styles.textLight]}>Plan de cuisine</Text>
          <TouchableOpacity
            style={styles.resetButton}
            onPress={resetSession}>
            <Ionicons
              name="refresh-circle-outline"
              size={28}
              color={isDark ? '#FFFFFF' : '#000000'}
            />
          </TouchableOpacity>
        </View>
        <Text style={[styles.progress, isDark && styles.textLight]}>
          Phase {currentPhase + 1}: {currentProgress.completed}/{currentProgress.total} tâches
        </Text>
      </View>

      <FlatList
        ref={phaseListRef}
        data={phases}
        renderItem={renderPhaseItem}
        keyExtractor={(item) => item.num}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.phaseList}
        snapToAlignment="center"
        decelerationRate="fast"
        onScrollToIndexFailed={() => {}}
      />

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}>
        {renderPhase(phases[currentPhase], currentPhase)}
        
        {currentProgress.completed === currentProgress.total && (
          <View style={[styles.phaseComplete, isDark && styles.phaseCompleteDark]}>
            <Ionicons
              name="checkmark-circle"
              size={48}
              color="#4CAF50"
            />
            <Text style={[styles.phaseCompleteText, isDark && styles.textLight]}>
              Phase terminée !
            </Text>
            {currentPhase < phases.length - 1 && (
              <TouchableOpacity
                style={styles.nextPhaseButton}
                onPress={() => setCurrentPhase(currentPhase + 1)}>
                <Text style={styles.nextPhaseButtonText}>
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

const styles = StyleSheet.create({
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
  progress: {
    fontSize: 16,
    color: '#666666',
    marginTop: 4,
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
  },
  taskCardDark: {
    backgroundColor: '#1A1A1A',
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
  taskInstruction: {
    fontSize: 18,
    lineHeight: 24,
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
});