// hooks/useBatchCooking.ts
import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import API functions
import * as API from '../lib/api';

// Import types
import type { 
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

// VERY aggressive JSON cloning - guarantees no Symbols or non-serializable data
const safeClone = (obj: any): any => {
  if (obj === null || obj === undefined) {
    return obj;
  }
  
  try {
    // First attempt: use JSON serialization (this will strip any Symbols)
    return JSON.parse(JSON.stringify(obj));
  } catch (error) {
    console.warn("JSON serialization failed, using manual clone", error);
    
    // Manual cloning as fallback
    if (typeof obj !== 'object') {
      return obj; // primitive values are safe
    }
    
    if (Array.isArray(obj)) {
      return obj.map(item => {
        try {
          return safeClone(item);
        } catch (e) {
          console.warn("Couldn't clone array item", e);
          return null; // replace problematic items with null
        }
      });
    }
    
    // Clone object properties
    const result: Record<string, any> = {};
    for (const key of Object.keys(obj)) {
      try {
        const value = obj[key];
        // Skip functions, symbols, and other non-serializable types
        if (typeof value !== 'function' && typeof value !== 'symbol') {
          result[key] = safeClone(value);
        }
      } catch (e) {
        console.warn(`Couldn't clone property ${key}`, e);
      }
    }
    return result;
  }
};

// Ensure data is serializable
const serializeTimer = (timer: Timer): Timer => ({
  ...timer,
  startTime: Number(timer.startTime),
  duration: Number(timer.duration),
  pausedTimeRemaining: timer.pausedTimeRemaining
    ? Number(timer.pausedTimeRemaining)
    : undefined,
});

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

        console.log("Attempting to load plan with ID:", activePlanId);
        
        // Load plan data
        let data: BatchCookingData;
        try {
          console.log("Fetching plan data...");
          data = await API.fetchPlanById(activePlanId);
          console.log("Plan data fetched successfully");
        } catch (error) {
          console.error("Error fetching plan data:", error);
          throw error;
        }

        // Ensure data is safely cloned before storing
        const safeData = safeClone(data);
        console.log("Setting plan data:", JSON.stringify(safeData));
        setPlanData(safeData);
        
        // If no current phase is set, default to the first phase
        if (!currentPhase && safeData.b.p.length > 0) {
          const firstPhase = safeData.b.p[0].num;
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
  }, [activePlanId, currentPhase]);

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
        // Make sure timers are serializable
        const serializableTimers = safeClone(activeTimers.map(serializeTimer));
        await AsyncStorage.setItem(
          STORAGE_KEYS.ACTIVE_TIMERS,
          JSON.stringify(serializableTimers)
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
        if (prevTimers.length === 0) return prevTimers;
        
        // Process each timer
        const updatedTimers = prevTimers.map(timer => {
          // Skip paused timers
          if (timer.isPaused) return timer;
          
          // Timer is running, but for now we just re-return it.
          // You could update "elapsedSeconds" or something else if needed.
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
      console.log("Activating plan in batch cooking:", planId);
      
      // First, try to fetch the plan data to validate it exists
      let planData: BatchCookingData;
      try {
        planData = await API.fetchPlanById(planId);
      } catch (error) {
        console.error('Failed to fetch plan data:', error);
        throw new Error('Could not fetch plan data');
      }
      
      // If we got the data, proceed with activation
      await AsyncStorage.setItem(STORAGE_KEYS.ACTIVE_PLAN, planId);
      setActivePlanId(planId);
      
      // Reset all state
      setCompletedTasks([]);
      setActiveTimers([]);
      
      // Set initial phase
      if (planData.b.p.length > 0) {
        const firstPhase = planData.b.p[0].num;
        setCurrentPhase(firstPhase);
        await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_PHASE, firstPhase);
      } else {
        setCurrentPhase(null);
      }
      
      // Clear stored data
      await AsyncStorage.removeItem(STORAGE_KEYS.COMPLETED_TASKS);
      await AsyncStorage.removeItem(STORAGE_KEYS.ACTIVE_TIMERS);
      
      // Store the plan data
      setPlanData(safeClone(planData));
      
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
      console.log("Clearing active plan in batch cooking");
      await AsyncStorage.removeItem(STORAGE_KEYS.ACTIVE_PLAN);
      await AsyncStorage.removeItem(STORAGE_KEYS.COMPLETED_TASKS);
      await AsyncStorage.removeItem(STORAGE_KEYS.CURRENT_PHASE);
      await AsyncStorage.removeItem(STORAGE_KEYS.ACTIVE_TIMERS);
      
      setActivePlanId(null);
      setPlanData(null);
      setCompletedTasks([]);
      setCurrentPhase(null);
      setActiveTimers([]);
      return true;
    } catch (error) {
      console.error('Failed to clear active plan:', error);
      setError('Could not clear the cooking plan.');
      return false;
    }
  }, []);

  // Mark a task as completed
  const completeTask = useCallback((taskId: string) => {
    console.log("Completing task:", taskId);
    setCompletedTasks(prev => {
      if (prev.includes(taskId)) return prev;
      return [...prev, taskId];
    });
  }, []);

  // Mark a task as uncompleted (undo)
  const uncompleteTask = useCallback((taskId: string) => {
    console.log("Uncompleting task:", taskId);
    setCompletedTasks(prev => prev.filter(id => id !== taskId));
  }, []);

  // Set current phase
  const setPhase = useCallback((phaseId: string) => {
    console.log("Setting phase to:", phaseId);
    if (phaseId) {
      setCurrentPhase(phaseId);
    }
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
        // Create a unique ID for each task
        const taskWithId = {
          ...task,
          id: `${phase.num}-${task.t}-${task.i}`
        };
        tasks.push(taskWithId);
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
    return Math.min(
      100,
      Math.round((completedTasks.length / totalTasks) * 100)
    );
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
    activePlanId,
    planData,
    isLoading,
    error,
    completedTasks,
    currentPhase,
    activeTimers,
    activatePlan,
    clearActivePlan,
    completeTask,
    uncompleteTask,
    isTaskCompleted,
    setPhase,
    getCurrentPhaseTasks,
    getAllPhases,
    startTimer,
    pauseTimer,
    resumeTimer,
    cancelTimer,
    addTimeToTimer,
    getTimerRemainingTime,
    calculateProgress
  };
}