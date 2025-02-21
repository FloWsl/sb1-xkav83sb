// app/[tabs]/index.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
  Dimensions,
  FlatList,
  useColorScheme,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { dummyMenus, dummyShoppingItems } from '../../lib/dummyData';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import styles from '../../styles';
import { usePlanStore } from '../../store/planStore';
import useBatchCooking from '../../hooks/useBatchCooking';
import type { ShoppingListItem } from '../../types/schema';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

// Filter options
const seasons = ['Printemps', 'Été', 'Automne', 'Hiver'];
const dietaryOptions = ['Végétarien', 'Sans Gluten', 'Low-Carb', 'Vegan'];
const timeFilters = ['1-2h', '2-3h', '3h+'];

// Sample menu data
const menus = dummyMenus.map(menu => {
  // For display in the UI, we need to add a few properties
  return {
    ...menu,
    id: menu.id,
    title: menu.title,
    image: menu.imageUrl,
    timeInvestment: menu.timeEstimate,
    recipes: ['Recette 1', 'Recette 2', 'Recette 3'], // Sample recipes list
    tags: menu.tags,
    season: menu.tags.includes('Printemps') ? 'Printemps' : 
            menu.tags.includes('Été') ? 'Été' :
            menu.tags.includes('Automne') ? 'Automne' : 'Hiver',
    isPremium: menu.isPremium,
    servings: 4,
    ingredients: dummyShoppingItems[menu.id] || []
  };
});

