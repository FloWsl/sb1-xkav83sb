import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import type { Recipe } from '../../types/schema';

const recipes: Recipe[] = [
  {
    id: '1',
    n: 'Poulet rôti',
    s: 12,
    notes: 'Bien assaisonné',
    i: [
      { id: '1', d: 'Poulet', p: '1 kg' },
      { id: '2', d: 'Herbes de Provence', p: '2 c. à soupe' }
    ],
    inst: ['Préchauffer le four', 'Assaisonner le poulet', 'Enfourner pendant 45 min']
  }
];

export default function RecipesScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [expandedRecipe, setExpandedRecipe] = useState<string | null>(null);
  const rotationAnimations = React.useRef<{ [key: string]: Animated.Value }>({});

  // Initialize animation values for each recipe
  React.useEffect(() => {
    recipes.forEach(recipe => {
      if (!rotationAnimations.current[recipe.id]) {
        rotationAnimations.current[recipe.id] = new Animated.Value(0);
      }
    });
  }, []);

  const toggleRecipe = (recipeId: string) => {
    const toValue = expandedRecipe === recipeId ? 0 : 1;
    Animated.spring(rotationAnimations.current[recipeId], {
      toValue,
      useNativeDriver: true,
    }).start();
    setExpandedRecipe(expandedRecipe === recipeId ? null : recipeId);
  };

  return (
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
      <View style={styles.header}>
        <Text style={[styles.title, isDark && styles.textLight]}>Recettes</Text>
      </View>

      <ScrollView style={styles.content}>
        {recipes.map(recipe => {
          const rotation = rotationAnimations.current[recipe.id]?.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '180deg'],
          });

          return (
            <View
              key={recipe.id}
              style={[styles.recipeCard, isDark && styles.recipeCardDark]}>
              <TouchableOpacity
                style={styles.recipeHeader}
                onPress={() => toggleRecipe(recipe.id)}>
                <Text style={[styles.recipeTitle, isDark && styles.textLight]}>{recipe.n}</Text>
                <Animated.View style={{ transform: [{ rotate: rotation }] }}>
                  <Ionicons
                    name="chevron-down"
                    size={24}
                    color={isDark ? '#FFFFFF' : '#000000'}
                  />
                </Animated.View>
              </TouchableOpacity>

              {expandedRecipe === recipe.id && (
                <View style={styles.recipeDetails}>
                  <Text style={[styles.recipeNotes, isDark && styles.textLight]}>
                    {recipe.notes}
                  </Text>

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
            </View>
          );
        })}
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
  content: {
    flex: 1,
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
  recipeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  recipeTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  recipeDetails: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  recipeNotes: {
    fontSize: 16,
    marginBottom: 20,
    fontStyle: 'italic',
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