// lib/dummyData.ts
import type { BatchCookingData, ShoppingListItem, PlanSummary, Recipe, Equipment } from '../types/schema';

// Sample menu data for the discovery screen
export const dummyMenus: PlanSummary[] = [
  {
    id: '1',
    title: 'Batch Cooking Semaine 47',
    imageUrl: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800',
    description: 'Quiche au thon, ballottines de poulet, lasagnes, cigares à la dinde et gratin de poireaux.',
    timeEstimate: '3h30',
    recipeCount: 5,
    tags: ['Varié', 'Équilibré', 'Familial'],
    isPremium: true,
    isNew: true
  },
  {
    id: '2',
    title: 'Menu Express Méditerranéen',
    imageUrl: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800',
    description: 'Un menu rapide inspiré de la cuisine méditerranéenne, parfait pour la semaine.',
    timeEstimate: '1h45',
    recipeCount: 3,
    tags: ['Végétarien'],
    isPremium: false,
    isNew: false
  },
];

// Sample recipes for each plan
const sampleRecipes: Record<string, Recipe[]> = {
  '1': [
    {
      id: 'rec_quiche_thon',
      n: 'Quiche au thon et aux câpres',
      s: 4,
      i: [
        {
          id: 'ing9',
          p: 'la totalité',
          d: '400g de thon en boîte'
        }
      ],
      inst: [
        'Dans un saladier, mélangez le thon égoutté et les câpres',
        'Ajoutez 4 œufs, 200g de fromage frais et 20cl de lait',
        'Poivrez généreusement',
        'Garnissez un moule à tarte de la pâte brisée'
      ],
      notes: 'Se conserve 1-2 jours au réfrigérateur, peut être congelée.'
    }
  ],
  '2': [
    {
      id: 'rec_salade_med',
      n: 'Salade Méditerranéenne',
      s: 4,
      i: [
        {
          id: 'ing1',
          p: 'la totalité',
          d: '500g de tomates cerises'
        }
      ],
      inst: [
        'Laver et couper les légumes en morceaux',
        'Préparer la vinaigrette',
        'Mélanger le tout et servir frais'
      ],
      notes: 'À consommer dans les 24h.'
    }
  ]
};

// Sample equipment for each plan
const sampleEquipment: Record<string, Equipment[]> = {
  '1': [
    {
      n: 'Planche à découper',
      d: 'Surface non poreuse, min 40x30'
    },
    {
      n: 'Couteau de chef',
      d: 'Lame de 20cm'
    }
  ],
  '2': [
    {
      n: 'Saladier',
      d: 'Grand saladier pour mélanger'
    },
    {
      n: 'Couteau',
      d: 'Pour couper les légumes'
    }
  ]
};

// Simple data for plan 1 (based on real format but simplified)
const simplePlan1: BatchCookingData = {
  meta: {
    week: 47,
    portions: 4,
    estimated_cost: 46,
    currency: '€',
    preparation_time: '3h30',
    conservation_notes: 'Voir les recettes pour les durées de conservation',
    accompaniments: [
      'Salade et/ou crudités pour accompagner la quiche et le gratin',
      'Pâtes fraîches ou riz basmati pour les ballottines'
    ]
  },
  i: [
    {
      id: 'ing1',
      cat: 'Fruits & Légumes',
      n: 'Échalotes',
      q: 3,
      u: 'pièces',
      notes: '(a: 1/2:1/2:1)',
      r: 3
    },
    {
      id: 'ing2',
      cat: 'Fruits & Légumes',
      n: 'Oignons',
      q: 2,
      u: 'pièces',
      notes: '(1)',
      r: 2
    }
  ],
  e: sampleEquipment['1'],
  r: sampleRecipes['1'],
  b: {
    d: '3h30',
    p: [
      {
        num: '0',
        n: 'Préparations du Week-end',
        st: '00:00',
        en: '00:45',
        sec: [
          {
            n: 'Contrôle & Hygiène',
            t: [
              {
                t: '00:00',
                i: 'Désinfecter la surface de travail',
                c: false,
                pr: 'all'
              },
              {
                t: '00:01',
                i: 'Se laver les mains pendant au moins 30 sec.',
                c: false,
                pr: 'all'
              }
            ]
          }
        ]
      }
    ]
  }
};

// Simple data for plan 2
const simplePlan2: BatchCookingData = {
  meta: {
    week: 48,
    portions: 4,
    estimated_cost: 30,
    currency: '€',
    preparation_time: '2h15',
    conservation_notes: 'Se conserve 3-4 jours au réfrigérateur'
  },
  i: [
    {
      id: '5',
      cat: 'Légumes',
      n: 'Tomates cerises',
      q: '500',
      u: 'g',
      notes: '',
      r: '0'
    },
    {
      id: '6',
      cat: 'Légumes',
      n: 'Concombre',
      q: '1',
      u: 'pièce',
      notes: '',
      r: '0'
    }
  ],
  e: sampleEquipment['2'],
  r: sampleRecipes['2'],
  b: {
    d: '2h15',
    p: [
      {
        num: '1',
        n: 'Préparation',
        st: '00:00',
        en: '01:00',
        sec: [
          {
            n: 'Découpe',
            t: [
              {
                t: '00:10',
                i: 'Couper tous les légumes',
                c: false,
                pr: 'all'
              }
            ]
          }
        ]
      }
    ]
  }
};

// Your dummy plans object
export const dummyPlans: Record<string, BatchCookingData> = {
  '1': simplePlan1,
  '2': simplePlan2
};

// Helper to convert ingredients to shopping list items
export function ingredientsToShoppingItems(ingredients: any[]): ShoppingListItem[] {
  if (!ingredients || !Array.isArray(ingredients)) {
    return [];
  }
  
  return ingredients.map(ingredient => ({
    ...ingredient,
    isChecked: false,
    customItem: false
  }));
}

// Shopping list items with checked status
export const dummyShoppingItems: Record<string, ShoppingListItem[]> = {
  '1': ingredientsToShoppingItems(simplePlan1.i),
  '2': ingredientsToShoppingItems(simplePlan2.i)
};