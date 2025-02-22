// app/[tabs]/recipes.tsx
import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import { usePlanStore } from '../../store/planStore';
import useBatchCooking from '../../hooks/useBatchCooking';
import { useRouter } from 'expo-router';
import type { Recipe, Equipment } from '../../types/schema';
import styles from '../../styles';
import localStyles from '../styles/recipes.styles';

export default function RecipesScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const router = useRouter();
  const themeColors = styles.getThemeColors(colorScheme);

  // Get plan data from store
  const { selectedPlanId, recipes, equipment } = usePlanStore();
  
  // Get batch cooking state
  const { activePlanId, isLoading, planData } = useBatchCooking();
  
  // Determine if any plan is active from either store
  const activePlan = selectedPlanId || activePlanId;

  // Reset selected recipe when active plan changes
  useEffect(() => {
    setSelectedRecipe(null);
  }, [activePlan]);

  // Determine plan name from available sources
  const getPlanName = useMemo(() => {
    if (planData?.meta?.week) return planData.meta.week;
    
    // Fallback options if meta data isn't available
    if (selectedPlanId) return `Plan #${selectedPlanId}`;
    if (activePlanId) return `Plan #${activePlanId}`;
    
    return "Plan personnalisé";
  }, [planData, selectedPlanId, activePlanId]);

  // Helper function to get equipment icons
  const getEquipmentIcon = (name: string): string => {
    const icons: { [key: string]: string } = {
      'Four': 'flame-outline',
      'Plat à rôtir': 'restaurant-outline',
      'Couteau de chef': 'cut-outline',
      'Planche à découper': 'square-outline',
      'Cocotte': 'cafe-outline',
      'Poêle': 'disc-outline',
      'Mixeur': 'options-outline',
      'Batteur': 'sync-outline',
      'Spatule': 'swap-horizontal-outline',
      'Robot cuisine': 'hardware-chip-outline'
    };
    return icons[name] || 'build-outline';
  };

  // Show loading state
  if (isLoading) {
    return (
      <SafeAreaView style={[localStyles.container, isDark && localStyles.containerDark]}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#4A6FA5" />
          <Text style={[
            styles.typography.body,
            { marginTop: 16, color: themeColors.text }
          ]}>
            Chargement des recettes...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // If no plan is selected, show empty state
  if (!activePlan) {
    return (
      <SafeAreaView style={[localStyles.container, isDark && localStyles.containerDark]}>
        <View style={localStyles.emptyStateContainer}>
          <View style={localStyles.emptyStateIcon}>
            <Ionicons
              name="book-outline"
              size={120}
              color="#7E94B4"
            />
          </View>
          
          <Text
            style={[
              localStyles.emptyStateTitle,
              isDark && { color: '#6D9CDB' },
            ]}
          >
            Découvrez vos recettes
          </Text>
          
          <Text
            style={[
              localStyles.emptyStateText,
              isDark && { color: themeColors.secondaryText },
            ]}
          >
            Sélectionnez un plan de batch cooking pour voir toutes les recettes et l'équipement nécessaire pour votre session de cuisine.
          </Text>
          
          <TouchableOpacity
            style={localStyles.browseButton}
            onPress={() => router.replace('/')}
            activeOpacity={0.8}
          >
            <Text style={localStyles.browseButtonText}>
              PARCOURIR LES PLANS
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // If recipes array is empty, show appropriate message
  if (!recipes || recipes.length === 0) {
    return (
      <SafeAreaView style={[localStyles.container, isDark && localStyles.containerDark]}>
        <View style={localStyles.header}>
          <Text style={[localStyles.title, isDark && localStyles.textLight]}>
            Recettes & Équipement
          </Text>
          <Text style={[localStyles.planName, isDark && localStyles.textLight]}>
            {getPlanName}
          </Text>
        </View>
        
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
          <Ionicons
            name="restaurant-outline"
            size={80}
            color="#E0E0E0"
          />
          <Text
            style={[
              styles.typography.h3,
              { marginTop: 16, marginBottom: 8, color: themeColors.text, textAlign: 'center' }
            ]}
          >
            Aucune recette disponible
          </Text>
          <Text
            style={[
              styles.typography.body,
              { textAlign: 'center', marginBottom: 24, color: themeColors.secondaryText }
            ]}
          >
            Nous n'avons pas pu charger les recettes pour ce plan.
            Veuillez réessayer ou sélectionner un autre plan.
          </Text>
          <TouchableOpacity
            style={localStyles.browseButton}
            onPress={() => router.replace('/')}
          >
            <Text style={localStyles.browseButtonText}>
              RETOUR À L'ACCUEIL
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const renderEquipmentRow = () => {
    // If there's no equipment data
    if (!equipment || equipment.length === 0) {
      return (
        <View style={localStyles.equipmentContainer}>
          <Text style={[localStyles.sectionTitle, isDark && localStyles.textLight]}>
            Équipement nécessaire
          </Text>
          <Text style={[
            styles.typography.body2, 
            { color: themeColors.secondaryText, fontStyle: 'italic' }
          ]}>
            Aucun équipement spécifique requis.
          </Text>
        </View>
      );
    }
    
    return (
      <View style={localStyles.equipmentContainer}>
        <Text style={[localStyles.sectionTitle, isDark && localStyles.textLight]}>
          Équipement nécessaire
        </Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 16 }}
        >
          <View style={localStyles.equipmentRow}>
            {equipment.map((item, index) => (
              <View key={index} style={[localStyles.equipmentItem, isDark && localStyles.equipmentItemDark]}>
                <Ionicons
                  name={getEquipmentIcon(item.n)}
                  size={24}
                  color={isDark ? '#FFFFFF' : '#4A6FA5'}
                />
                <Text style={[localStyles.equipmentName, isDark && localStyles.textLight]}>
                  {item.n}
                </Text>
                {item.d && (
                  <Text style={[localStyles.equipmentDescription, isDark && localStyles.textLightSecondary]}>
                    {item.d}
                  </Text>
                )}
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  };

  return (
    <SafeAreaView style={[localStyles.container, isDark && localStyles.containerDark]}>
      <ScrollView>
        <View style={localStyles.header}>
          <Text style={[localStyles.title, isDark && localStyles.textLight]}>
            Recettes & Équipement
          </Text>
          <Text style={[localStyles.planName, isDark && localStyles.textLight]}>
            {getPlanName}
          </Text>
        </View>

        {renderEquipmentRow()}

        <Text style={[localStyles.recipesTitle, isDark && localStyles.textLight]}>
          {recipes.length} {recipes.length > 1 ? 'recettes' : 'recette'} au programme
        </Text>

        <View style={localStyles.recipesGrid}>
          {recipes.map((recipe, index) => (
            <TouchableOpacity
              key={recipe.id || index}
              style={[
                localStyles.recipeCard, 
                isDark && localStyles.recipeCardDark,
                selectedRecipe?.id === recipe.id && localStyles.selectedRecipeCard
              ]}
              onPress={() => setSelectedRecipe(recipe === selectedRecipe ? null : recipe)}
              activeOpacity={0.7}
              accessible={true}
              accessibilityLabel={`Recette ${recipe.n || `numéro ${index + 1}`}`}
              accessibilityHint="Appuyez pour voir les détails de la recette"
              accessibilityRole="button"
            >
              <View style={localStyles.recipeInfo}>
                <Text style={[localStyles.recipeName, isDark && localStyles.textLight]}>
                  {recipe.n || `Recette ${index + 1}`}
                </Text>
                <View style={localStyles.servingInfo}>
                  <Ionicons name="people-outline" size={14} color="#4A6FA5" />
                  <Text style={[localStyles.servingText, isDark && { color: '#FFFFFF' }]}>
                    {recipe.s || 4}
                  </Text>
                </View>
              </View>

              {selectedRecipe?.id === recipe.id && (
                <View style={localStyles.recipeDetails}>
                  <View style={localStyles.section}>
                    <Text style={[localStyles.sectionTitle, isDark && localStyles.textLight]}>
                      Ingrédients
                    </Text>
                    {recipe.i && recipe.i.length > 0 ? (
                      recipe.i.map((ingredient, idx) => (
                        <Text
                          key={`ingredient-${idx}`}
                          style={[localStyles.ingredientText, isDark && localStyles.textLight]}>
                          • {ingredient.d || ingredient.id} {ingredient.p && `(${ingredient.p})`}
                        </Text>
                      ))
                    ) : (
                      <Text style={[localStyles.ingredientText, isDark && localStyles.textLightSecondary]}>
                        Aucun ingrédient spécifié.
                      </Text>
                    )}
                  </View>

                  <View style={localStyles.section}>
                    <Text style={[localStyles.sectionTitle, isDark && localStyles.textLight]}>
                      Instructions
                    </Text>
                    {recipe.inst && recipe.inst.length > 0 ? (
                      recipe.inst.map((instruction, idx) => (
                        <Text
                          key={`instruction-${idx}`}
                          style={[localStyles.instructionText, isDark && localStyles.textLight]}>
                          {idx + 1}. {instruction}
                        </Text>
                      ))
                    ) : (
                      <Text style={[localStyles.instructionText, isDark && localStyles.textLightSecondary]}>
                        Aucune instruction spécifiée.
                      </Text>
                    )}
                  </View>

                  {recipe.notes && (
                    <View style={localStyles.section}>
                      <Text style={[localStyles.sectionTitle, isDark && localStyles.textLight]}>
                        Notes
                      </Text>
                      <Text style={[localStyles.notesText, isDark && localStyles.textLightSecondary]}>
                        {recipe.notes}
                      </Text>
                    </View>
                  )}
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}