import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ShoppingListItem } from '../types/schema';

interface PlanStore {
  selectedPlanId: string | null;
  ingredients: ShoppingListItem[];
  setSelectedPlan: (planId: string) => void;
  addIngredient: (ingredient: ShoppingListItem) => void;
  toggleIngredient: (id: string) => void;
  loadIngredientsFromPlan: (ingredients: ShoppingListItem[]) => void;
  clearIngredients: () => void;
}

export const usePlanStore = create<PlanStore>()(
  persist(
    (set, get) => ({
      selectedPlanId: null,
      ingredients: [],
      setSelectedPlan: (planId) => set({ selectedPlanId: planId }),
      addIngredient: (ingredient) => 
        set((state) => ({ 
          ingredients: [...state.ingredients, ingredient] 
        })),
      toggleIngredient: (id) =>
        set((state) => ({
          ingredients: state.ingredients.map((item) =>
            item.id === id ? { ...item, isChecked: !item.isChecked } : item
          ),
        })),
      loadIngredientsFromPlan: (ingredients) => 
        set({ ingredients }),
      clearIngredients: () => 
        set({ ingredients: [] }),
    }),
    {
      name: 'plan-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
