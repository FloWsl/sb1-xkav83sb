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
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import type { Meta } from '../../types/schema';

const { width } = Dimensions.get('window');

// Extended data structure
interface DailyMenu {
  day: string;
  meal: string;
}

interface ExtendedRecipe {
  id: string;
  n: string;
  s: number;
  is_premium: boolean;
  week: string;
  author: string;
  image: string;
  preparation_time: string;
  tags: string[];
  is_new: boolean;
  daily_menu: DailyMenu[];
  description: string;
  i: any[];
  inst: string[];
  notes: string;
}

const meta: Meta = {
  week: 12,
  portions: 4,
  estimated_cost: 20,
  currency: '€',
  preparation_time: '30 min',
  conservation_notes: '2 jours au frigo',
  accompaniments: ['Salade', 'Pain']
};

// Sample extended recipe data
const extendedRecipes: ExtendedRecipe[] = [
  {
    id: 'recipe-1',
    n: 'Menu de la semaine 12',
    s: 12,
    is_premium: false,
    week: '12',
    author: 'Chef Nomade',
    image: 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=800&auto=format&fit=crop&q=80',
    preparation_time: '30 min',
    tags: ['Batch cooking', 'Semaine 12'],
    is_new: true,
    daily_menu: [
      { day: 'Lundi', meal: 'Épinards à la crème, gnocchi et parmesan' },
      { day: 'Mardi', meal: 'Tofu à la moutarde, riz et patates douces' },
      { day: 'Mercredi', meal: 'Grilled cheese et salade d\'endives' },
      { day: 'Jeudi', meal: 'Patates douces rôties, semoule et sauce à l\'avocat' },
      { day: 'Vendredi', meal: 'Velouté carotte, coco, curry et galette de fromage frais' }
    ],
    description: 'Menu batch cooking de la semaine',
    i: [
      { id: '1', d: 'Poulet', p: '1 kg' },
      { id: '2', d: 'Herbes de Provence', p: '2 c. à soupe' }
    ],
    inst: ['Préchauffer le four', 'Assaisonner le poulet', 'Enfourner pendant 45 min'],
    notes: 'Menu de base'
  }
];

