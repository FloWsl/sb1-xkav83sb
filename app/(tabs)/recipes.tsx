import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  useWindowDimensions,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import { usePlanStore } from '../../store/planStore';
import { useRouter } from 'expo-router';
import type { Recipe, Equipment } from '../../types/schema';
import styles from '../../styles';

export default function RecipesScreen() {
  const { width } = useWindowDimensions();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const router = useRouter();

  // Get plan data from store
  const { selectedPlanId, recipes, equipment } = usePlanStore();

  // If no plan is selected, show empty state
  if (!selectedPlanId) {
    return (
      <SafeAreaView style={[localStyles.container, isDark && localStyles.containerDark]}>
        <View style={localStyles.emptyStateContainer}>
          <Ionicons
            name="book-outline"
            size={80}
            color={isDark ? '#555555' : '#CCCCCC'}
          />
          <Text style={[localStyles.emptyStateTitle, isDark && localStyles.textLight]}>
            Aucun plan sélectionné
          </Text>
          <Text style={[localStyles.emptyStateText, isDark && localStyles.textLight]}>
            Sélectionnez d'abord un plan de batch cooking dans l'onglet Découverte pour voir les recettes.
          </Text>
          <TouchableOpacity
            style={localStyles.browseButton}
            onPress={() => router.replace('/')}
          >
            <Text style={localStyles.browseButtonText}>
              PARCOURIR LES PLANS
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const renderEquipmentRow = () => (
    <View style={localStyles.equipmentContainer}>
      <Text style={[localStyles.sectionTitle, isDark && localStyles.textLight]}>
        Équipement nécessaire
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={localStyles.equipmentRow}>
          {equipment.map((item, index) => (
            <View key={index} style={[localStyles.equipmentItem, isDark && localStyles.equipmentItemDark]}>
              <Ionicons
                name={getEquipmentIcon(item.n)}
                size={24}
                color={isDark ? '#FFFFFF' : '#000000'}
              />
              <Text style={[localStyles.equipmentName, isDark && localStyles.textLight]}>
                {item.n}
              </Text>
              <Text style={[localStyles.equipmentDescription, isDark && localStyles.textLight]}>
                {item.d}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );

  // Helper function to get equipment icons
  const getEquipmentIcon = (name: string): string => {
    const icons: { [key: string]: string } = {
      'Four': 'flame-outline',
      'Plat à rôtir': 'restaurant-outline',
      'Couteau de chef': 'cut-outline',
      'Planche à découper': 'square-outline',
      'Cocotte': 'cafe-outline'
    };
    return icons[name] || 'build-outline';
  };

  return (
    <SafeAreaView style={[localStyles.container, isDark && localStyles.containerDark]}>
      <ScrollView>
        <View style={localStyles.header}>
          <Text style={[localStyles.title, isDark && localStyles.textLight]}>
            Recettes & Équipement
          </Text>
        </View>

        {renderEquipmentRow()}

        <View style={localStyles.recipesGrid}>
          {recipes.map(recipe => (
            <TouchableOpacity
              key={recipe.id}
              style={[localStyles.recipeCard, isDark && localStyles.recipeCardDark]}
              onPress={() => setSelectedRecipe(recipe === selectedRecipe ? null : recipe)}>
              <View style={localStyles.recipeInfo}>
                <Text style={[localStyles.recipeName, isDark && localStyles.textLight]}>
                  {recipe.n}
                </Text>
                <View style={localStyles.servingInfo}>
                  <Ionicons name="people-outline" size={16} color={isDark ? '#FFFFFF' : '#666666'} />
                  <Text style={[localStyles.servingText, isDark && localStyles.textLight]}>
                    {recipe.s} portions
                  </Text>
                </View>
              </View>

              {selectedRecipe?.id === recipe.id && (
                <View style={localStyles.recipeDetails}>
                  <View style={localStyles.section}>
                    <Text style={[localStyles.sectionTitle, isDark && localStyles.textLight]}>
                      Ingrédients:
                    </Text>
                    {recipe.i.map((ingredient, index) => (
                      <Text
                        key={index}
                        style={[localStyles.ingredientText, isDark && localStyles.textLight]}>
                        • {ingredient.d} ({ingredient.p})
                      </Text>
                    ))}
                  </View>

                  <View style={localStyles.section}>
                    <Text style={[localStyles.sectionTitle, isDark && localStyles.textLight]}>
                      Instructions:
                    </Text>
                    {recipe.inst.map((instruction, index) => (
                      <Text
                        key={index}
                        style={[localStyles.instructionText, isDark && localStyles.textLight]}>
                        {index + 1}. {instruction}
                      </Text>
                    ))}
                  </View>

                  {recipe.notes && (
                    <View style={localStyles.section}>
                      <Text style={[localStyles.sectionTitle, isDark && localStyles.textLight]}>
                        Notes:
                      </Text>
                      <Text style={[localStyles.notesText, isDark && localStyles.textLight]}>
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

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  containerDark: {
    backgroundColor: '#000000',
  },
  header: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  textLight: {
    color: '#FFFFFF',
  },
  equipmentContainer: {
    padding: 20,
    paddingTop: 0,
  },
  equipmentRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    gap: 15,
  },
  equipmentItem: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 12,
    width: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  equipmentItemDark: {
    backgroundColor: '#1A1A1A',
  },
  equipmentName: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  equipmentDescription: {
    marginTop: 4,
    fontSize: 12,
    textAlign: 'center',
    color: '#666666',
  },
  recipesGrid: {
    padding: 20,
  },
  recipeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    marginBottom: 20,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    padding: 15,
  },
  recipeCardDark: {
    backgroundColor: '#1A1A1A',
  },
  recipeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recipeName: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  servingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  servingText: {
    fontSize: 14,
    color: '#666666',
  },
  recipeDetails: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  ingredientText: {
    fontSize: 14,
    marginBottom: 5,
  },
  instructionText: {
    fontSize: 14,
    marginBottom: 10,
    lineHeight: 20,
  },
  notesText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#666666',
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  emptyStateTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666666',
    marginBottom: 30,
  },
  browseButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  browseButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});