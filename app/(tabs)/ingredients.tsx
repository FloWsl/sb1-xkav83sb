import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import type { Ingredient } from '../../types/schema';

const ingredients: Ingredient[] = [
  { id: '1', cat: 'Légumes', n: 'Carottes', q: '500', u: 'g', notes: 'bio', r: '100' },
  { id: '2', cat: 'Viandes', n: 'Poulet', q: '1', u: 'kg', notes: '', r: '0' },
  // Add more ingredients as needed
];

export default function IngredientsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const filteredIngredients = ingredients.filter(ing =>
    ing.n.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedIngredients = filteredIngredients.reduce<Record<string, Ingredient[]>>((acc, ing) => {
    acc[ing.cat] = acc[ing.cat] || [];
    acc[ing.cat].push(ing);
    return acc;
  }, {});

  return (
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
      <View style={styles.header}>
        <Text style={[styles.title, isDark && styles.textLight]}>Ingrédients</Text>
        <View style={[styles.searchBar, isDark && styles.searchBarDark]}>
          <Ionicons name="search" size={20} color={isDark ? '#FFFFFF' : '#666666'} />
          <TextInput
            style={[styles.searchInput, isDark && styles.searchInputDark]}
            placeholder="Rechercher un ingrédient..."
            placeholderTextColor={isDark ? '#888888' : '#666666'}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <ScrollView style={styles.content}>
        {Object.entries(groupedIngredients).map(([category, items]) => (
          <View key={category} style={styles.categorySection}>
            <Text style={[styles.categoryTitle, isDark && styles.textLight]}>{category}</Text>
            {items.map((ing) => (
              <TouchableOpacity
                key={ing.id}
                style={[styles.ingredientCard, isDark && styles.ingredientCardDark]}>
                <View style={styles.ingredientInfo}>
                  <Text style={[styles.ingredientName, isDark && styles.textLight]}>{ing.n}</Text>
                  <Text style={[styles.ingredientQuantity, isDark && styles.textLight]}>
                    {ing.q} {ing.u}
                  </Text>
                </View>
                {ing.notes && (
                  <Text style={[styles.ingredientNotes, isDark && styles.textLight]}>{ing.notes}</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        ))}
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
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
  },
  searchBarDark: {
    backgroundColor: '#1A1A1A',
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#000000',
  },
  searchInputDark: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  categorySection: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
  },
  ingredientCard: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  ingredientCardDark: {
    backgroundColor: '#1A1A1A',
  },
  ingredientInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ingredientName: {
    fontSize: 16,
    fontWeight: '500',
  },
  ingredientQuantity: {
    fontSize: 16,
    color: '#666666',
  },
  ingredientNotes: {
    fontSize: 14,
    color: '#666666',
    marginTop: 5,
    fontStyle: 'italic',
  },
});