export default function MenuScreen() {
  const [selectedRecipe, setSelectedRecipe] = useState<ExtendedRecipe | null>(null);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [activeTab, setActiveTab] = useState('ingredients');
  const [userStatus, setUserStatus] = useState('free');
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const openRecipeDetail = (recipe: ExtendedRecipe) => {
    if (recipe.is_premium && userStatus !== 'premium') {
      setShowPremiumModal(true);
    } else {
      setSelectedRecipe(recipe);
    }
  };

  const renderRecipeCard = (recipe: ExtendedRecipe) => {
    const isLocked = recipe.is_premium && userStatus !== 'premium';

    return (
      <TouchableOpacity
        key={recipe.id}
        style={[styles.recipeCard, isDark && styles.recipeCardDark]}
        onPress={() => openRecipeDetail(recipe)}>
        <View style={styles.recipeImageContainer}>
          <Image
            source={{ uri: recipe.image }}
            style={styles.recipeImage}
          />
          <View style={styles.badgeContainer}>
            {recipe.is_new && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Nouveau</Text>
              </View>
            )}
            {recipe.is_premium && (
              <View style={[styles.badge, styles.premiumBadge]}>
                <Text style={styles.badgeText}>Premium</Text>
              </View>
            )}
          </View>
          {isLocked && (
            <View style={styles.lockedOverlay}>
              <Ionicons name="lock-closed" size={32} color="#FFFFFF" />
              <Text style={styles.lockedText}>Contenu Premium</Text>
            </View>
          )}
        </View>

        <View style={styles.recipeContent}>
          <View style={styles.recipeHeader}>
            <Text style={[styles.recipeTitle, isDark && styles.textLight]}>
              {recipe.n}
            </Text>
            <View style={styles.recipeMeta}>
              <Text style={[styles.recipeAuthor, isDark && styles.textLight]}>
                par {recipe.author}
              </Text>
              <Text style={[styles.recipeTime, isDark && styles.textLight]}>
                {recipe.preparation_time}
              </Text>
            </View>
          </View>

          <View style={styles.tagsContainer}>
            {recipe.tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>

          {!isLocked && (
            <View style={styles.dailyMenu}>
              {recipe.daily_menu.map((item, index) => (
                <View key={index} style={styles.menuItem}>
                  <Text style={[styles.menuDay, isDark && styles.textLight]}>
                    {item.day} :
                  </Text>
                  <Text style={[styles.menuDescription, isDark && styles.textLight]}>
                    {item.meal}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {isLocked && (
            <TouchableOpacity
              style={styles.unlockButton}
              onPress={() => setShowPremiumModal(true)}>
              <Ionicons name="key" size={20} color="#FFFFFF" />
              <Text style={styles.unlockButtonText}>
                Débloquer avec Premium
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={[styles.title, isDark && styles.textLight]}>
            Bonjour, Cuisinons !
          </Text>
          {userStatus !== 'premium' && (
            <TouchableOpacity
              style={styles.subscribeButton}
              onPress={() => setShowPremiumModal(true)}>
              <Text style={styles.subscribeText}>
                Commencer mon abonnement
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.recipesGrid}>
          {extendedRecipes.map(recipe => renderRecipeCard(recipe))}
        </View>
      </ScrollView>

      {/* Premium Modal */}
      <Modal
        visible={showPremiumModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowPremiumModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, isDark && styles.modalContentDark]}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowPremiumModal(false)}>
              <Ionicons
                name="close"
                size={24}
                color={isDark ? '#FFFFFF' : '#000000'}
              />
            </TouchableOpacity>

            <Text style={[styles.modalTitle, isDark && styles.textLight]}>
              Passez à Premium
            </Text>
            <Text style={[styles.modalDescription, isDark && styles.textLight]}>
              Débloquez toutes nos recettes et accédez à des fonctionnalités exclusives !
            </Text>

            <View style={styles.premiumBenefits}>
              <View style={styles.benefitItem}>
                <Ionicons name="book" size={24} color="#FF6B6B" />
                <Text style={[styles.benefitText, isDark && styles.textLight]}>
                  Accès illimité à plus de 100 recettes
                </Text>
              </View>
              <View style={styles.benefitItem}>
                <Ionicons name="star" size={24} color="#FF6B6B" />
                <Text style={[styles.benefitText, isDark && styles.textLight]}>
                  Nouvelles recettes chaque semaine
                </Text>
              </View>
              <View style={styles.benefitItem}>
                <Ionicons name="print" size={24} color="#FF6B6B" />
                <Text style={[styles.benefitText, isDark && styles.textLight]}>
                  Exportation des recettes en PDF
                </Text>
              </View>
            </View>

            <View style={styles.pricingOptions}>
              <TouchableOpacity
                style={[styles.pricingCard, isDark && styles.pricingCardDark]}
                onPress={() => {
                  setUserStatus('premium');
                  setShowPremiumModal(false);
                }}>
                <Text style={[styles.pricingTitle, isDark && styles.textLight]}>
                  Mensuel
                </Text>
                <Text style={[styles.price, isDark && styles.textLight]}>
                  9,99 €
                </Text>
                <Text style={[styles.period, isDark && styles.textLight]}>
                  /mois
                </Text>
                <View style={styles.subscribeButtonSmall}>
                  <Text style={styles.subscribeButtonText}>S'abonner</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.pricingCard,
                  styles.recommendedCard,
                  isDark && styles.pricingCardDark,
                ]}
                onPress={() => {
                  setUserStatus('premium');
                  setShowPremiumModal(false);
                }}>
                <View style={styles.recommendedBadge}>
                  <Text style={styles.recommendedText}>Recommandé</Text>
                </View>
                <Text style={[styles.pricingTitle, isDark && styles.textLight]}>
                  Annuel
                </Text>
                <Text style={[styles.price, isDark && styles.textLight]}>
                  79,99 €
                </Text>
                <Text style={[styles.period, isDark && styles.textLight]}>
                  /an
                </Text>
                <Text style={styles.savings}>Économisez 40%</Text>
                <View style={styles.subscribeButtonSmall}>
                  <Text style={styles.subscribeButtonText}>S'abonner</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Recipe Detail Modal */}
      <Modal
        visible={selectedRecipe !== null}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedRecipe(null)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, isDark && styles.modalContentDark]}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSelectedRecipe(null)}>
              <Ionicons
                name="close"
                size={24}
                color={isDark ? '#FFFFFF' : '#000000'}
              />
            </TouchableOpacity>

            {selectedRecipe && (
              <ScrollView>
                <View style={styles.recipeDetailHeader}>
                  <Image
                    source={{ uri: selectedRecipe.image }}
                    style={styles.recipeDetailImage}
                  />
                  <View style={styles.recipeDetailInfo}>
                    <Text style={[styles.recipeDetailTitle, isDark && styles.textLight]}>
                      {selectedRecipe.n}
                    </Text>
                    <View style={styles.recipeDetailMeta}>
                      <View style={styles.metaItem}>
                        <Ionicons
                          name="person"
                          size={20}
                          color={isDark ? '#FFFFFF' : '#000000'}
                        />
                        <Text style={[styles.metaText, isDark && styles.textLight]}>
                          par {selectedRecipe.author}
                        </Text>
                      </View>
                      <View style={styles.metaItem}>
                        <Ionicons
                          name="time"
                          size={20}
                          color={isDark ? '#FFFFFF' : '#000000'}
                        />
                        <Text style={[styles.metaText, isDark && styles.textLight]}>
                          {selectedRecipe.preparation_time}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>

                <View style={styles.tabButtons}>
                  <TouchableOpacity
                    style={[
                      styles.tabButton,
                      activeTab === 'ingredients' && styles.activeTab,
                    ]}
                    onPress={() => setActiveTab('ingredients')}>
                    <Text style={[
                      styles.tabButtonText,
                      activeTab === 'ingredients' && styles.activeTabText,
                    ]}>
                      Ingrédients
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.tabButton,
                      activeTab === 'instructions' && styles.activeTab,
                    ]}
                    onPress={() => setActiveTab('instructions')}>
                    <Text style={[
                      styles.tabButtonText,
                      activeTab === 'instructions' && styles.activeTabText,
                    ]}>
                      Instructions
                    </Text>
                  </TouchableOpacity>
                </View>

                {activeTab === 'ingredients' && (
                  <View style={styles.tabContent}>
                    {selectedRecipe.i.map((ingredient, index) => (
                      <View key={index} style={styles.ingredientItem}>
                        <Text style={[styles.ingredientText, isDark && styles.textLight]}>
                          {ingredient.d} ({ingredient.p})
                        </Text>
                      </View>
                    ))}
                  </View>
                )}

                {activeTab === 'instructions' && (
                  <View style={styles.tabContent}>
                    {selectedRecipe.inst.map((instruction, index) => (
                      <View key={index} style={styles.instructionItem}>
                        <Text style={[styles.instructionNumber, isDark && styles.textLight]}>
                          {index + 1}.
                        </Text>
                        <Text style={[styles.instructionText, isDark && styles.textLight]}>
                          {instruction}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
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
  subscribeButton: {
    backgroundColor: '#FF6B6B',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  subscribeText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
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
  recipeImageContainer: {
    position: 'relative',
    height: 200,
  },
  recipeImage: {
    width: '100%',
    height: '100%',
  },
  badgeContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    gap: 10,
  },
  badge: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  premiumBadge: {
    backgroundColor: '#FFD700',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  lockedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockedText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
  },
  recipeContent: {
    padding: 15,
  },
  recipeHeader: {
    marginBottom: 10,
  },
  recipeTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 5,
  },
  recipeMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  recipeAuthor: {
    fontSize: 14,
    color: '#666666',
  },
  recipeTime: {
    fontSize: 14,
    color: '#666666',
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
  dailyMenu: {
    gap: 10,
  },
  menuItem: {
    flexDirection: 'row',
    gap: 10,
  },
  menuDay: {
    fontWeight: '600',
    minWidth: 80,
  },
  menuDescription: {
    flex: 1,
  },
  unlockButton: {
    backgroundColor: '#FF6B6B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    gap: 10,
  },
  unlockButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
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
    padding: 20,
    maxHeight: '90%',
  },
  modalContentDark: {
    backgroundColor: '#1A1A1A',
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 20,
  },
  premiumBenefits: {
    marginBottom: 20,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 15,
  },
  benefitText: {
    fontSize: 16,
  },
  pricingOptions: {
    flexDirection: 'row',
    gap: 20,
  },
  pricingCard: {
    flex: 1,
    backgroundColor: '#F7F7F7',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
  },
  pricingCardDark: {
    backgroundColor: '#2A2A2A',
  },
  recommendedCard: {
    borderColor: '#FF6B6B',
    borderWidth: 2,
  },
  recommendedBadge: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    position: 'absolute',
    top: -12,
  },
  recommendedText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  pricingTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  period: {
    fontSize: 14,
    color: '#666666',
  },
  savings: {
    color: '#FF6B6B',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 5,
  },
  subscribeButtonSmall: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 15,
  },
  subscribeButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  recipeDetailHeader: {
    marginBottom: 20,
  },
  recipeDetailImage: {
    width: '100%',
    height: 200,
    borderRadius: 15,
  },
  recipeDetailInfo: {
    padding: 15,
  },
  recipeDetailTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  recipeDetailMeta: {
    flexDirection: 'row',
    gap: 20,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metaText: {
    fontSize: 14,
  },
  tabButtons: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
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
    padding: 15,
  },
  ingredientItem: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  ingredientText: {
    fontSize: 16,
  },
  instructionItem: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 15,
  },
  instructionNumber: {
    fontSize: 16,
    fontWeight: '600',
    minWidth: 25,
  },
  instructionText: {
    fontSize: 16,
    flex: 1,
  },
});