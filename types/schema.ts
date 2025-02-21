// /types/schema.ts
export interface Ingredient {
  id: string;
  cat: string;
  n: string;
  q: number | string;
  u: string;
  notes: string;
  r: number | string;
}

export interface ShoppingListItem extends Ingredient {
  isChecked: boolean;
  recipeId?: string;
  recipeName?: string;
  customItem?: boolean;
}

export interface Equipment {
  n: string;
  d: string;
}

export interface RecipeIngredient {
  id: string;
  p: string;
  d: string;
}

export interface Recipe {
  id: string;
  n: string;
  s: number;
  i: RecipeIngredient[];
  inst: string[];
  notes: string;
}

export interface Task {
  t: string;
  i: string;
  c?: boolean; // Make completed optional
  pr?: string; // Make pr optional if it's not always present
  td?: number; // Optional timer duration in minutes
}

export interface Section {
  n: string;
  t: Task[];
}

export interface Phase {
  num: string;
  n: string;
  st: string;
  en: string;
  sec: Section[];
}

export interface BatchPlan {
  d: string;  // Total duration 
  p: Phase[]; // Phases - this property name is critical
}

export interface Meta {
  week: number;
  portions: number;
  estimated_cost: number;
  currency: string;
  preparation_time: string;
  conservation_notes?: string;
  accompaniments?: string[];
}

export interface BatchCookingData {
  i: Ingredient[];
  e: Equipment[];
  r: Recipe[];
  b: BatchPlan;
  meta: Meta;
}

// New interfaces for app functionality

export interface UserPreferences {
  dietaryPreferences: string[];
  excludedIngredients: string[];
  householdSize: number;
  kitchenEquipment: string[];
  isPremium: boolean;
}

export interface ActiveTimer {
  id: string;
  name: string;
  duration: number; // in seconds
  startTime: Date;
  isPaused: boolean;
  pausedTimeRemaining?: number;
  recipeId?: string;
}

export interface ActivePlanState {
  planId: string;
  activationDate: Date;
  currentPhase?: string;
  completedTasks: string[];
  activeTimers: ActiveTimer[];
  notes: string;
}

export interface PlanSummary {
  id: string;
  title: string;
  imageUrl: string;
  description: string;
  timeEstimate: string;
  recipeCount: number;
  tags: string[];
  isPremium: boolean;
  isNew: boolean;
}

export type CookingPlan = BatchCookingData;

export interface Subscription {
  level: 'free' | 'premium';
  startDate: Date;
  endDate?: Date;
  autoRenew: boolean;
  paymentMethod?: string;
}
