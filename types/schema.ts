export interface Ingredient {
  id: string;
  cat: string;
  n: string;
  q: number | string;
  u: string;
  notes: string;
  r: number | string;
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
  c: boolean;
  pr: string;
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
  d: string;
  p: Phase[];
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