export default function DiscoveryScreen() {
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [selectedDiets, setSelectedDiets] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const themeColors = styles.getThemeColors(colorScheme);
  const router = useRouter();

  // Get plan store actions
  const { setSelectedPlan, loadIngredientsFromPlan, selectedPlanId, clearIngredients } =
    usePlanStore();

  // Add the batch cooking hook
  const {
    activePlanId,
    activatePlan,
    clearActivePlan,
    isLoading: isActivatingPlan,
  } = useBatchCooking();

  // Sync state between stores when component mounts
  useEffect(() => {
    const syncStoresState = async () => {
      // If batchCooking has an active plan but planStore doesn't, update planStore
      if (activePlanId && !selectedPlanId) {
        const plan = menus.find(m => m.id === activePlanId);
        if (plan) {
          console.log('Syncing from batchCooking to planStore:', activePlanId);
          setSelectedPlan(activePlanId);
          loadIngredientsFromPlan(plan.ingredients);
        }
      } 
      // If planStore has a selected plan but batchCooking doesn't, update batchCooking
      else if (selectedPlanId && !activePlanId) {
        console.log('Syncing from planStore to batchCooking:', selectedPlanId);
        await activatePlan(selectedPlanId);
      }
    };

    syncStoresState();
  }, [activePlanId, selectedPlanId]);

  const toggleDiet = (diet) => {
    setSelectedDiets((prev) =>
      prev.includes(diet) ? prev.filter((d) => d !== diet) : [...prev, diet]
    );
  };

  // Create a helper function to check if a menu is selected in either store
  const isMenuSelected = (menuId) => {
    return selectedPlanId === menuId || activePlanId === menuId;
  };

  // Handle plan selection or deselection
  const handlePlanSelection = async (menu) => {
    // If there's a plan already selected
    if (isMenuSelected(menu.id)) {
      try {
        // Show confirmation dialog
        Alert.alert(
          'Désactiver le plan',
          'Voulez-vous vraiment désactiver ce plan ? Votre progression sera perdue.',
          [
            {
              text: 'Annuler',
              style: 'cancel'
            },
            {
              text: 'Désactiver',
              style: 'destructive',
              onPress: async () => {
                setIsLoading(true);
                try {
                  // First clear the batch cooking state
                  await clearActivePlan();
                  console.log("Cleared batch cooking state");
                  
                  // Then clear the plan store state
                  clearIngredients();
                  setSelectedPlan(null);
                  console.log("Cleared plan store state");
                  
                  Alert.alert('Succès', 'Le plan a été désactivé.');
                  setSelectedMenu(null); // Close the modal
                } finally {
                  setIsLoading(false);
                }
              }
            }
          ]
        );
      } catch (error) {
        console.error('Failed to deactivate plan:', error);
        Alert.alert('Erreur', 'Impossible de désactiver le plan. Veuillez réessayer.');
      }
      return;
    }
    
    // If we're activating a new plan
    try {
      // Show confirmation dialog
      Alert.alert(
        'Activer le plan',
        isMenuSelected(null) 
          ? 'Voulez-vous activer ce plan de batch cooking ?'
          : 'Un autre plan est déjà actif. Voulez-vous le remplacer par celui-ci ?',
        [
          {
            text: 'Annuler',
            style: 'cancel'
          },
          {
            text: 'Activer',
            onPress: async () => {
              setIsLoading(true);
              
              try {
                // First clear any existing plan
                if (activePlanId || selectedPlanId) {
                  await clearActivePlan();
                  clearIngredients();
                  setSelectedPlan(null);
                  console.log("Cleared previous plan");
                }
                
                // Then activate the new plan
                console.log("Setting new plan:", menu.id);
                
                // First activate the batch cooking plan
                const success = await activatePlan(menu.id);
                console.log("Updated batch cooking state:", success);
                
                if (success) {
                  // Then update the plan store with all plan data
                  setSelectedPlan(menu.id);
                  loadIngredientsFromPlan(menu.ingredients);
                  
                  console.log("Updated plan store");
                  
                  Alert.alert(
                    'Succès',
                    'Le plan a été activé ! Vous pouvez maintenant accéder aux instructions dans l\'onglet Cooking.',
                    [
                      {
                        text: 'Voir les recettes',
                        onPress: () => {
                          setSelectedMenu(null); // Close the modal
                          router.push('/recipes');
                        }
                      },
                      {
                        text: 'OK',
                        onPress: () => {
                          setSelectedMenu(null); // Close the modal
                        }
                      }
                    ]
                  );
                }
              } catch (error) {
                console.error('Failed to activate plan:', error);
                Alert.alert('Erreur', 'Impossible d\'activer le plan. Veuillez réessayer.');
              } finally {
                setIsLoading(false);
              }
            }
          }
        ]
      );
    } catch (error) {
      console.error('Failed to show activation dialog:', error);
      Alert.alert('Erreur', 'Une erreur est survenue. Veuillez réessayer.');
    }
  };

  const renderMenuCard = ({ item }) => (
    <TouchableOpacity
      style={[
        localStyles.menuCard,
        isDark && localStyles.menuCardDark,
        isMenuSelected(item.id) && localStyles.selectedMenuCard,
      ]}
      onPress={() => setSelectedMenu(item)}
    >
      <Image source={{ uri: item.image }} style={localStyles.menuImage} />
      <View style={localStyles.badgeContainer}>
        <View
          style={[
            localStyles.badge,
            item.isPremium ? localStyles.premiumBadge : localStyles.freeBadge,
          ]}
        >
          <Text style={localStyles.badgeText}>
            {item.isPremium ? 'Premium' : 'Gratuit'}
          </Text>
        </View>
        <View style={localStyles.timeBadge}>
          <Ionicons name="time-outline" size={14} color="#FFFFFF" />
          <Text style={localStyles.badgeText}>{item.timeInvestment}</Text>
        </View>
        {isMenuSelected(item.id) && (
          <View style={localStyles.selectedBadge}>
            <Ionicons name="checkmark-circle" size={14} color="#FFFFFF" />
            <Text style={localStyles.badgeText}>Sélectionné</Text>
          </View>
        )}
      </View>
      <View
        style={[localStyles.cardContent, isDark && localStyles.cardContentDark]}
      >
        <Text style={[localStyles.menuTitle, isDark && localStyles.textLight]}>
          {item.title}
        </Text>
        <View style={localStyles.tagsContainer}>
          {item.tags.map((tag, index) => (
            <View key={index} style={localStyles.tag}>
              <Text style={localStyles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
        <Text
          style={[localStyles.recipesTitle, isDark && localStyles.textLight]}
        >
          Recettes incluses:
        </Text>
        {item.recipes.map((recipe, index) => (
          <Text
            key={index}
            style={[localStyles.recipeItem, isDark && localStyles.textLight]}
          >
            • {recipe}
          </Text>
        ))}
      </View>
    </TouchableOpacity>
  );

  if (isLoading || isActivatingPlan) {
    return (
      <SafeAreaView style={[localStyles.container, isDark && localStyles.containerDark]}>
        <View style={localStyles.loadingContainer}>
          <ActivityIndicator size="large" color={themeColors.primary} />
          <Text style={[localStyles.loadingText, isDark && localStyles.textLight]}>
            {isMenuSelected(null) ? 'Activation du plan...' : 'Désactivation du plan...'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[localStyles.container, isDark && localStyles.containerDark]}
    >
      <View style={localStyles.header}>
        <Text style={[localStyles.title, isDark && localStyles.textLight]}>
          Découvrez nos menus
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={localStyles.filtersContainer}
      >
        {seasons.map((season) => (
          <TouchableOpacity
            key={season}
            style={[
              localStyles.filterChip,
              selectedSeason === season && localStyles.filterChipActive,
              isDark && localStyles.filterChipDark,
            ]}
            onPress={() =>
              setSelectedSeason((prev) => (prev === season ? null : season))
            }
          >
            <Text
              style={[
                localStyles.filterText,
                selectedSeason === season && localStyles.filterTextActive,
                isDark && localStyles.textLight,
              ]}
            >
              {season}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={localStyles.filtersContainer}
      >
        {dietaryOptions.map((diet) => (
          <TouchableOpacity
            key={diet}
            style={[
              localStyles.filterChip,
              selectedDiets.includes(diet) && localStyles.filterChipActive,
              isDark && localStyles.filterChipDark,
            ]}
            onPress={() => toggleDiet(diet)}
          >
            <Text
              style={[
                localStyles.filterText,
                selectedDiets.includes(diet) && localStyles.filterTextActive,
                isDark && localStyles.textLight,
              ]}
            >
              {diet}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={localStyles.filtersContainer}
      >
        {timeFilters.map((time) => (
          <TouchableOpacity
            key={time}
            style={[
              localStyles.filterChip,
              selectedTime === time && localStyles.filterChipActive,
              isDark && localStyles.filterChipDark,
            ]}
            onPress={() =>
              setSelectedTime((prev) => (prev === time ? null : time))
            }
          >
            <Text
              style={[
                localStyles.filterText,
                selectedTime === time && localStyles.filterTextActive,
                isDark && localStyles.textLight,
              ]}
            >
              {time}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={menus}
        renderItem={renderMenuCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={localStyles.menuList}
      />

      <Modal
        visible={selectedMenu !== null}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedMenu(null)}
      >
        <View style={localStyles.modalOverlay}>
          <View
            style={[
              localStyles.modalContent,
              isDark && localStyles.modalContentDark,
            ]}
          >
            <TouchableOpacity
              style={localStyles.closeButton}
              onPress={() => setSelectedMenu(null)}
            >
              <Ionicons
                name="close"
                size={24}
                color={isDark ? '#FFFFFF' : '#000000'}
              />
            </TouchableOpacity>

            {selectedMenu && (
              <ScrollView>
                <Image
                  source={{ uri: selectedMenu.image }}
                  style={localStyles.modalImage}
                />

                <View style={localStyles.modalHeader}>
                  <Text
                    style={[
                      localStyles.modalTitle,
                      isDark && localStyles.textLight,
                    ]}
                  >
                    {selectedMenu.title}
                  </Text>
                  <View style={localStyles.modalBadges}>
                    <View
                      style={[
                        localStyles.badge,
                        selectedMenu.isPremium
                          ? localStyles.premiumBadge
                          : localStyles.freeBadge,
                      ]}
                    >
                      <Text style={localStyles.badgeText}>
                        {selectedMenu.isPremium ? 'Premium' : 'Gratuit'}
                      </Text>
                    </View>
                    <View style={localStyles.timeBadge}>
                      <Ionicons name="time-outline" size={14} color="#FFFFFF" />
                      <Text style={localStyles.badgeText}>
                        {selectedMenu.timeInvestment}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={localStyles.tabButtons}>
                  <TouchableOpacity
                    style={[
                      localStyles.tabButton,
                      activeTab === 'overview' && localStyles.activeTab,
                    ]}
                    onPress={() => setActiveTab('overview')}
                  >
                    <Text
                      style={[
                        localStyles.tabButtonText,
                        activeTab === 'overview' && localStyles.activeTabText,
                        isDark && localStyles.textLight,
                      ]}
                    >
                      Aperçu
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      localStyles.tabButton,
                      activeTab === 'ingredients' && localStyles.activeTab,
                    ]}
                    onPress={() => setActiveTab('ingredients')}
                  >
                    <Text
                      style={[
                        localStyles.tabButtonText,
                        activeTab === 'ingredients' &&
                          localStyles.activeTabText,
                        isDark && localStyles.textLight,
                      ]}
                    >
                      Ingrédients
                    </Text>
                  </TouchableOpacity>
                </View>

                {activeTab === 'overview' ? (
                  <View style={localStyles.tabContent}>
                    <View style={localStyles.infoRow}>
                      <Ionicons
                        name="people-outline"
                        size={20}
                        color={isDark ? '#FFFFFF' : '#000000'}
                      />
                      <Text
                        style={[
                          localStyles.infoText,
                          isDark && localStyles.textLight,
                        ]}
                      >
                        {selectedMenu.servings} portions
                      </Text>
                    </View>
                    <View style={localStyles.infoRow}>
                      <Ionicons
                        name="time-outline"
                        size={20}
                        color={isDark ? '#FFFFFF' : '#000000'}
                      />
                      <Text
                        style={[
                          localStyles.infoText,
                          isDark && localStyles.textLight,
                        ]}
                      >
                        Temps total: {selectedMenu.timeInvestment}
                      </Text>
                    </View>
                    <Text
                      style={[
                        localStyles.sectionTitle,
                        isDark && localStyles.textLight,
                      ]}
                    >
                      Recettes incluses:
                    </Text>
                    {selectedMenu.recipes.map((recipe, index) => (
                      <Text
                        key={index}
                        style={[
                          localStyles.recipeItem,
                          isDark && localStyles.textLight,
                        ]}
                      >
                        • {recipe}
                      </Text>
                    ))}
                  </View>
                ) : (
                  <View style={localStyles.tabContent}>
                    {Object.entries(
                      selectedMenu.ingredients.reduce((acc, item) => {
                        acc[item.cat] = acc[item.cat] || [];
                        acc[item.cat].push(item);
                        return acc;
                      }, {})
                    ).map(([category, items]) => (
                      <View
                        key={category}
                        style={localStyles.ingredientCategory}
                      >
                        <Text
                          style={[
                            localStyles.categoryTitle,
                            isDark && localStyles.textLight,
                          ]}
                        >
                          {category}
                        </Text>
                        {items.map((item, index) => (
                          <Text
                            key={index}
                            style={[
                              localStyles.ingredientItem,
                              isDark && localStyles.textLight,
                            ]}
                          >
                            • {item.n} ({item.q} {item.u})
                          </Text>
                        ))}
                      </View>
                    ))}
                  </View>
                )}

                <TouchableOpacity
                  style={[
                    localStyles.selectButton,
                    isMenuSelected(selectedMenu.id) && localStyles.selectedButton,
                    (isLoading || isActivatingPlan) && { opacity: 0.7 },
                  ]}
                  onPress={() => {
                    console.log("Plan selection button pressed for:", selectedMenu.id);
                    handlePlanSelection(selectedMenu);
                  }}
                  disabled={isLoading || isActivatingPlan}
                >
                  <Text style={localStyles.selectButtonText}>
                    {isLoading || isActivatingPlan
                      ? 'CHARGEMENT...'
                      : isMenuSelected(selectedMenu.id)
                      ? 'DÉSACTIVER CE PLAN'
                      : 'SÉLECTIONNER CE PLAN'}
                  </Text>
                </TouchableOpacity>

                {selectedMenu.isPremium && (
                  <TouchableOpacity
                    style={localStyles.customizeButton}
                    onPress={() => {
                      // Handle customization
                      setSelectedMenu(null);
                    }}
                  >
                    <Text style={localStyles.customizeButtonText}>
                      Créer mon plan personnalisé
                    </Text>
                  </TouchableOpacity>
                )}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
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
  filtersContainer: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  filterChip: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  filterChipDark: {
    backgroundColor: '#1A1A1A',
    borderColor: '#333333',
  },
  filterChipActive: {
    backgroundColor: '#FF6B6B',
    borderColor: '#FF6B6B',
  },
  filterText: {
    fontSize: 14,
    color: '#666666',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  menuList: {
    padding: 20,
  },
  menuCard: {
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
  menuCardDark: {
    backgroundColor: '#1A1A1A',
  },
  selectedMenuCard: {
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  menuImage: {
    width: '100%',
    height: 200,
  },
  badgeContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    gap: 10,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  premiumBadge: {
    backgroundColor: '#FFD700',
  },
  freeBadge: {
    backgroundColor: '#4CAF50',
  },
  selectedBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  timeBadge: {
    backgroundColor: '#666666',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  cardContent: {
    padding: 15,
  },
  cardContentDark: {
    backgroundColor: '#1A1A1A',
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 15,
  },
  tag: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  tagText: {
    fontSize: 12,
    color: '#666666',
  },
  recipesTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  recipeItem: {
    fontSize: 14,
    marginBottom: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  modalContentDark: {
    backgroundColor: '#1A1A1A',
  },
  modalImage: {
    width: '100%',
    height: 200,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 8,
  },
  modalHeader: {
    padding: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalBadges: {
    flexDirection: 'row',
    gap: 10,
  },
  tabButtons: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#FF6B6B',
  },
  tabButtonText: {
    fontSize: 16,
    color: '#666666',
  },
  activeTabText: {
    color: '#FF6B6B',
    fontWeight: '600',
  },
  tabContent: {
    padding: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 15,
  },
  infoText: {
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    marginTop: 20,
  },
  ingredientCategory: {
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  ingredientItem: {
    fontSize: 16,
    marginBottom: 5,
  },
  selectButton: {
    backgroundColor: '#FF6B6B',
    margin: 20,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: '#F44336',
  },
  selectButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  customizeButton: {
    backgroundColor: 'transparent',
    margin: 20,
    marginTop: 0,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FF6B6B',
  },
  customizeButtonText: {
    color: '#FF6B6B',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
  },
});