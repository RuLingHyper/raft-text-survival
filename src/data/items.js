export const ITEMS = {

    // --- TEMEL KAYNAKLAR (Resources) ---

    wood: {
        id: 'wood',
        name: 'Tahta',
        type: 'resource',
        description: 'Okyanusta süzülen temel bir yapı malzemesi.'
    },
    plastic: {
        id: 'plastic',
        name: 'Plastik',
        type: 'resource',
        description: 'Boş şişeler ve atıklar. Birçok aletin yapımında kullanılır.'
    },
    leaf: {
        id: 'leaf',
        name: 'Palmiye Yaprağı',
        type: 'resource',
        description: 'İp yapmak için ideal.'
    },
    rope: {
        id: 'rope',
        name: 'İp',
        type: 'resource',
        description: 'Yapraklardan örülmüş sağlam bir ip.'
    },
    scrap: {
        id: 'scrap',
        name: 'Hurda Metal',
        type: 'resource',
        description: 'Eski metal parçaları. Gelişmiş aletler ve silahlar için gerekli.'
    },

    // --- ALETLER VE SİLAHLAR (Tools & Weapons) ---

    hook: {
        id: 'hook',
        name: 'Plastik Kanca',
        type: 'tool',
        maxDurability: 40,
        description: 'Denizden eşya çekmeni sağlar.'
    },
    fishingRod: {
        id: 'fishingRod',
        name: 'Olta',
        type: 'tool',
        maxDurability: 30,
        description: 'Çiğ balık tutmak için kullanılır.'
    },
    spear: {
        id: 'spear',
        name: 'Tahta Mızrak',
        type: 'weapon',
        maxDurability: 20,
        description: 'Köpekbalığını uzak tutmak için temel bir silah.'
    },
    stoneAxe: {
        id: 'stoneAxe',
        name: 'Taş Balta',
        type: 'tool',
        maxDurability: 50,
        description: 'Adalarda ağaç kesmek veya tahta parçalamak için.'
    }
};