import { useQuery } from '@tanstack/react-query';
import { fetchWeekData, fetchIngredients, fetchEquipment, fetchRecipes } from '../lib/api';

export function useWeekData(week: number) {
  return useQuery({
    queryKey: ['week', week],
    queryFn: () => fetchWeekData(week),
  });
}

export function useIngredients() {
  return useQuery({
    queryKey: ['ingredients'],
    queryFn: fetchIngredients,
  });
}

export function useEquipment() {
  return useQuery({
    queryKey: ['equipment'],
    queryFn: fetchEquipment,
  });
}

export function useRecipes() {
  return useQuery({
    queryKey: ['recipes'],
    queryFn: fetchRecipes,
  });
}