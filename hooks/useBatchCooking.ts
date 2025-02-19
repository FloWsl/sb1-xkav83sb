// app/hooks/useBatchCooking.ts
import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  fetchPlanById, 
  fetchWeekData 
} from '../lib/api';
import { 
  BatchCookingData,
  Task,
  Phase
} from '../types/schema';

// Storage keys
const STORAGE_KEYS = {
  ACTIVE_PLAN: 'batchmaster_active_plan',
  COMPLETED_TASKS: 'batchmaster_completed_tasks',
  CURRENT_PHASE: 'batchmaster_current_phase',
  ACTIVE_TIMERS: 'batchmaster_active_timers'
};

// Timer interface
interface Timer {
  id: string;
  name: string;
  duration: number; // in seconds
  startTime: number;
  isPaused: boolean;
  pausedTimeRemaining?: number;
  recipeId?: string;
}

export default function useBatchCooking() {
  // State
  const [activePlanId, setActivePlanId] = useState<string | null>(null);
  const [planData, setPlanData] = useState<BatchCookingData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [currentPhase, setCurrentPhase] = useState<string | null>(null);
  const [activeTimers, setActiveTimers] = useState<Timer[]>([]);

  // Load saved state from AsyncStorage
  useEffect(() => {
    const loadSavedState = async () => {
      try {
        // Load active plan ID
        const savedPlanId = await AsyncStorage.getItem(STORAGE_KEYS.ACTIVE_PLAN);
        if (savedPlanId) {
          setActivePlanId(savedPlanId);
        }

        // Load completed tasks
        const savedTasks = await AsyncStorage.getItem(STORAGE_KEYS.COMPLETED_TASKS);
        if (savedTasks) {
          setCompletedTasks(JSON.parse(savedTasks));
        }

        // Load current phase
        const savedPhase = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_PHASE);
        if (savedPhase) {
          setCurrentPhase(savedPhase);
        }

        // Load active timers
        const savedTimers = await AsyncStorage.getItem(STORAGE_KEYS.ACTIVE_TIMERS);
        if (savedTimers) {
          setActiveTimers(JSON.parse(savedTimers));
        }
      } catch (error) {
        console.error('Failed to load saved batch cooking state:', error);
        setError('Failed to load your cooking progress. Please restart the app.');
      }
    };

    loadSavedState();
  }, []);

  // Load plan data when active plan changes
  useEffect(() => {
    const loadPlanData = async () => {
      if (!activePlanId) {
        setPlanData(null);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        let data: BatchCookingData;
        
        // Check if the ID is a week number or a plan ID
        if (!isNaN(Number(activePlanId))) {
          // If it's a number, assume it's a week
          data = await fetchWeekData(Number(activePlanId));
        } else {
          // Otherwise assume it's a plan ID
          data = await fetchPlanById(activePlanId);
        }
        
        setPlanData(data);
        
        // If no current phase is set, default to the first phase
        if (!currentPhase && data.b.p.length > 0) {
          const firstPhase = data.b.p[0].num;
          setCurrentPhase(firstPhase);
          await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_PHASE, firstPhase);
        }
      } catch (error) {
        console.error('Failed to load plan data:', error);
        setError('Could not load the cooking plan. Please check your connection.');
      } finally {
        setIsLoading(false);
      }
    };

    loadPlanData();
  }, [activePlanId]);

  // Save completed tasks when they change
  useEffect(() => {
    const saveCompletedTasks = async () => {
      try {
        await AsyncStorage.setItem(
          STORAGE_KEYS.COMPLETED_TASKS,
          JSON.stringify(completedTasks)
        );
      } catch (error) {
        console.error('Failed to save completed tasks:', error);
      }
    };

    saveCompletedTasks();
  }, [completedTasks]);

  // Save current phase when it changes
  useEffect(() => {
    const saveCurrentPhase = async () => {
      if (currentPhase) {
        try {
          await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_PHASE, currentPhase);
        } catch (error) {
          console.error('Failed to save current phase:', error);
        }
      }
    };

    saveCurrentPhase();
  }, [currentPhase]);

  // Save active timers when they change
  useEffect(() => {
    const saveActiveTimers = async () => {
      try {
        await AsyncStorage.setItem(
          STORAGE_KEYS.ACTIVE_TIMERS,
          JSON.stringify(activeTimers)
        );
      } catch (error) {
        console.error('Failed to save active timers:', error);
      }
    };

    saveActiveTimers();
  }, [activeTimers]);

  // Manage timers
  useEffect(() => {
    const timerInterval = setInterval(() => {
      setActiveTimers(prevTimers => {
        // No update needed if no timers
        if (prevTimers.length === 0) return prevTimers;
        
        // Process each timer
        const updatedTimers = prevTimers.map(timer => {
          // Skip paused timers
          if (timer.isPaused) return timer;
          
          const now = Date.now();
          const elapsedSeconds = Math.floor((now - timer.startTime) / 1000);
          
          // Timer is still running
          return { ...timer };
        });
        
        return updatedTimers;
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, []);

  // Activate a plan
  const activatePlan = useCallback(async (planId: string) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ACTIVE_PLAN, planId);
      setActivePlanId(planId);
      setCompletedTasks([]);
      setCurrentPhase(null);
      setActiveTimers([]);
      
      // Clear stored data
      await AsyncStorage.removeItem(STORAGE_KEYS.COMPLETED_TASKS);
      await AsyncStorage.removeItem(STORAGE_KEYS.CURRENT_PHASE);
      await AsyncStorage.removeItem(STORAGE_KEYS.ACTIVE_TIMERS);
      
      return true;
    } catch (error) {
      console.error('Failed to activate plan:', error);
      setError('Could not activate the cooking plan.');
      return false;
    }
  }, []);

  // Clear active plan
  const clearActivePlan = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.ACTIVE_PLAN);
      await AsyncStorage.removeItem(STORAGE_KEYS.COMPLETED_TASKS);
      await AsyncStorage.removeItem(STORAGE_KEYS.CURRENT_PHASE);
      await AsyncStorage.removeItem(STORAGE_KEYS.ACTIVE_TIMERS);
      
      setActivePlanId(null);
      setPlanData(null);
      setCompletedTasks([]);
      setCurrentPhase(null);
      setActiveTimers([]);
    } catch (error) {
      console.error('Failed to clear active plan:', error);
      setError('Could not clear the cooking plan.');
    }
  }, []);

  // Mark a task as completed
  const completeTask = useCallback((taskId: string) => {
    setCompletedTasks(prev => {
      if (prev.includes(taskId)) return prev;
      return [...prev, taskId];
    });
  }, []);

  // Mark a task as uncompleted (undo)
  const uncompleteTask = useCallback((taskId: string) => {
    setCompletedTasks(prev => prev.filter(id => id !== taskId));
  }, []);

  // Set the current phase
  const setPhase = useCallback((phaseId: string) => {
    setCurrentPhase(phaseId);
  }, []);

  // Start a timer
  const startTimer = useCallback((name: string, duration: number, recipeId?: string) => {
    const id = `timer_${Date.now()}`;
    const timer: Timer = {
      id,
      name,
      duration,
      startTime: Date.now(),
      isPaused: false,
      recipeId
    };
    
    setActiveTimers(prev => [...prev, timer]);
    return id;
  }, []);

  // Pause a timer
  const pauseTimer = useCallback((timerId: string) => {
    setActiveTimers(prev => 
      prev.map(timer => {
        if (timer.id !== timerId) return timer;
        
        // Calculate remaining time
        const elapsedMs = Date.now() - timer.startTime;
        const remainingMs = (timer.duration * 1000) - elapsedMs;
        
        return {
          ...timer,
          isPaused: true,
          pausedTimeRemaining: Math.max(0, Math.floor(remainingMs / 1000))
        };
      })
    );
  }, []);

  // Resume a timer
  const resumeTimer = useCallback((timerId: string) => {
    setActiveTimers(prev => 
      prev.map(timer => {
        if (timer.id !== timerId || !timer.isPaused) return timer;
        
        // Calculate new start time based on remaining time
        const remainingMs = (timer.pausedTimeRemaining || 0) * 1000;
        const newStartTime = Date.now() - ((timer.duration * 1000) - remainingMs);
        
        return {
          ...timer,
          isPaused: false,
          startTime: newStartTime,
          pausedTimeRemaining: undefined
        };
      })
    );
  }, []);

  // Cancel a timer
  const cancelTimer = useCallback((timerId: string) => {
    setActiveTimers(prev => prev.filter(timer => timer.id !== timerId));
  }, []);

  // Add extra time to a timer
  const addTimeToTimer = useCallback((timerId: string, additionalSeconds: number) => {
    setActiveTimers(prev => 
      prev.map(timer => {
        if (timer.id !== timerId) return timer;
        
        return {
          ...timer,
          duration: timer.duration + additionalSeconds
        };
      })
    );
  }, []);

  // Get all tasks for the current phase
  const getCurrentPhaseTasks = useCallback(() => {
    if (!planData || !currentPhase) return [];
    
    const phase = planData.b.p.find(p => p.num === currentPhase);
    if (!phase) return [];
    
    // Flatten all tasks from all sections in the phase
    const tasks: Task[] = [];
    phase.sec.forEach(section => {
      section.t.forEach(task => {
        tasks.push(task);
      });
    });
    
    return tasks;
  }, [planData, currentPhase]);

  // Get all phases
  const getAllPhases = useCallback((): Phase[] => {
    if (!planData) return [];
    return planData.b.p;
  }, [planData]);

  // Calculate progress percentage
  const calculateProgress = useCallback(() => {
    if (!planData) return 0;
    
    // Count total tasks
    let totalTasks = 0;
    planData.b.p.forEach(phase => {
      phase.sec.forEach(section => {
        totalTasks += section.t.length;
      });
    });
    
    if (totalTasks === 0) return 0;
    
    // Calculate percentage
    return Math.min(100, Math.round((completedTasks.length / totalTasks) * 100));
  }, [planData, completedTasks]);

  // Get remaining time for timer
  const getTimerRemainingTime = useCallback((timerId: string) => {
    const timer = activeTimers.find(t => t.id === timerId);
    if (!timer) return 0;
    
    if (timer.isPaused) {
      return timer.pausedTimeRemaining || 0;
    }
    
    const elapsedMs = Date.now() - timer.startTime;
    const remainingMs = (timer.duration * 1000) - elapsedMs;
    return Math.max(0, Math.floor(remainingMs / 1000));
  }, [activeTimers]);

  // Check if a task is completed
  const isTaskCompleted = useCallback((taskId: string) => {
    return completedTasks.includes(taskId);
  }, [completedTasks]);

  return {
    // State
    activePlanId,
    planData,
    isLoading,
    error,
    completedTasks,
    currentPhase,
    activeTimers,
    
    // Plan management
    activatePlan,
    clearActivePlan,
    
    // Task management
    completeTask,
    uncompleteTask,
    isTaskCompleted,
    
    // Phase management
    setPhase,
    getCurrentPhaseTasks,
    getAllPhases,
    
    // Timer management
    startTimer,
    pauseTimer,
    resumeTimer,
    cancelTimer,
    addTimeToTimer,
    getTimerRemainingTime,
    
    // Progress tracking
    calculateProgress
  };
}