import React, { useState } from 'react';
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import styles from '../../styles';

const { width } = Dimensions.get('window');

// Filter options
const seasons = ['Printemps', 'Été', 'Automne', 'Hiver'];
const dietaryOptions = ['Végétarien', 'Sans Gluten', 'Low-Carb', 'Vegan'];
const timeFilters = ['1-2h', '2-3h', '3h+'];

// Sample menu data
const menus = [
  {
    id: '1',
    title: 'Menu Végétarien de Printemps',
    image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800',
    timeInvestment: '2h30',
    recipes: [
      'Salade de quinoa aux légumes printaniers',
      'Curry de légumes au lait de coco',
      'Buddha bowl aux légumes rôtis'
    ],
    tags: ['Végétarien', 'Sans Gluten'],
    season: 'Printemps',
    isPremium: true,
    servings: 4,
    ingredients: {
      'Légumes': ['Carottes', 'Courgettes', 'Poivrons'],
      'Protéines': ['Quinoa', 'Pois chiches'],
      'Épicerie': ['Lait de coco', 'Curry en poudre']
    }
  },
  {
    id: '2',
    title: 'Menu Express Méditerranéen',
    image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800',
    timeInvestment: '1h45',
    recipes: [
      'Pâtes aux tomates cerises et basilic',
      'Salade grecque',
      'Houmous maison'
    ],
    tags: ['Végétarien'],
    season: 'Été',
    isPremium: false,
    servings: 4,
    ingredients: {
      'Légumes': ['Tomates cerises', 'Concombre', 'Oignons rouges'],
      'Protéines': ['Pois chiches', 'Feta'],
      'Épicerie': ['Pâtes', 'Huile d\'olive']
    }
  }
];

