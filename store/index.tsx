// app/store/index.ts
import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserPreferences, ActivePlanState, CookingPlan } from '../types/schema';

// Define the app state structure
interface AppState {
  userPreferences: UserPreferences;
  activePlan: ActivePlanState | null;
  currentPlan: CookingPlan | null;
  isLoading: boolean;
  error: string | null;
}

// Initial default state
const initialState: AppState = {
  userPreferences: {
    dietaryPreferences: [],
    excludedIngredients: [],
    householdSize: 2,
    kitchenEquipment: [],
    isPremium: false
  },
  activePlan: null,
  currentPlan: null,
  isLoading: false,
  error: null
};

// Define action types
type Action = 
  | { type: 'SET_USER_PREFERENCES', payload: UserPreferences }
  | { type: 'SET_ACTIVE_PLAN', payload: ActivePlanState | null }
  | { type: 'SET_CURRENT_PLAN', payload: CookingPlan | null }
  | { type: 'ADD_COMPLETED_TASK', payload: string }
  | { type: 'SET_CURRENT_PHASE', payload: string }
  | { type: 'ADD_TIMER', payload: { id: string, name: string, duration: number, recipeId?: string } }
  | { type: 'REMOVE_TIMER', payload: string }
  | { type: 'UPDATE_TIMER', payload: { id: string, isPaused: boolean, pausedTimeRemaining?: number } }
  | { type: 'SET_LOADING', payload: boolean }
  | { type: 'SET_ERROR', payload: string | null };

// Reducer function to handle state updates
const reducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'SET_USER_PREFERENCES':
      return { ...state, userPreferences: action.payload };
    
    case 'SET_ACTIVE_PLAN':
      return { ...state, activePlan: action.payload };
    
    case 'SET_CURRENT_PLAN':
      return { ...state, currentPlan: action.payload };
    
    case 'ADD_COMPLETED_TASK':
      if (!state.activePlan) return state;
      return {
        ...state,
        activePlan: {
          ...state.activePlan,
          completedTasks: [...state.activePlan.completedTasks, action.payload]
        }
      };
    
    case 'SET_CURRENT_PHASE':
      if (!state.activePlan) return state;
      return {
        ...state,
        activePlan: {
          ...state.activePlan,
          currentPhase: action.payload
        }
      };
    
    case 'ADD_TIMER':
      if (!state.activePlan) return state;
      const newTimer = {
        id: action.payload.id,
        name: action.payload.name,
        duration: action.payload.duration,
        startTime: new Date(),
        isPaused: false,
        recipeId: action.payload.recipeId
      };
      return {
        ...state,
        activePlan: {
          ...state.activePlan,
          activeTimers: [...state.activePlan.activeTimers, newTimer]
        }
      };
    
    case 'REMOVE_TIMER':
      if (!state.activePlan) return state;
      return {
        ...state,
        activePlan: {
          ...state.activePlan,
          activeTimers: state.activePlan.activeTimers.filter(
            timer => timer.id !== action.payload
          )
        }
      };
    
    case 'UPDATE_TIMER':
      if (!state.activePlan) return state;
      return {
        ...state,
        activePlan: {
          ...state.activePlan,
          activeTimers: state.activePlan.activeTimers.map(timer => 
            timer.id === action.payload.id 
              ? { ...timer, ...action.payload }
              : timer
          )
        }
      };
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    default:
      return state;
  }
};

// Create the context with type
interface StoreContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

const StoreContext = createContext<StoreContextType>({
  state: initialState,
  dispatch: () => null
});

// Storage keys
const STORAGE_KEYS = {
  USER_PREFERENCES: 'batchmaster_user_preferences',
  ACTIVE_PLAN: 'batchmaster_active_plan'
};

// Provider component props
interface StoreProviderProps {
  children: ReactNode;
}

// Provider function (no JSX)
export const StoreProvider = (props: StoreProviderProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Load saved state from AsyncStorage on app start
  useEffect(() => {
    const loadStoredData = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        
        // Load user preferences
        const storedPreferences = await AsyncStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
        if (storedPreferences) {
          dispatch({ 
            type: 'SET_USER_PREFERENCES', 
            payload: JSON.parse(storedPreferences) 
          });
        }
        
        // Load active plan
        const storedActivePlan = await AsyncStorage.getItem(STORAGE_KEYS.ACTIVE_PLAN);
        if (storedActivePlan) {
          const activePlan = JSON.parse(storedActivePlan);
          // Convert stored date strings back to Date objects
          if (activePlan.activationDate) {
            activePlan.activationDate = new Date(activePlan.activationDate);
          }
          if (activePlan.activeTimers) {
            activePlan.activeTimers = activePlan.activeTimers.map((timer: any) => ({
              ...timer,
              startTime: new Date(timer.startTime)
            }));
          }
          dispatch({ type: 'SET_ACTIVE_PLAN', payload: activePlan });
        }
        
        dispatch({ type: 'SET_LOADING', payload: false });
      } catch (error) {
        console.error('Failed to load stored data:', error);
        dispatch({ 
          type: 'SET_ERROR', 
          payload: 'Failed to load your saved data. Please restart the app.' 
        });
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    loadStoredData();
  }, []);

  // Save state changes to AsyncStorage
  useEffect(() => {
    const saveUserPreferences = async () => {
      try {
        await AsyncStorage.setItem(
          STORAGE_KEYS.USER_PREFERENCES,
          JSON.stringify(state.userPreferences)
        );
      } catch (error) {
        console.error('Failed to save user preferences:', error);
      }
    };

    saveUserPreferences();
  }, [state.userPreferences]);

  useEffect(() => {
    const saveActivePlan = async () => {
      try {
        if (state.activePlan) {
          await AsyncStorage.setItem(
            STORAGE_KEYS.ACTIVE_PLAN,
            JSON.stringify(state.activePlan)
          );
        } else {
          await AsyncStorage.removeItem(STORAGE_KEYS.ACTIVE_PLAN);
        }
      } catch (error) {
        console.error('Failed to save active plan:', error);
      }
    };

    saveActivePlan();
  }, [state.activePlan]);

  // Use createElement instead of JSX
  return React.createElement(
    StoreContext.Provider,
    { value: { state, dispatch } },
    props.children
  );
};

// Custom hook for using the store
export const useStore = () => useContext(StoreContext);