import axios from 'axios';
import type { BatchCookingData } from '../types/schema';

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'https://api.example.com',
  timeout: 10000,
});

export async function fetchWeekData(week: number): Promise<BatchCookingData> {
  const { data } = await api.get<BatchCookingData>(`/weeks/${week}`);
  return data;
}

export async function fetchIngredients() {
  const { data } = await api.get('/ingredients');
  return data;
}

export async function fetchEquipment() {
  const { data } = await api.get('/equipment');
  return data;
}

export async function fetchRecipes() {
  const { data } = await api.get('/recipes');
  return data;
}