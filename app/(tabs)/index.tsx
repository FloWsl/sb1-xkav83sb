// app/[tabs]/index.tsx

import React, { useState, useCallback, useMemo, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
  Animated,
  ActivityIndicator,
  StatusBar,
  FlatList,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import styles from '../../styles'; // Global styles
import discoveryStyles from '../styles/discovery.styles'; // Component-specific styles
import { dummyMenus, dummyShoppingItems } from '../../lib/dummyData';
import { usePlanStore } from '../../store/planStore';
import useBatchCooking from '../../hooks/useBatchCooking';
import { useRouter } from 'expo-router';

// Filter options (as per mockups)
const seasons = ['Printemps', 'Été', 'Automne', 'Hiver'];
const dietaryOptions = ['Végétarien', 'Sans Gluten', 'Low-Carb', 'Vegan'];
const timeFilters = ['1-2h', '2-3h', '3h+'];

// Enhance menus to match mockup requirements
const menus = dummyMenus.map((menu, index) => ({
  ...menu,
  id: menu.id,
  title: `Batch Cooking Semaine ${47 + index}`,
  image: menu.imageUrl,
  timeInvestment: '3h30',
  timeEstimate: '3h30',
  recipes: [
    'Poulet rôti aux herbes',
    'Légumes grillés',
    'Salade de quinoa',
  ],
  tags: ['Varié', 'Équilibré', 'Familial'],
  season: menu.tags.includes('Printemps')
    ? 'Printemps'
    : menu.tags.includes('Été')
    ? 'Été'
    : menu.tags.includes('Automne')
    ? 'Automne'
    : 'Hiver',
  isPremium: true,
  servings: 4,
  ingredients: dummyShoppingItems[menu.id] || [],
}));

// ----------------------
// Reusable Components
// ----------------------

// FilterChip: A reusable chip component for filters.
const FilterChip = React.memo(
  ({
    label,
    active,
    onPress,
  }: {
    label: string;
    active: boolean;
    onPress: () => void;
  }) => (
    <TouchableOpacity
      style={[
        discoveryStyles.filterChip,
        active && discoveryStyles.filterChipActive,
      ]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Filter chip: ${label}`}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <Text
        style={[
          discoveryStyles.filterText,
          active && discoveryStyles.filterTextActive,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  )
);

// MenuCard: Displays a single menu card.
const MenuCard = React.memo(
  ({
    menu,
    isSelected,
    onPress,
    isDark,
  }: {
    menu: any;
    isSelected: boolean;
    onPress: () => void;
    isDark: boolean;
  }) => (
    <TouchableOpacity
      style={[
        discoveryStyles.menuCard,
        isDark && discoveryStyles.menuCardDark,
        isSelected && discoveryStyles.selectedMenuCard,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`Menu card: ${menu.title}`}
    >
      {isSelected && (
        <View style={discoveryStyles.selectedIndicator}>
          <Text style={discoveryStyles.selectedIndicatorText}>Actif</Text>
        </View>
      )}
      <Image
        source={{ uri: menu.image }}
        style={discoveryStyles.menuImage}
        resizeMode="cover"
      />
      <View style={discoveryStyles.badgeContainer}>
        <View style={discoveryStyles.premiumBadge}>
          <Text style={discoveryStyles.badgeText}>Premium</Text>
        </View>
        <View style={discoveryStyles.timeBadge}>
          <Text style={discoveryStyles.badgeText}>{menu.timeEstimate}</Text>
        </View>
      </View>
      <View
        style={[
          discoveryStyles.cardContent,
          isDark && discoveryStyles.cardContentDark,
        ]}
      >
        <Text
          style={[
            discoveryStyles.menuTitle,
            isDark && discoveryStyles.textLight,
          ]}
        >
          {menu.title}
        </Text>
        <View style={discoveryStyles.tagsContainer}>
          {menu.tags.map((tag: string, index: number) => (
            <View key={index} style={discoveryStyles.tag}>
              <Text style={discoveryStyles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
        <View style={discoveryStyles.recipesSectionContainer}>
          <Text
            style={[
              discoveryStyles.recipesTitle,
              isDark && discoveryStyles.textLight,
            ]}
          >
            Recettes incluses:
          </Text>
          {menu.recipes.map((recipe: string, index: number) => (
            <View key={index} style={discoveryStyles.recipeItemContainer}>
              <View style={discoveryStyles.recipeBullet} />
              <Text
                style={[
                  discoveryStyles.recipeItem,
                  isDark && discoveryStyles.textLight,
                ]}
              >
                {recipe}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  )
);

// DetailModal: Displays menu details in a modal with tabs.
const DetailModal = ({
  visible,
  menu,
  activeTab,
  setActiveTab,
  onPlanSelect,
  onClose,
  isMenuSelected,
  isDark,
  loadingText,
  disabled,
}: {
  visible: boolean;
  menu: any;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onPlanSelect: () => void;
  onClose: () => void;
  isMenuSelected: (menuId: string) => boolean;
  isDark: boolean;
  loadingText: string;
  disabled: boolean;
}) => {
  if (!menu) return null;

  // Group ingredients by category with defaults
  const groupedIngredients = useMemo(() => {
    const grouped = menu.ingredients.reduce(
      (acc: any, item: any) => {
        const category = item.cat || 'Autres';
        acc[category] = acc[category] || [];
        acc[category].push(item);
        return acc;
      },
      {
        'Fruits et Légumes': [],
        'Produits Laitiers': [],
        'Épicerie': [],
      }
    );
    return grouped;
  }, [menu.ingredients]);

  // Mock recipes data (as in activation flow)
  const mockRecipes = [
    {
      id: `recipe_${menu.id}_1`,
      n: 'Poulet rôti aux herbes',
      s: 4,
      i: [
        { id: 'ing1', d: 'Poulet entier', p: '1.5kg' },
        { id: 'ing2', d: 'Herbes de Provence', p: '2 cuillères à soupe' },
        { id: 'ing3', d: 'Ail', p: '4 gousses' },
        { id: 'ing4', d: "Huile d'olive", p: '3 cuillères à soupe' },
      ],
      inst: [
        'Préchauffer le four à 200°C.',
        'Mélanger les herbes et l’ail avec l’huile d’olive.',
        'Badigeonner le poulet avec le mélange.',
        'Cuire pendant 1h15 en arrosant régulièrement.',
      ],
      notes: 'Se conserve 3 jours au réfrigérateur.',
    },
    {
      id: `recipe_${menu.id}_2`,
      n: 'Légumes grillés',
      s: 4,
      i: [
        { id: 'ing5', d: 'Courgettes', p: '2 pièces' },
        { id: 'ing6', d: 'Aubergines', p: '1 pièce' },
        { id: 'ing7', d: 'Poivrons', p: '2 pièces' },
        { id: 'ing8', d: "Huile d'olive", p: '2 cuillères à soupe' },
      ],
      inst: [
        'Couper les légumes en tranches de 1cm.',
        'Les badigeonner d’huile d’olive.',
        'Griller au four à 180°C pendant 25-30 minutes.',
      ],
    },
    {
      id: `recipe_${menu.id}_3`,
      n: 'Salade de quinoa',
      s: 4,
      i: [
        { id: 'ing9', d: 'Quinoa', p: '200g' },
        { id: 'ing10', d: 'Concombre', p: '1 pièce' },
        { id: 'ing11', d: 'Tomates cerises', p: '200g' },
        { id: 'ing12', d: 'Feta', p: '100g' },
        { id: 'ing13', d: "Huile d'olive", p: '2 cuillères à soupe' },
        { id: 'ing14', d: 'Jus de citron', p: '1 cuillère à soupe' },
      ],
      inst: [
        'Rincer le quinoa et le cuire selon les instructions.',
        'Couper le concombre et les tomates en petits morceaux.',
        'Émietter la feta et mélanger tous les ingrédients.',
        'Assaisonner avec l’huile d’olive, le jus de citron, sel et poivre.',
      ],
    },
  ];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <StatusBar barStyle="light-content" />
      <View style={discoveryStyles.modalOverlay}>
        <View
          style={[
            discoveryStyles.modalContent,
            isDark && discoveryStyles.modalContentDark,
          ]}
        >
          <Image
            source={{ uri: menu.image }}
            style={discoveryStyles.modalImage}
            resizeMode="cover"
          />
          <TouchableOpacity
            style={[
              discoveryStyles.closeButton,
              isDark && discoveryStyles.closeButtonDark,
            ]}
            onPress={onClose}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityRole="button"
            accessibilityLabel="Close detail modal"
          >
            <Ionicons
              name="close"
              size={18}
              color={isDark ? '#FFFFFF' : '#000000'}
            />
          </TouchableOpacity>

          <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
            <View style={discoveryStyles.modalHeader}>
              <Text
                style={[
                  discoveryStyles.modalTitle,
                  isDark && discoveryStyles.textLight,
                ]}
              >
                {menu.title}
              </Text>
              <View style={discoveryStyles.modalBadges}>
                <View style={discoveryStyles.premiumBadge}>
                  <Text style={discoveryStyles.badgeText}>Premium</Text>
                </View>
                <View style={discoveryStyles.timeBadge}>
                  <Text style={discoveryStyles.badgeText}>
                    {menu.timeEstimate}
                  </Text>
                </View>
                {menu.tags.slice(0, 2).map((tag: string, index: number) => (
                  <View key={index} style={discoveryStyles.tag}>
                    <Text style={discoveryStyles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Tabs */}
            <View style={discoveryStyles.tabButtons}>
              <TouchableOpacity
                style={[
                  discoveryStyles.tabButton,
                  activeTab === 'overview' && discoveryStyles.activeTab,
                ]}
                onPress={() => setActiveTab('overview')}
                accessibilityRole="button"
                accessibilityLabel="Overview Tab"
              >
                <Text
                  style={[
                    discoveryStyles.tabButtonText,
                    activeTab === 'overview' && discoveryStyles.activeTabText,
                    isDark && discoveryStyles.textLight,
                  ]}
                >
                  Aperçu
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  discoveryStyles.tabButton,
                  activeTab === 'ingredients' && discoveryStyles.activeTab,
                ]}
                onPress={() => setActiveTab('ingredients')}
                accessibilityRole="button"
                accessibilityLabel="Ingredients Tab"
              >
                <Text
                  style={[
                    discoveryStyles.tabButtonText,
                    activeTab === 'ingredients' && discoveryStyles.activeTabText,
                    isDark && discoveryStyles.textLight,
                  ]}
                >
                  Ingrédients
                </Text>
              </TouchableOpacity>
            </View>

            {activeTab === 'overview' ? (
              <View style={discoveryStyles.tabContent}>
                <View style={discoveryStyles.infoRow}>
                  <View style={discoveryStyles.infoIcon}>
                    <Ionicons name="people-outline" size={18} color="#FF7A50" />
                  </View>
                  <Text
                    style={[
                      discoveryStyles.infoText,
                      isDark && discoveryStyles.textLight,
                    ]}
                  >
                    {menu.servings} portions
                  </Text>
                </View>
                <View style={discoveryStyles.infoRow}>
                  <View style={discoveryStyles.infoIcon}>
                    <Ionicons name="time-outline" size={18} color="#FF7A50" />
                  </View>
                  <Text
                    style={[
                      discoveryStyles.infoText,
                      isDark && discoveryStyles.textLight,
                    ]}
                  >
                    Temps total: {menu.timeEstimate}
                  </Text>
                </View>
                <Text
                  style={[
                    discoveryStyles.sectionTitle,
                    isDark && discoveryStyles.textLight,
                  ]}
                >
                  Recettes incluses:
                </Text>
                {menu.recipes.map((recipe: string, index: number) => (
                  <View key={index} style={discoveryStyles.recipeItemContainer}>
                    <View style={discoveryStyles.recipeBullet} />
                    <Text
                      style={[
                        discoveryStyles.recipeItem,
                        isDark && discoveryStyles.textLight,
                      ]}
                    >
                      {recipe}
                    </Text>
                  </View>
                ))}
              </View>
            ) : (
              <View style={discoveryStyles.tabContent}>
                {Object.entries(groupedIngredients).map(
                  ([category, items]: [string, any[]]) => (
                    <View key={category} style={discoveryStyles.ingredientCategory}>
                      <Text
                        style={[
                          discoveryStyles.categoryTitle,
                          isDark && discoveryStyles.textLight,
                        ]}
                      >
                        {category}
                      </Text>
                      {items.length > 0 ? (
                        items.map((item, idx) => (
                          <View
                            key={idx}
                            style={discoveryStyles.ingredientItemContainer}
                          >
                            <View style={discoveryStyles.recipeBullet} />
                            <Text
                              style={[
                                discoveryStyles.ingredientItem,
                                isDark && discoveryStyles.textLight,
                              ]}
                            >
                              {item.n}
                              <Text style={discoveryStyles.ingredientQuantity}>
                                {` (${item.q || '1'} ${item.u || 'pièce'})`}
                              </Text>
                            </Text>
                          </View>
                        ))
                      ) : (
                        <View style={discoveryStyles.ingredientItemContainer}>
                          <View style={discoveryStyles.recipeBullet} />
                          <Text
                            style={[
                              discoveryStyles.ingredientItem,
                              { color: '#6B6B6B' },
                              isDark && discoveryStyles.textLight,
                            ]}
                          >
                            Aucun ingrédient dans cette catégorie
                          </Text>
                        </View>
                      )}
                    </View>
                  )
                )}
              </View>
            )}

            {/* Action Buttons */}
            <TouchableOpacity
              style={[
                discoveryStyles.selectButton,
                isMenuSelected(menu.id) && discoveryStyles.selectedButton,
                disabled && { opacity: 0.7 },
              ]}
              onPress={onPlanSelect}
              disabled={disabled}
              accessibilityRole="button"
              accessibilityLabel="Select or deactivate plan"
            >
              <Text style={discoveryStyles.selectButtonText}>
                {disabled
                  ? 'CHARGEMENT...'
                  : isMenuSelected(menu.id)
                  ? 'DÉSACTIVER CE PLAN'
                  : 'SÉLECTIONNER CE PLAN'}
              </Text>
            </TouchableOpacity>

            {menu.isPremium && (
              <TouchableOpacity
                style={discoveryStyles.customizeButton}
                onPress={() => {
                  onClose();
                  // Navigate to customization screen if required.
                }}
                accessibilityRole="button"
                accessibilityLabel="Customize plan"
              >
                <Text style={discoveryStyles.customizeButtonText}>
                  PERSONNALISER CE PLAN
                </Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

// ----------------------
// Main Discovery Screen
// ----------------------

export default function DiscoveryScreen() {
  // State variables
  const [selectedMenu, setSelectedMenu] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedSeason, setSelectedSeason] = useState<string | null>(null);
  const [selectedDiets, setSelectedDiets] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;

  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const themeColors = styles.getThemeColors(colorScheme);
  const router = useRouter();

  // Zustand plan store
  const {
    setSelectedPlan,
    loadIngredientsFromPlan,
    loadRecipesFromPlan,
    loadEquipmentFromPlan,
    selectedPlanId,
    clearPlanData,
  } = usePlanStore();

  // Batch cooking hook
  const {
    activePlanId,
    activatePlan,
    clearActivePlan,
    isLoading: isActivatingPlan,
  } = useBatchCooking();

  // Toggle dietary filter
  const toggleDiet = (diet: string) => {
    setSelectedDiets((prev) =>
      prev.includes(diet)
        ? prev.filter((d) => d !== diet)
        : [...prev, diet]
    );
  };

  // Check if a menu is selected (either in the store or active)
  const isMenuSelected = useCallback(
    (menuId: string) => {
      return selectedPlanId === menuId || activePlanId === menuId;
    },
    [selectedPlanId, activePlanId]
  );

  // Handle plan selection and deselection
  const handlePlanSelection = (menu: any) => {
    const currentlySelected = isMenuSelected(menu.id);
    setIsLoading(true);

    if (currentlySelected) {
      // Deselect plan
      clearPlanData();
      setSelectedMenu(null);
      clearActivePlan()
        .then(() => setIsLoading(false))
        .catch((error) => {
          console.error('Error clearing plan:', error);
          setIsLoading(false);
        });
    } else {
      // Activate plan: clear previous data if any, then load new plan
      if (selectedPlanId || activePlanId) {
        clearPlanData();
        clearActivePlan()
          .then(() => proceedActivation())
          .catch((error) => {
            console.error('Error clearing previous plan:', error);
            proceedActivation();
          });
      } else {
        proceedActivation();
      }

      function proceedActivation() {
        setSelectedPlan(menu.id);
        // Load recipes, ingredients, and equipment
        const mockRecipes = [
          {
            id: `recipe_${menu.id}_1`,
            n: 'Poulet rôti aux herbes',
            s: 4,
            i: [
              { id: 'ing1', d: 'Poulet entier', p: '1.5kg' },
              { id: 'ing2', d: 'Herbes de Provence', p: '2 cuillères à soupe' },
              { id: 'ing3', d: 'Ail', p: '4 gousses' },
              { id: 'ing4', d: "Huile d'olive", p: '3 cuillères à soupe' },
            ],
            inst: [
              'Préchauffer le four à 200°C.',
              'Mélanger les herbes et l’ail avec l’huile d’olive.',
              'Badigeonner le poulet avec le mélange.',
              'Cuire pendant 1h15 en arrosant régulièrement.',
            ],
            notes: 'Se conserve 3 jours au réfrigérateur.',
          },
          {
            id: `recipe_${menu.id}_2`,
            n: 'Légumes grillés',
            s: 4,
            i: [
              { id: 'ing5', d: 'Courgettes', p: '2 pièces' },
              { id: 'ing6', d: 'Aubergines', p: '1 pièce' },
              { id: 'ing7', d: 'Poivrons', p: '2 pièces' },
              { id: 'ing8', d: "Huile d'olive", p: '2 cuillères à soupe' },
            ],
            inst: [
              'Couper les légumes en tranches de 1cm.',
              'Les badigeonner d’huile d’olive.',
              'Griller au four à 180°C pendant 25-30 minutes.',
            ],
          },
          {
            id: `recipe_${menu.id}_3`,
            n: 'Salade de quinoa',
            s: 4,
            i: [
              { id: 'ing9', d: 'Quinoa', p: '200g' },
              { id: 'ing10', d: 'Concombre', p: '1 pièce' },
              { id: 'ing11', d: 'Tomates cerises', p: '200g' },
              { id: 'ing12', d: 'Feta', p: '100g' },
              { id: 'ing13', d: "Huile d'olive", p: '2 cuillères à soupe' },
              { id: 'ing14', d: 'Jus de citron', p: '1 cuillère à soupe' },
            ],
            inst: [
              'Rincer le quinoa et le cuire selon les instructions.',
              'Couper le concombre et les tomates en petits morceaux.',
              'Émietter la feta et mélanger tous les ingrédients.',
              'Assaisonner avec l’huile d’olive, le jus de citron, sel et poivre.',
            ],
          },
        ];

        if (menu.ingredients && menu.ingredients.length > 0) {
          loadIngredientsFromPlan(menu.ingredients);
        }
        loadRecipesFromPlan(mockRecipes);
        const mockEquipment = [
          { n: 'Four', d: 'Température moyenne à élevée' },
          { n: 'Plat à rôtir', d: 'Pour le poulet' },
          { n: 'Plaque de cuisson', d: 'Pour les légumes' },
          { n: 'Casserole', d: 'Pour le quinoa' },
        ];
        loadEquipmentFromPlan(mockEquipment);

        setSelectedMenu(null);
        activatePlan(menu.id)
          .then(() => setIsLoading(false))
          .catch((error) => {
            console.error('Error activating plan:', error);
            setIsLoading(false);
          });
      }
    }
  };

  // Memoized filtered menus based on selected filters
  const filteredMenus = useMemo(() => {
    return menus.filter((menu) => {
      if (selectedSeason && menu.season !== selectedSeason) return false;
      if (selectedDiets.length > 0) {
        const matchesAll = selectedDiets.every((diet) =>
          menu.tags.includes(diet)
        );
        if (!matchesAll) return false;
      }
      if (selectedTime && !menu.timeEstimate.includes(selectedTime.replace('h', '')))
        return false;
      return true;
    });
  }, [selectedSeason, selectedDiets, selectedTime]);

  // Render filter rows (each as a horizontal scroll for mobile)
  const renderFilterRow = (title: string, options: string[], selectedValue: any, setValue: any, isToggle = false) => (
    <View style={discoveryStyles.filterRow}>
      <Text style={[discoveryStyles.filterRowTitle, isDark && discoveryStyles.textLight]}>
        {title}
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {options.map((option) => (
          <FilterChip
            key={option}
            label={option}
            active={isToggle ? selectedValue.includes(option) : selectedValue === option}
            onPress={() => {
              if (isToggle) {
                toggleDiet(option);
              } else {
                setValue((prev: any) => (prev === option ? null : option));
              }
            }}
          />
        ))}
      </ScrollView>
    </View>
  );

  if (isLoading || isActivatingPlan) {
    return (
      <SafeAreaView
        style={[
          discoveryStyles.container,
          isDark && discoveryStyles.containerDark,
        ]}
      >
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
        <View style={discoveryStyles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF7A50" />
          <Text style={[discoveryStyles.loadingText, isDark && discoveryStyles.textLight]}>
            {isMenuSelected(selectedMenu?.id)
              ? 'Désactivation du plan...'
              : 'Activation du plan...'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[
        discoveryStyles.container,
        isDark && discoveryStyles.containerDark,
      ]}
    >
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <View style={discoveryStyles.header}>
        <Text style={[discoveryStyles.title, isDark && discoveryStyles.textLight]}>
          Découvrez nos menus
        </Text>
        {(selectedPlanId || activePlanId) && (
          <Text style={[discoveryStyles.subtitle, isDark && { color: '#FF7A50' }]}>
            Plan actif:{' '}
            {menus.find(
              (m) => m.id === (selectedPlanId || activePlanId)
            )?.title || 'Batch Cooking Semaine 47'}
          </Text>
        )}
      </View>

      {/* Filter sections */}
      {renderFilterRow('Saisons', seasons, selectedSeason, setSelectedSeason)}
      {renderFilterRow('Régimes', dietaryOptions, selectedDiets, setSelectedDiets, true)}
      {renderFilterRow('Temps', timeFilters, selectedTime, setSelectedTime)}

      {/* Menu list */}
      <Animated.FlatList
        data={filteredMenus}
        renderItem={({ item }) => (
          <MenuCard
            menu={item}
            isSelected={isMenuSelected(item.id)}
            onPress={() => {
              setActiveTab('overview'); // Reset tab when opening modal
              setSelectedMenu(item);
            }}
            isDark={isDark}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={discoveryStyles.menuList}
        extraData={[selectedPlanId, activePlanId]}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      />

      {/* Detail Modal */}
      <DetailModal
        visible={selectedMenu !== null}
        menu={selectedMenu}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onPlanSelect={() => selectedMenu && handlePlanSelection(selectedMenu)}
        onClose={() => setSelectedMenu(null)}
        isMenuSelected={isMenuSelected}
        isDark={isDark}
        loadingText={
          isMenuSelected(selectedMenu?.id)
            ? 'Désactivation du plan...'
            : 'Activation du plan...'
        }
        disabled={isLoading || isActivatingPlan}
      />
    </SafeAreaView>
  );
}
