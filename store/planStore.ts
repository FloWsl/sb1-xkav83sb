// store/planStore.ts
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ShoppingListItem, Recipe, Equipment } from '../types/schema';

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

// Simpler serializer to avoid potential issues
const customSerializer = {
  serialize: (state: any) => {
    try {
      // Only serialize what we need, avoiding potential circular references
      const stateToSave = {
        selectedPlanId: state.selectedPlanId,
        // Only need to store IDs of ingredients, recipes, and equipment in storage
        // The actual data can be loaded again when needed
        ingredientIds: state.ingredients.map((item: any) => item.id),
        recipeIds: state.recipes.map((item: any) => item.id),
        equipmentIds: state.equipment.map((item: any) => item.id),
      };
      return JSON.stringify(stateToSave);
    } catch (error) {
      console.error('Serialization error:', error);
      return JSON.stringify({
        selectedPlanId: null,
        ingredientIds: [],
        recipeIds: [],
        equipmentIds: []
      });
    }
  },
  deserialize: (str: string) => {
    try {
      const savedState = JSON.parse(str);
      // Return a state object with empty arrays for the actual data
      // The data will be loaded when a plan is selected
      return {
        selectedPlanId: savedState.selectedPlanId,
        ingredients: [],
        recipes: [],
        equipment: []
      };
    } catch (error) {
      console.error('Deserialization error:', error);
      return {
        selectedPlanId: null,
        ingredients: [],
        recipes: [],
        equipment: []
      };
    }
  }
};

interface PlanStore {
  selectedPlanId: string | null;
  ingredients: ShoppingListItem[];
  recipes: Recipe[];
  equipment: Equipment[];
  setSelectedPlan: (planId: string | null) => void;
  addIngredient: (ingredient: ShoppingListItem) => void;
  toggleIngredient: (id: string) => void;
  loadIngredientsFromPlan: (ingredients: ShoppingListItem[]) => void;
  loadRecipesFromPlan: (recipes: Recipe[]) => void;
  loadEquipmentFromPlan: (equipment: Equipment[]) => void;
  clearPlanData: () => void;
}

export const usePlanStore = create<PlanStore>()(
  persist(
    (set, get) => ({
      selectedPlanId: null,
      ingredients: [],
      recipes: [],
      equipment: [],
      setSelectedPlan: (planId) => {
        console.log("Setting selected plan in store:", planId);
        // Force a re-render by creating a new state object
        set((state) => ({
          ...state,
          selectedPlanId: planId
        }));
      },
      addIngredient: (ingredient) => 
        set((state) => ({ 
          ingredients: [...state.ingredients, safeClone(ingredient)]
        })),
      toggleIngredient: (id) =>
        set((state) => ({
          ingredients: state.ingredients.map((item) =>
            item.id === id ? { ...item, isChecked: !item.isChecked } : item
          ),
        })),
      loadIngredientsFromPlan: (ingredients) => {
        console.log("Loading ingredients in store:", ingredients ? ingredients.length : 0);
        // Make sure ingredients are safely cloned before storing
        const safeIngredients = safeClone(ingredients || []);
        set((state) => ({
          ...state,
          ingredients: safeIngredients
        }));
      },
      loadRecipesFromPlan: (recipes) => {
        console.log("Loading recipes in store:", recipes ? recipes.length : 0);
        const safeRecipes = safeClone(recipes || []);
        set((state) => ({
          ...state,
          recipes: safeRecipes
        }));
      },
      loadEquipmentFromPlan: (equipment) => {
        console.log("Loading equipment in store:", equipment ? equipment.length : 0);
        const safeEquipment = safeClone(equipment || []);
        set((state) => ({
          ...state,
          equipment: safeEquipment
        }));
      },
      clearPlanData: () => {
        console.log("Clearing all plan data in store");
        set({
          selectedPlanId: null,
          ingredients: [],
          recipes: [],
          equipment: []
        });
      },
    }),
    {
      name: 'plan-storage',
      // Use a simpler storage implementation
      storage: {
        getItem: async (name) => {
          try {
            console.log("Getting item from storage:", name);
            const value = await AsyncStorage.getItem(name);
            if (!value) return null;
            console.log("Item found in storage:", name);
            return value;
          } catch (error) {
            console.error('Error getting item from storage:', error);
            return null;
          }
        },
        setItem: async (name, value) => {
          try {
            console.log("Setting item in storage:", name);
            await AsyncStorage.setItem(name, value);
            console.log("Item set in storage:", name);
          } catch (error) {
            console.error('Error setting item in storage:', error);
          }
        },
        removeItem: async (name) => {
          try {
            console.log("Removing item from storage:", name);
            await AsyncStorage.removeItem(name);
            console.log("Item removed from storage:", name);
          } catch (error) {
            console.error('Error removing item from storage:', error);
          }
        },
      },
      version: 1,
      partialize: (state) => ({
        selectedPlanId: state.selectedPlanId,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          console.log('Plan store hydrated successfully with selectedPlanId:', state.selectedPlanId);
        } else {
          console.warn('Plan store hydration failed');
        }
      },
    }
  )
);

// Add a debug listener
usePlanStore.subscribe(
  (state) => state.selectedPlanId,
  (selectedPlanId) => {
    console.log("Plan store selectedPlanId changed to:", selectedPlanId);
  }
);