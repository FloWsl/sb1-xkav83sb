import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import type { Recipe, Equipment } from '../../types/schema';

// Sample data with enhanced recipe information
const recipes: Recipe[] = [
  {
    id: '1',
    n: 'Poulet rôti aux herbes',
    s: 4, // servings
    notes: 'Un classique familial parfaitement assaisonné',
    i: [
      { id: '1', d: 'Poulet entier', p: '1.5 kg' },
      { id: '2', d: 'Herbes de Provence', p: '2 c. à soupe' },
      { id: '3', d: 'Ail', p: '4 gousses' },
      { id: '4', d: 'Citron', p: '1 unité' },
      { id: '5', d: 'Huile d\'olive', p: '3 c. à soupe' }
    ],
    inst: [
      'Préchauffer le four à 200°C',
      'Frotter le poulet avec l\'huile et les herbes',
      'Placer l\'ail et le citron dans la cavité',
      'Enfourner pendant 1h15 ou jusqu\'à cuisson complète'
    ],
    image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=800',
    prepTime: '15 min',
    cookTime: '1h15'
  },
  {
    id: '2',
    n: 'Ratatouille provençale',
    s: 6,
    notes: 'Légumes d\'été mijotés à la perfection',
    i: [
      { id: '1', d: 'Aubergines', p: '2 unités' },
      { id: '2', d: 'Courgettes', p: '3 unités' },
      { id: '3', d: 'Poivrons', p: '2 unités' },
      { id: '4', d: 'Tomates', p: '4 unités' },
      { id: '5', d: 'Oignon', p: '1 gros' }
    ],
    inst: [
      'Couper tous les légumes en rondelles',
      'Faire revenir l\'oignon',
      'Ajouter les légumes un à un',
      'Mijoter à feu doux pendant 45 minutes'
    ],
    image: 'https://images.unsplash.com/photo-1572453800999-e8d2d1589b7c?w=800',
    prepTime: '30 min',
    cookTime: '45 min'
  }
];

// Equipment data with icons
const equipment: Equipment[] = [
  { n: 'Four', d: 'Four traditionnel ou chaleur tournante' },
  { n: 'Plat à rôtir', d: 'Pour la cuisson au four' },
  { n: 'Couteau de chef', d: 'Pour la découpe des ingrédients' },
  { n: 'Planche à découper', d: 'Surface de travail pour la préparation' },
  { n: 'Cocotte', d: 'Pour les plats mijotés' }
];

// Equipment icons mapping
const equipmentIcons: { [key: string]: string } = {
  'Four': 'flame-outline',
  'Plat à rôtir': 'restaurant-outline',
  'Couteau de chef': 'cut-outline',
  'Planche à découper': 'square-outline',
  'Cocotte': 'cafe-outline'
};

export default function RecipesScreen() {
  const { width } = useWindowDimensions();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const renderEquipmentRow = () => (
    <View style={styles.equipmentContainer}>
      <Text style={[styles.sectionTitle, isDark && styles.textLight]}>
        Équipement nécessaire
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.equipmentRow}>
          {equipment.map((item, index) => (
            <View key={index} style={[styles.equipmentItem, isDark && styles.equipmentItemDark]}>
              <Ionicons
                name={equipmentIcons[item.n] || 'build-outline'}
                size={24}
                color={isDark ? '#FFFFFF' : '#000000'}
              />
              <Text style={[styles.equipmentName, isDark && styles.textLight]}>
                {item.n}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={[styles.title, isDark && styles.textLight]}>
            Recettes & Équipement
          </Text>
        </View>

        {renderEquipmentRow()}

        <View style={styles.recipesGrid}>
          {recipes.map(recipe => (
            <TouchableOpacity
              key={recipe.id}
              style={[styles.recipeCard, isDark && styles.recipeCardDark]}
              onPress={() => setSelectedRecipe(recipe === selectedRecipe ? null : recipe)}>
              <Image
                source={{ uri: recipe.image }}
                style={styles.recipeImage}
              />
              <View style={styles.recipeInfo}>
                <Text style={[styles.recipeName, isDark && styles.textLight]}>
                  {recipe.n}
                </Text>
                <View style={styles.timeInfo}>
                  <View style={styles.timeItem}>
                    <Ionicons name="time-outline" size={16} color={isDark ? '#FFFFFF' : '#666666'} />
                    <Text style={[styles.timeText, isDark && styles.textLight]}>
                      Prep: {recipe.prepTime}
                    </Text>
                  </View>
                  <View style={styles.timeItem}>
                    <Ionicons name="flame-outline" size={16} color={isDark ? '#FFFFFF' : '#666666'} />
                    <Text style={[styles.timeText, isDark && styles.textLight]}>
                      Cuisson: {recipe.cookTime}
                    </Text>
                  </View>
                </View>
              </View>

              {selectedRecipe?.id === recipe.id && (
                <View style={styles.recipeDetails}>
                  <Text style={[styles.recipeNotes, isDark && styles.textLight]}>
                    {recipe.notes}
                  </Text>

                  <View style={styles.servingInfo}>
                    <Ionicons name="people-outline" size={20} color={isDark ? '#FFFFFF' : '#000000'} />
                    <Text style={[styles.servingText, isDark && styles.textLight]}>
                      {recipe.s} portions
                    </Text>
                  </View>

                  <View style={styles.section}>
                    <Text style={[styles.sectionTitle, isDark && styles.textLight]}>
                      Ingrédients:
                    </Text>
                    {recipe.i.map((ingredient, index) => (
                      <Text
                        key={index}
                        style={[styles.ingredientText, isDark && styles.textLight]}>
                        • {ingredient.d} ({ingredient.p})
                      </Text>
                    ))}
                  </View>

                  <View style={styles.section}>
                    <Text style={[styles.sectionTitle, isDark && styles.textLight]}>
                      Instructions:
                    </Text>
                    {recipe.inst.map((instruction, index) => (
                      <Text
                        key={index}
                        style={[styles.instructionText, isDark && styles.textLight]}>
                        {index + 1}. {instruction}
                      </Text>
                    ))}
                  </View>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
    width: 100,
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
    fontSize: 12,
    textAlign: 'center',
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
  },
  recipeCardDark: {
    backgroundColor: '#1A1A1A',
  },
  recipeImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  recipeInfo: {
    padding: 15,
  },
  recipeName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  timeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  timeText: {
    fontSize: 14,
    color: '#666666',
  },
  recipeDetails: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  recipeNotes: {
    fontSize: 16,
    marginBottom: 15,
    fontStyle: 'italic',
  },
  servingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 15,
  },
  servingText: {
    fontSize: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  ingredientText: {
    fontSize: 16,
    marginBottom: 5,
  },
  instructionText: {
    fontSize: 16,
    marginBottom: 10,
    lineHeight: 24,
  },
});
