import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useRouter } from 'expo-router';
import type { ShoppingListItem } from '../../types/schema';
import styles from '../../styles';
import { usePlanStore } from '../../store/planStore';

// Group ingredients by category
const groupIngredients = (items: ShoppingListItem[]) => {
  return items.reduce<Record<string, ShoppingListItem[]>>((acc, item) => {
    acc[item.cat] = acc[item.cat] || [];
    acc[item.cat].push(item);
    return acc;
  }, {});
};

export default function IngredientsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('');
  const [showAddItem, setShowAddItem] = useState(false);
  const [isPremium] = useState(true); // TODO: Replace with actual premium status check
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const themeColors = styles.getThemeColors(colorScheme);
  const router = useRouter();

  // Get store actions and state
  const { 
    ingredients, 
    addIngredient, 
    toggleIngredient,
    selectedPlanId 
  } = usePlanStore();

  // Add custom item
  const addCustomItem = useCallback(() => {
    if (!newItemName.trim() || !newItemCategory.trim()) {
      Alert.alert('Error', 'Please fill in both name and category');
      return;
    }

    const newItem: ShoppingListItem = {
      id: Date.now().toString(),
      cat: newItemCategory.trim(),
      n: newItemName.trim(),
      q: '1',
      u: 'unit',
      notes: '',
      r: '0',
      isChecked: false,
      customItem: true,
    };

    addIngredient(newItem);
    setNewItemName('');
    setNewItemCategory('');
    setShowAddItem(false);
  }, [newItemName, newItemCategory, addIngredient]);

  // Copy list to clipboard
  const copyToClipboard = useCallback(async () => {
    const text = ingredients
      .filter(item => !item.isChecked)
      .map(item => `- ${item.n} (${item.q} ${item.u})`)
      .join('\n');

    await Clipboard.setStringAsync(text);
    Alert.alert('Succès', 'Liste de courses copiée dans le presse-papier');
  }, [ingredients]);

  // Filter items based on search
  const filteredItems = ingredients.filter(item =>
    item.n.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedItems = groupIngredients(filteredItems);

  if (!isPremium) {
    return (
      <SafeAreaView style={[localStyles.container, isDark && localStyles.containerDark]}>
        <View style={localStyles.premiumPrompt}>
          <Ionicons
            name="lock-closed"
            size={48}
            color={themeColors.primary}
          />
          <Text style={[localStyles.premiumTitle, isDark && localStyles.textLight]}>
            Fonctionnalité Premium
          </Text>
          <Text style={[localStyles.premiumText, isDark && localStyles.textLight]}>
            Passez à la version Premium pour accéder à la liste de courses intelligente avec organisation automatique et synchronisation hors ligne.
          </Text>
          <TouchableOpacity
            style={localStyles.upgradeButton}
            onPress={() => {/* Handle upgrade */}}>
            <Text style={localStyles.upgradeButtonText}>
              Passer à la version Premium
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!selectedPlanId) {
    return (
      <SafeAreaView style={[localStyles.container, isDark && localStyles.containerDark]}>
        <View style={localStyles.emptyState}>
          <Ionicons
            name="basket-outline"
            size={48}
            color={themeColors.primary}
          />
          <Text style={[localStyles.emptyStateText, isDark && localStyles.textLight]}>
            Sélectionnez un plan de repas dans l'onglet Découverte pour voir votre liste de courses
          </Text>
          <TouchableOpacity
            style={localStyles.browseButton}
            onPress={() => router.replace('/')}>
            <Text style={localStyles.browseButtonText}>
              PARCOURIR LES PLANS
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[localStyles.container, isDark && localStyles.containerDark]}>
      <View style={localStyles.header}>
        <Text style={[localStyles.title, isDark && localStyles.textLight]}>
          Liste de courses
        </Text>
        <TouchableOpacity
          style={localStyles.copyButton}
          onPress={copyToClipboard}>
          <Ionicons
            name="copy-outline"
            size={24}
            color={isDark ? '#FFFFFF' : '#000000'}
          />
        </TouchableOpacity>
      </View>

      <View style={[localStyles.searchBar, isDark && localStyles.searchBarDark]}>
        <Ionicons
          name="search"
          size={20}
          color={isDark ? '#FFFFFF' : '#666666'}
        />
        <TextInput
          style={[localStyles.searchInput, isDark && localStyles.searchInputDark]}
          placeholder="Rechercher des ingrédients..."
          placeholderTextColor={isDark ? '#888888' : '#666666'}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {ingredients.length === 0 ? (
        <View style={localStyles.emptyState}>
          <Ionicons
            name="basket-outline"
            size={48}
            color={themeColors.primary}
          />
          <Text style={[localStyles.emptyStateText, isDark && localStyles.textLight]}>
            Votre liste de courses est vide
          </Text>
          <TouchableOpacity
            style={localStyles.addButton}
            onPress={() => setShowAddItem(true)}>
            <Text style={localStyles.addButtonText}>
              Ajouter un article
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView style={localStyles.content}>
          {Object.entries(groupedItems).map(([category, categoryItems]) => (
            <View key={category} style={localStyles.categorySection}>
              <Text style={[localStyles.categoryTitle, isDark && localStyles.textLight]}>
                {category}
              </Text>
              {categoryItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    localStyles.ingredientCard,
                    isDark && localStyles.ingredientCardDark,
                    item.isChecked && localStyles.ingredientCardChecked
                  ]}
                  onPress={() => toggleIngredient(item.id)}>
                  <View style={localStyles.checkboxContainer}>
                    <View style={[
                      localStyles.checkbox,
                      item.isChecked && localStyles.checkboxChecked
                    ]}>
                      {item.isChecked && (
                        <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                      )}
                    </View>
                  </View>
                  <View style={localStyles.ingredientInfo}>
                    <Text style={[
                      localStyles.ingredientName,
                      isDark && localStyles.textLight,
                      item.isChecked && localStyles.ingredientTextChecked
                    ]}>
                      {item.n}
                    </Text>
                    <Text style={[
                      localStyles.ingredientQuantity,
                      isDark && localStyles.textLight,
                      item.isChecked && localStyles.ingredientTextChecked
                    ]}>
                      {item.q} {item.u}
                    </Text>
                  </View>
                  {item.recipeName && (
                    <Text style={[
                      localStyles.recipeTag,
                      isDark && localStyles.recipeTagDark
                    ]}>
                      {item.recipeName}
                    </Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </ScrollView>
      )}

      {showAddItem && (
        <View style={[localStyles.addItemModal, isDark && localStyles.addItemModalDark]}>
          <View style={[localStyles.modalContent, isDark && localStyles.modalContentDark]}>
            <Text style={[localStyles.modalTitle, isDark && localStyles.textLight]}>
              Ajouter un article
            </Text>
            <TextInput
              style={[localStyles.modalInput, isDark && localStyles.modalInputDark]}
              placeholder="Nom de l'article"
              placeholderTextColor={isDark ? '#888888' : '#666666'}
              value={newItemName}
              onChangeText={setNewItemName}
            />
            <TextInput
              style={[localStyles.modalInput, isDark && localStyles.modalInputDark]}
              placeholder="Catégorie (ex: Légumes, Produits laitiers)"
              placeholderTextColor={isDark ? '#888888' : '#666666'}
              value={newItemCategory}
              onChangeText={setNewItemCategory}
            />
            <View style={localStyles.modalButtons}>
              <TouchableOpacity
                style={[localStyles.modalButton, localStyles.cancelButton]}
                onPress={() => {
                  setShowAddItem(false);
                  setNewItemName('');
                  setNewItemCategory('');
                }}>
                <Text style={localStyles.cancelButtonText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[localStyles.modalButton, localStyles.addButton]}
                onPress={addCustomItem}>
                <Text style={localStyles.addButtonText}>Ajouter</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {!showAddItem && (
        <TouchableOpacity
          style={[localStyles.fab, isDark && localStyles.fabDark]}
          onPress={() => setShowAddItem(true)}>
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  textLight: {
    color: '#FFFFFF',
  },
  copyButton: {
    padding: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    margin: 20,
    marginTop: 0,
    padding: 10,
    borderRadius: 10,
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    ...styles.shadows.sm,
  },
  ingredientCardDark: {
    backgroundColor: '#1A1A1A',
  },
  ingredientCardChecked: {
    opacity: 0.6,
  },
  checkboxContainer: {
    marginRight: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#4CAF50',
  },
  ingredientInfo: {
    flex: 1,
  },
  ingredientName: {
    fontSize: 16,
    fontWeight: '500',
  },
  ingredientQuantity: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  ingredientTextChecked: {
    textDecorationLine: 'line-through',
    color: '#999999',
  },
  recipeTag: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 12,
    color: '#1976D2',
  },
  recipeTagDark: {
    backgroundColor: '#1A237E',
    color: '#90CAF9',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    ...styles.shadows.md,
  },
  fabDark: {
    backgroundColor: '#388E3C',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  addItemModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  addItemModalDark: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    ...styles.shadows.lg,
  },
  modalContentDark: {
    backgroundColor: '#1A1A1A',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  modalInputDark: {
    backgroundColor: '#333333',
    color: '#FFFFFF',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
    marginRight: 8,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    marginLeft: 8,
  },
  cancelButtonText: {
    color: '#666666',
    fontSize: 16,
    fontWeight: '600',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  premiumPrompt: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  premiumTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 12,
  },
  premiumText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  upgradeButton: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    ...styles.shadows.sm,
  },
  upgradeButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
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