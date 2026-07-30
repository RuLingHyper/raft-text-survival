import { ITEMS } from './items';

// Bu liste, craft menüsündeki tüm üretilebilir eşyaları ve tariflerini tutar.
export const CRAFTING_RECIPES = [
    {
        id: 'recipe_rope',
        resultItemId: 'rope',
        yieldAmount: 1,
        category: 'Resources',
        ingredients: [
            { itemId: 'leaf', amount: 2 }
        ]
    },
    {
        id: 'recipe_fishingRod',
        resultItemId: 'fishingRod',
        yieldAmount: 1,
        category: 'Tools',
        ingredients: [
            { itemId: 'wood', amount: 6 },
            { itemId: 'rope', amount: 8 }
        ]
    },
    {
        id: 'recipe_spear',
        resultItemId: 'spear',
        yieldAmount: 1,
        category: 'Weapons',
        ingredients: [
            { itemId: 'wood', amount: 8 },
            { itemId: 'rope', amount: 3 },
            { itemId: 'scrap', amount: 2 }
        ]
    }
];