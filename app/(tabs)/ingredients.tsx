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
import localStyles from '../styles/ingredients.styles';

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