export default function DiscoveryScreen() {
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [selectedDiets, setSelectedDiets] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const colorScheme = useColorScheme();
  const themeColors = styles.getThemeColors(colorScheme);
  const isDark = colorScheme === 'dark';

  const toggleDiet = (diet) => {
    setSelectedDiets(prev => 
      prev.includes(diet) 
        ? prev.filter(d => d !== diet)
        : [...prev, diet]
    );
  };

  const renderMenuCard = ({ item }) => (
    <TouchableOpacity
      style={[
        localStyles.menuCard,
        isDark && localStyles.menuCardDark
      ]}
      onPress={() => setSelectedMenu(item)}>
      <Image
        source={{ uri: item.image }}
        style={localStyles.menuImage}
      />
      <View style={localStyles.badgeContainer}>
        <View style={[
          localStyles.badge,
          item.isPremium ? localStyles.premiumBadge : localStyles.freeBadge
        ]}>
          <Text style={localStyles.badgeText}>
            {item.isPremium ? 'Premium' : 'Gratuit'}
          </Text>
        </View>
        <View style={localStyles.timeBadge}>
          <Ionicons name="time-outline" size={14} color="#FFFFFF" />
          <Text style={localStyles.badgeText}>{item.timeInvestment}</Text>
        </View>
      </View>
      <View style={[localStyles.cardContent, isDark && localStyles.cardContentDark]}>
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
        <Text style={[localStyles.recipesTitle, isDark && localStyles.textLight]}>
          Recettes incluses:
        </Text>
        {item.recipes.map((recipe, index) => (
          <Text 
            key={index}
            style={[localStyles.recipeItem, isDark && localStyles.textLight]}>
            • {recipe}
          </Text>
        ))}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[localStyles.container, isDark && localStyles.containerDark]}>
      <View style={localStyles.header}>
        <Text style={[localStyles.title, isDark && localStyles.textLight]}>
          Découvrez nos menus
        </Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={localStyles.filtersContainer}>
        {seasons.map((season) => (
          <TouchableOpacity
            key={season}
            style={[
              localStyles.filterChip,
              selectedSeason === season && localStyles.filterChipActive,
              isDark && localStyles.filterChipDark
            ]}
            onPress={() => setSelectedSeason(prev => prev === season ? null : season)}>
            <Text style={[
              localStyles.filterText,
              selectedSeason === season && localStyles.filterTextActive,
              isDark && localStyles.textLight
            ]}>
              {season}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={localStyles.filtersContainer}>
        {dietaryOptions.map((diet) => (
          <TouchableOpacity
            key={diet}
            style={[
              localStyles.filterChip,
              selectedDiets.includes(diet) && localStyles.filterChipActive,
              isDark && localStyles.filterChipDark
            ]}
            onPress={() => toggleDiet(diet)}>
            <Text style={[
              localStyles.filterText,
              selectedDiets.includes(diet) && localStyles.filterTextActive,
              isDark && localStyles.textLight
            ]}>
              {diet}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={localStyles.filtersContainer}>
        {timeFilters.map((time) => (
          <TouchableOpacity
            key={time}
            style={[
              localStyles.filterChip,
              selectedTime === time && localStyles.filterChipActive,
              isDark && localStyles.filterChipDark
            ]}
            onPress={() => setSelectedTime(prev => prev === time ? null : time)}>
            <Text style={[
              localStyles.filterText,
              selectedTime === time && localStyles.filterTextActive,
              isDark && localStyles.textLight
            ]}>
              {time}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={menus}
        renderItem={renderMenuCard}
        keyExtractor={item => item.id}
        contentContainerStyle={localStyles.menuList}
      />

      <Modal
        visible={selectedMenu !== null}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedMenu(null)}>
        <View style={localStyles.modalOverlay}>
          <View style={[localStyles.modalContent, isDark && localStyles.modalContentDark]}>
            <TouchableOpacity
              style={localStyles.closeButton}
              onPress={() => setSelectedMenu(null)}>
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
                  <Text style={[localStyles.modalTitle, isDark && localStyles.textLight]}>
                    {selectedMenu.title}
                  </Text>
                  <View style={localStyles.modalBadges}>
                    <View style={[
                      localStyles.badge,
                      selectedMenu.isPremium ? localStyles.premiumBadge : localStyles.freeBadge
                    ]}>
                      <Text style={localStyles.badgeText}>
                        {selectedMenu.isPremium ? 'Premium' : 'Gratuit'}
                      </Text>
                    </View>
                    <View style={localStyles.timeBadge}>
                      <Ionicons name="time-outline" size={14} color="#FFFFFF" />
                      <Text style={localStyles.badgeText}>{selectedMenu.timeInvestment}</Text>
                    </View>
                  </View>
                </View>

                <View style={localStyles.tabButtons}>
                  <TouchableOpacity
                    style={[
                      localStyles.tabButton,
                      activeTab === 'overview' && localStyles.activeTab,
                    ]}
                    onPress={() => setActiveTab('overview')}>
                    <Text style={[
                      localStyles.tabButtonText,
                      activeTab === 'overview' && localStyles.activeTabText,
                      isDark && localStyles.textLight
                    ]}>
                      Aperçu
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      localStyles.tabButton,
                      activeTab === 'ingredients' && localStyles.activeTab,
                    ]}
                    onPress={() => setActiveTab('ingredients')}>
                    <Text style={[
                      localStyles.tabButtonText,
                      activeTab === 'ingredients' && localStyles.activeTabText,
                      isDark && localStyles.textLight
                    ]}>
                      Ingrédients
                    </Text>
                  </TouchableOpacity>
                </View>

                {activeTab === 'overview' ? (
                  <View style={localStyles.tabContent}>
                    <View style={localStyles.infoRow}>
                      <Ionicons name="people-outline" size={20} color={isDark ? '#FFFFFF' : '#000000'} />
                      <Text style={[localStyles.infoText, isDark && localStyles.textLight]}>
                        {selectedMenu.servings} portions
                      </Text>
                    </View>
                    <View style={localStyles.infoRow}>
                      <Ionicons name="time-outline" size={20} color={isDark ? '#FFFFFF' : '#000000'} />
                      <Text style={[localStyles.infoText, isDark && localStyles.textLight]}>
                        Temps total: {selectedMenu.timeInvestment}
                      </Text>
                    </View>
                    <Text style={[localStyles.sectionTitle, isDark && localStyles.textLight]}>
                      Recettes incluses:
                    </Text>
                    {selectedMenu.recipes.map((recipe, index) => (
                      <Text 
                        key={index}
                        style={[localStyles.recipeItem, isDark && localStyles.textLight]}>
                        • {recipe}
                      </Text>
                    ))}
                  </View>
                ) : (
                  <View style={localStyles.tabContent}>
                    {Object.entries(selectedMenu.ingredients).map(([category, items]) => (
                      <View key={category} style={localStyles.ingredientCategory}>
                        <Text style={[localStyles.categoryTitle, isDark && localStyles.textLight]}>
                          {category}
                        </Text>
                        {items.map((item, index) => (
                          <Text 
                            key={index}
                            style={[localStyles.ingredientItem, isDark && localStyles.textLight]}>
                            • {item}
                          </Text>
                        ))}
                      </View>
                    ))}
                  </View>
                )}

                <TouchableOpacity
                  style={localStyles.selectButton}
                  onPress={() => {
                    // Handle plan selection
                    setSelectedMenu(null);
                  }}>
                  <Text style={localStyles.selectButtonText}>
                    SÉLECTIONNER CE PLAN
                  </Text>
                </TouchableOpacity>

                {selectedMenu.isPremium && (
                  <TouchableOpacity
                    style={localStyles.customizeButton}
                    onPress={() => {
                      // Handle customization
                      setSelectedMenu(null);
                    }}>
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
});
