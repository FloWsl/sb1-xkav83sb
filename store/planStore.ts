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

// Custom serializer to handle non-serializable data
const customSerializer = {
  serialize: (state: any) => {
    try {
      // Use safe cloning to ensure everything is serializable
      const safeState = safeClone(state);
      return JSON.stringify(safeState);
    } catch (error) {
      console.error('Serialization error:', error);
      return JSON.stringify({
        selectedPlanId: null,
        ingredients: [],
        recipes: [],
        equipment: []
      });
    }
  },
  deserialize: (str: string) => {
    try {
      return JSON.parse(str, (key, value) => {
        // Revive special cases
        if (value && value.__type === 'Date') {
          return new Date(value.value);
        }
        return value;
      });
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
    (set) => ({
      selectedPlanId: null,
      ingredients: [],
      recipes: [],
      equipment: [],
      setSelectedPlan: (planId) => {
        console.log("Setting selected plan in store:", planId);
        set({ selectedPlanId: planId });
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
        console.log("Loading ingredients in store:", ingredients.length);
        // Make sure ingredients are safely cloned before storing
        const safeIngredients = safeClone(ingredients);
        set({ ingredients: safeIngredients });
      },
      loadRecipesFromPlan: (recipes) => {
        console.log("Loading recipes in store:", recipes.length);
        const safeRecipes = safeClone(recipes);
        set({ recipes: safeRecipes });
      },
      loadEquipmentFromPlan: (equipment) => {
        console.log("Loading equipment in store:", equipment.length);
        const safeEquipment = safeClone(equipment);
        set({ equipment: safeEquipment });
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
      storage: createJSONStorage(() => ({
        getItem: async (name) => {
          try {
            const value = await AsyncStorage.getItem(name);
            return value ? customSerializer.deserialize(value) : null;
          } catch (error) {
            console.error('Error getting item from storage:', error);
            return null;
          }
        },
        setItem: async (name, value) => {
          try {
            // Ensure value is serializable before storing
            await AsyncStorage.setItem(name, customSerializer.serialize(value));
          } catch (error) {
            console.error('Error setting item in storage:', error);
          }
        },
        removeItem: async (name) => {
          try {
            await AsyncStorage.removeItem(name);
          } catch (error) {
            console.error('Error removing item from storage:', error);
          }
        },
      })),
      version: 1,
      onRehydrateStorage: () => (state) => {
        if (state) {
          console.log('Plan store hydrated successfully');
        } else {
          console.warn('Plan store hydration failed');
        }
      },
    }
  )
);

