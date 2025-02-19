// app/lib/api.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { 
  BatchCookingData,
  PlanSummary,
  UserPreferences
} from '../types/schema';

// Create axios instance with configuration
const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'https://api.example.com',
  timeout: 10000,
});

// Cache constants
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const CACHE_KEYS = {
  PLANS: 'cache_plans',
  WEEK_DATA: 'cache_week_',
  INGREDIENTS: 'cache_ingredients',
  EQUIPMENT: 'cache_equipment',
  RECIPES: 'cache_recipes',
};

// Cache helpers
interface CacheItem<T> {
  data: T;
  timestamp: number;
}

async function getFromCache<T>(key: string): Promise<T | null> {
  try {
    const cached = await AsyncStorage.getItem(key);
    if (!cached) return null;
    
    const { data, timestamp }: CacheItem<T> = JSON.parse(cached);
    const now = Date.now();
    
    if (now - timestamp > CACHE_TTL) {
      // Cache expired
      await AsyncStorage.removeItem(key);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Cache read error:', error);
    return null;
  }
}

async function saveToCache<T>(key: string, data: T): Promise<void> {
  try {
    const cacheItem: CacheItem<T> = {
      data,
      timestamp: Date.now(),
    };
    await AsyncStorage.setItem(key, JSON.stringify(cacheItem));
  } catch (error) {
    console.error('Cache write error:', error);
  }
}

// Request options
interface RequestOptions {
  useCache?: boolean;
  forceRefresh?: boolean;
}

// Keep existing functions
export async function fetchWeekData(week: number, options: RequestOptions = {}): Promise<BatchCookingData> {
  const { useCache = true, forceRefresh = false } = options;
  const cacheKey = `${CACHE_KEYS.WEEK_DATA}${week}`;
  
  // Try cache first if appropriate
  if (useCache && !forceRefresh) {
    const cached = await getFromCache<BatchCookingData>(cacheKey);
    if (cached) return cached;
  }
  
  try {
    const { data } = await api.get<BatchCookingData>(`/weeks/${week}`);
    
    // Cache the fresh data
    if (useCache) {
      await saveToCache(cacheKey, data);
    }
    
    return data;
  } catch (error) {
    // On network error, try to use cache as fallback
    if (useCache) {
      const cached = await getFromCache<BatchCookingData>(cacheKey);
      if (cached) return cached;
    }
    
    // Re-throw if no cache available
    throw error;
  }
}

export async function fetchIngredients(options: RequestOptions = {}) {
  const { useCache = true, forceRefresh = false } = options;
  
  // Try cache first if appropriate
  if (useCache && !forceRefresh) {
    const cached = await getFromCache(CACHE_KEYS.INGREDIENTS);
    if (cached) return cached;
  }
  
  try {
    const { data } = await api.get('/ingredients');
    
    // Cache the fresh data
    if (useCache) {
      await saveToCache(CACHE_KEYS.INGREDIENTS, data);
    }
    
    return data;
  } catch (error) {
    // On network error, try to use cache as fallback
    if (useCache) {
      const cached = await getFromCache(CACHE_KEYS.INGREDIENTS);
      if (cached) return cached;
    }
    
    // Re-throw if no cache available
    throw error;
  }
}

export async function fetchEquipment(options: RequestOptions = {}) {
  const { useCache = true, forceRefresh = false } = options;
  
  // Try cache first if appropriate
  if (useCache && !forceRefresh) {
    const cached = await getFromCache(CACHE_KEYS.EQUIPMENT);
    if (cached) return cached;
  }
  
  try {
    const { data } = await api.get('/equipment');
    
    // Cache the fresh data
    if (useCache) {
      await saveToCache(CACHE_KEYS.EQUIPMENT, data);
    }
    
    return data;
  } catch (error) {
    // On network error, try to use cache as fallback
    if (useCache) {
      const cached = await getFromCache(CACHE_KEYS.EQUIPMENT);
      if (cached) return cached;
    }
    
    // Re-throw if no cache available
    throw error;
  }
}

export async function fetchRecipes(options: RequestOptions = {}) {
  const { useCache = true, forceRefresh = false } = options;
  
  // Try cache first if appropriate
  if (useCache && !forceRefresh) {
    const cached = await getFromCache(CACHE_KEYS.RECIPES);
    if (cached) return cached;
  }
  
  try {
    const { data } = await api.get('/recipes');
    
    // Cache the fresh data
    if (useCache) {
      await saveToCache(CACHE_KEYS.RECIPES, data);
    }
    
    return data;
  } catch (error) {
    // On network error, try to use cache as fallback
    if (useCache) {
      const cached = await getFromCache(CACHE_KEYS.RECIPES);
      if (cached) return cached;
    }
    
    // Re-throw if no cache available
    throw error;
  }
}

// Add new functions for the batch cooking app

/**
 * Fetch all available meal plans for the discovery screen
 */
export async function fetchPlans(options: RequestOptions = {}): Promise<PlanSummary[]> {
  const { useCache = true, forceRefresh = false } = options;
  
  // Try cache first if appropriate
  if (useCache && !forceRefresh) {
    const cached = await getFromCache<PlanSummary[]>(CACHE_KEYS.PLANS);
    if (cached) return cached;
  }
  
  try {
    const { data } = await api.get<PlanSummary[]>('/plans');
    
    // Cache the fresh data
    if (useCache) {
      await saveToCache(CACHE_KEYS.PLANS, data);
    }
    
    return data;
  } catch (error) {
    // On network error, try to use cache as fallback
    if (useCache) {
      const cached = await getFromCache<PlanSummary[]>(CACHE_KEYS.PLANS);
      if (cached) return cached;
    }
    
    // Re-throw if no cache available
    throw error;
  }
}

/**
 * Fetch plan details by ID
 */
export async function fetchPlanById(planId: string, options: RequestOptions = {}): Promise<BatchCookingData> {
  const { useCache = true, forceRefresh = false } = options;
  const cacheKey = `${CACHE_KEYS.WEEK_DATA}${planId}`;
  
  // Try cache first if appropriate
  if (useCache && !forceRefresh) {
    const cached = await getFromCache<BatchCookingData>(cacheKey);
    if (cached) return cached;
  }
  
  try {
    const { data } = await api.get<BatchCookingData>(`/plans/${planId}`);
    
    // Cache the fresh data
    if (useCache) {
      await saveToCache(cacheKey, data);
    }
    
    return data;
  } catch (error) {
    // On network error, try to use cache as fallback
    if (useCache) {
      const cached = await getFromCache<BatchCookingData>(cacheKey);
      if (cached) return cached;
    }
    
    // Re-throw if no cache available
    throw error;
  }
}

/**
 * Update user preferences
 */
export async function updateUserPreferences(userId: string, preferences: UserPreferences): Promise<void> {
  await api.put(`/users/${userId}/preferences`, preferences);
}

/**
 * Check premium subscription status
 */
export async function checkPremiumStatus(userId: string): Promise<boolean> {
  try {
    const { data } = await api.get(`/users/${userId}/subscription`);
    return data.isPremium === true;
  } catch (error) {
    console.error('Failed to check premium status:', error);
    return false; // Default to non-premium on error
  }
}

/**
 * Generate AI custom menu plan (premium feature)
 */
export async function generateCustomPlan(
  preferences: UserPreferences,
  constraints: { 
    mealCount: number,
    timeLimit: number,
    seasonality: string
  }
): Promise<BatchCookingData> {
  const { data } = await api.post<BatchCookingData>('/plans/generate', {
    preferences,
    constraints
  });
  return data;
}

// Export axios instance for advanced usage
export { api };