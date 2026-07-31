import { createSlice } from "@reduxjs/toolkit";

// ==========================================
// --- OYUN AYARLARI VE SABİTLER ---
// ==========================================
// Aletlerin maksimum dayanıklılık (can) değerleri
const TOOL_STATS = {
    hook: { maxDurability: 40 },
    spear: { maxDurability: 20 },
    oar: { maxDurability: 50 }
};

// YENİ: EŞYA LİMİTLERİ (İstediğin zaman buradan değiştirebilirsin)
const ITEM_LIMITS = {
    wood: 50, plastic: 50, leaf: 50, metal: 50,
    water: 20, food: 20, bandage: 10
};

// YENİ: MERKEZİ EŞYA EKLEME FONKSİYONU (Limit kontrolü yapar)
const addItem = (state, itemKey, amount = 1) => {
    const currentCount = state.inventory[itemKey] || 0;
    const limit = ITEM_LIMITS[itemKey] || 999;

    if (currentCount < limit) {
        // Eğer eklenecek miktar limiti aşıyorsa, sadece limite kadar olanı alır
        state.inventory[itemKey] = Math.min(currentCount + amount, limit);
        return true; // Eklendi
    }
    return false; // Çanta dolu, eklenemedi
};

// ==========================================
// --- BAŞLANGIÇ DURUMU (STATE) ---
// ==========================================
const initialState = {
    vitals: { health: 100, hunger: 100, thirst: 100 },
    inventory: { wood: 0, plastic: 0, leaf: 0, metal: 0, bandage: 0, water: 0, food: 0 },
    inventoryOrder: [
        'wood', 'plastic', 'leaf', 'metal', 'empty_1',
        'water', 'food', 'bandage', 'empty_2', 'empty_3',
        'hook', 'spear', 'oar', 'empty_4', 'empty_5'
    ],
    equipment: [
        { itemId: 'hook', id: 'start_hook', durability: TOOL_STATS.hook.maxDurability, maxDurability: TOOL_STATS.hook.maxDurability }
    ],
    buildings: {
        collectionNet: 0,
        waterPurifier: false,
        grill: false
    },
    logs: ["Uçsuz bucaksız okyanusta, küçük bir salın üzerindesin..."],
    day: 1,
    time: 8, // Oyuna sabah 8:00'de başlatıyoruz
    weather: 'sunny', // YENİ: Hava durumu (sunny, rainy, stormy)
    isGameOver: false,
    isGameStarted: true,
    isGamePaused: false,
};

export const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {

        // ==========================================
        // 1. TEMEL EYLEMLER (AKSİYONLAR)
        // ==========================================

        dropItem: (state, action) => {
            if (state.isGameOver) return;
            const { itemKey, itemName } = action.payload;
            if (state.inventory[itemKey] > 0) {
                state.inventory[itemKey] -= 1;
                state.logs.unshift(`Envanterden 1 adet ${itemName} denize atıldı.`);
            }
        },

        swapInventorySlots: (state, action) => {
            const { fromIndex, toIndex } = action.payload;
            const temp = state.inventoryOrder[fromIndex];
            state.inventoryOrder[fromIndex] = state.inventoryOrder[toIndex];
            state.inventoryOrder[toIndex] = temp;
        },

        throwHook: (state) => {
            if (state.isGameOver) return;

            const hookIndex = state.equipment.findIndex(item => item.itemId === 'hook');
            if (hookIndex === -1) {
                state.logs.unshift("Kancan yok! Denizden eşya çekemezsin. Yeni bir kanca üretmelisin.");
                if (state.logs.length > 15) state.logs.pop();
                return;
            }

            state.equipment[hookIndex].durability -= 1;
            const isHookBroken = state.equipment[hookIndex].durability <= 0;

            // YENİ: İhtimal matematiğini fıçıya göre ayarladık
            const chance = Math.floor(Math.random() * 100);

            // 🛢️ YENİ: %15 İhtimalle Gizemli Fıçı Yakalama
            if (chance < 15) {
                const barrelLoot = ['wood', 'plastic', 'leaf'];
                const lootCount = Math.floor(Math.random() * 3) + 3; // 3 ile 5 arası eşya döker
                let logDetails = []; // Hangi eşyaların eklendiğini metin olarak tutacağız

                for (let i = 0; i < lootCount; i++) {
                    const randomItem = barrelLoot[Math.floor(Math.random() * barrelLoot.length)];
                    // Çantada yer varsa ekle ve ismini listeye yaz
                    if (addItem(state, randomItem)) {
                        logDetails.push(randomItem === 'wood' ? 'Tahta' : randomItem === 'plastic' ? 'Plastik' : 'Yaprak');
                    }
                }

                // Sürpriz Yumurta: Fıçıdan %30 ihtimalle Metal, %20 ihtimalle Temiz Su çıkabilir!
                if (Math.random() < 0.30) {
                    if (addItem(state, 'metal')) logDetails.push('Metal');
                } else if (Math.random() < 0.20) {
                    if (addItem(state, 'water')) logDetails.push('Temiz Su');
                }

                // Oyuncuya bilgi ver
                if (logDetails.length > 0) {
                    state.logs.unshift(`🛢️ BÜYÜK İKRAMİYE! Yüzen bir fıçı yakaladın! İçinden çıkanlar: ${logDetails.join(', ')}.`);
                } else {
                    state.logs.unshift("🛢️ Bir fıçı yakaladın ama çantan ağzına kadar dolu olduğu için içindekileri alamadın!");
                }
            }
            // Normal Eşya Yakalama İhtimalleri (Kalan %85'lik kısım)
            else if (chance < 45) {
                if (addItem(state, 'wood')) state.logs.unshift("Kancayı salladın ve denizden 1 adet Tahta çektin.");
                else state.logs.unshift("Envanterin dolu! Tahta için yer yok.");
            } else if (chance < 70) {
                if (addItem(state, 'plastic')) state.logs.unshift("Kancayı salladın ve denizden 1 adet Plastik çektin.");
                else state.logs.unshift("Envanterin dolu! Plastik için yer yok.");
            } else if (chance < 90) {
                if (addItem(state, 'leaf')) state.logs.unshift("Kancayı salladın ve denizden 1 adet Yaprak çektin.");
                else state.logs.unshift("Envanterin dolu! Yaprak için yer yok.");
            } else if (chance < 95) {
                if (addItem(state, 'metal')) state.logs.unshift("Ağır bir şey çektin! Denizden 1 adet Metal buldun.");
                else state.logs.unshift("Envanterin dolu! Metal için yer yok.");
            } else {
                state.logs.unshift("Kancayı salladın ama ucuna sadece yosun takıldı. Boş çektin.");
            }

            if (isHookBroken) {
                state.equipment.splice(hookIndex, 1);
                state.logs.unshift("KIRILDI! Kancan parçalandı, yenisini yapmalısın.");
            }

            if (state.logs.length > 15) state.logs.pop();
        },

        // ==========================================
        // 2. OYUN DÖNGÜSÜ (GAME ENGINE / TICK)
        // ==========================================

        gameTick: (state) => {
            if (!state.isGameStarted || state.isGameOver || state.isGamePaused) return;

            // YENİ: ZAMAN AKIŞI (Her 4 tur = 12 Saniyede = 1 Saat geçer. 1 Gün = ~5 Dakika)
            state.tickCount += 1;

            if (state.tickCount % 2 === 0) {
                state.time += 1;

                if (state.time >= 24) {
                    state.time = 0;
                    state.day += 1;
                    state.logs.unshift(`☀️ GÜN: ${state.day} - Hayatta kalmaya devam et.`);
                } else if (state.time === 20) {
                    state.logs.unshift("🌙 Hava karardı. Gecenin soğuğu ve okyanusun karanlığı etrafını sardı...");
                } else if (state.time === 6) {
                    state.logs.unshift("🌅 Güneş doğuyor. Zorlu bir geceyi daha başarıyla atlattın.");
                }
            }

            // --- HAVA DURUMU SİSTEMİ ---
            // Her 8 turda bir (yaklaşık 4 saatte bir) hava değişme ihtimali
            if (state.tickCount % 8 === 0) {
                const weatherChance = Math.floor(Math.random() * 100);
                if (weatherChance < 60) {
                    if (state.weather !== 'sunny') {
                        state.weather = 'sunny';
                        state.logs.unshift("☀️ Bulutlar dağıldı, okyanus sakinleşti ve hava açtı.");
                    }
                } else if (weatherChance < 85) {
                    if (state.weather !== 'rainy') {
                        state.weather = 'rainy';
                        state.logs.unshift("🌧️ Yağmur başladı. Okyanus rüzgarı sertleşiyor.");
                    }
                } else {
                    if (state.weather !== 'stormy') {
                        state.weather = 'stormy';
                        state.logs.unshift("🌩️ FIRTINA ÇIKTI! Dev dalgalar salına vuruyor, tutunacak bir yer bul!");
                    }
                }
            }

            // HAVA DURUMU EFEKTLERİ
            if (state.weather === 'rainy' && state.buildings.waterPurifier) {
                // Yağmur yağarken su arıtıcın varsa %15 ihtimalle bedava su dolar
                if (Math.floor(Math.random() * 100) < 15) {
                    if (addItem(state, 'water')) {
                        state.logs.unshift("💧 Yağmur sayesinde su arıtıcına bedava 1 şişe Temiz Su doldu.");
                    }
                }
            } else if (state.weather === 'stormy') {
                // Fırtınada %10 ihtimalle hasar alırsın veya eşya kaybedersin
                if (Math.floor(Math.random() * 100) < 10) {
                    if (state.inventory.wood > 0) {
                        state.inventory.wood -= 1;
                        state.logs.unshift("🌊 Dev bir dalga salına çarptı! 1 Tahtan denize uçtu.");
                    } else {
                        state.vitals.health -= 5;
                        state.logs.unshift("🌊 Dev dalgalar seni hırpalıyor! Tahtan olmadığı için hasar aldın. (-5 Can)");
                    }
                }
            }

            if (state.vitals.hunger > 0) state.vitals.hunger -= 1;
            if (state.vitals.thirst > 0) state.vitals.thirst -= 1;

            if (state.vitals.hunger === 0 || state.vitals.thirst === 0) {
                if (state.vitals.health > 0) state.vitals.health -= 5;
            }

            const eventChance = Math.floor(Math.random() * 100);
            if (eventChance < 7) {
                const spearIndex = state.equipment.findIndex(item => item.itemId === 'spear');

                if (spearIndex !== -1) {
                    state.logs.unshift("Köpek balığı saldırdı ama MIZRAK ile savuşturdun! (Mızrağın hasar aldı)");
                    state.equipment[spearIndex].durability -= 5;

                    if (state.equipment[spearIndex].durability <= 0) {
                        state.equipment.splice(spearIndex, 1);
                        state.logs.unshift("Mızrağın KIRILDI!");
                    }
                } else {
                    state.vitals.health -= 10;
                    state.inventory.wood = Math.max(0, state.inventory.wood - 1);
                    state.logs.unshift("KÖPEK BALIĞI SALDIRDI! Salın hasar gördü ve yaralandın. (-10 Can, -1 Tahta)");
                }
            }

            // AĞLARIN EŞYA TOPLAMASINA DA LİMİT EKLENDİ
            if (state.buildings.collectionNet > 0) {
                for (let i = 0; i < state.buildings.collectionNet; i++) {
                    const chance = Math.floor(Math.random() * 100);
                    if (chance < 30) {
                        if (addItem(state, 'wood')) state.logs.unshift("Ağlarına 1 adet Tahta takıldı.");
                    } else if (chance < 50) {
                        if (addItem(state, 'plastic')) state.logs.unshift("Ağlarına 1 adet Plastik takıldı.");
                    }
                }
            }

            if (state.vitals.health <= 0) {
                state.isGameOver = true;
            }

            if (state.logs.length > 15) state.logs.length = 15;
        },

        // ==========================================
        // 3. ÜRETİM (CRAFTING) SİSTEMİ
        // ==========================================

        craftSpear: (state) => {
            if (state.isGameOver) return;
            const costWood = 4; const costMetal = 1;

            if (state.inventory.wood >= costWood && state.inventory.metal >= costMetal) {
                state.inventory.wood -= costWood;
                state.inventory.metal -= costMetal;
                state.equipment.push({
                    itemId: 'spear', id: Date.now().toString(),
                    durability: TOOL_STATS.spear.maxDurability, maxDurability: TOOL_STATS.spear.maxDurability
                });
                state.logs.unshift("Kendini savunmak için sağlam bir Mızrak ürettin!");
            } else {
                state.logs.unshift(`Mızrak için ${costWood} Tahta ve ${costMetal} Metal gerekiyor!`);
            }
        },

        craftHook: (state) => {
            if (state.isGameOver) return;
            const hasHook = state.equipment.some(item => item.itemId === 'hook');
            if (hasHook) {
                state.logs.unshift("Zaten sağlam bir kancan var!"); return;
            }

            const costWood = 2; const costPlastic = 2;

            if (state.inventory.wood >= costWood && state.inventory.plastic >= costPlastic) {
                state.inventory.wood -= costWood;
                state.inventory.plastic -= costPlastic;
                state.equipment.push({
                    itemId: 'hook', id: Date.now().toString(),
                    durability: TOOL_STATS.hook.maxDurability, maxDurability: TOOL_STATS.hook.maxDurability
                });
                state.logs.unshift("Yeniden eşya toplayabilmek için yeni bir Plastik Kanca ürettin!");
            } else {
                state.logs.unshift(`Kanca üretmek için ${costWood} Tahta ve ${costPlastic} Plastiğe ihtiyacın var!`);
            }
        },

        gatherByHand: (state) => {
            if (state.isGameOver) return;
            if (state.vitals.hunger < 10) {
                state.logs.unshift("Denize uzanacak gücün kalmadı! (En az 10 Açlık gerekli)"); return;
            }

            state.vitals.hunger -= 10;
            // LIMIT KONTROLLÜ ELLE TOPLAMA
            const wAdded = addItem(state, 'wood');
            const pAdded = addItem(state, 'plastic');

            if (wAdded || pAdded) {
                state.logs.unshift("Tehlikeyi göze alıp denize uzandın ve malzeme yakaladın! (-10 Açlık)");
            } else {
                state.logs.unshift("Denize uzandın ama çantan ağzına kadar dolu! (-10 Açlık)");
            }
            if (state.logs.length > 15) state.logs.pop();
        },

        craftOar: (state) => {
            if (state.isGameOver) return;
            const costWood = 5; const costPlastic = 5;

            if (state.inventory.wood >= costWood && state.inventory.plastic >= costPlastic) {
                state.inventory.wood -= costWood;
                state.inventory.plastic -= costPlastic;
                state.equipment.push({
                    itemId: 'oar', id: Date.now().toString(),
                    durability: TOOL_STATS.oar.maxDurability, maxDurability: TOOL_STATS.oar.maxDurability
                });
                state.logs.unshift("Adalara gitmek için sağlam bir Kürek ürettin!");
            } else {
                state.logs.unshift(`Kürek için ${costWood} Tahta ve ${costPlastic} Plastik gerekiyor!`);
            }
        },

        // ==========================================
        // 4. KEŞİF SİSTEMİ
        // ==========================================

        exploreIsland: (state) => {
            if (state.isGameOver) return;
            const oarIndex = state.equipment.findIndex(item => item.itemId === 'oar');
            if (oarIndex === -1) {
                state.logs.unshift("Açık denizlerde ilerlemek ve adaları keşfetmek için Kürek üretmelisin!"); return;
            }

            if (state.vitals.hunger < 25 || state.vitals.thirst < 25) {
                state.logs.unshift("Adayı keşfedecek gücün yok. (En az 25 Açlık ve Susuzluk gerekli)"); return;
            }

            state.vitals.hunger -= 25;
            state.vitals.thirst -= 25;
            state.equipment[oarIndex].durability -= 10;
            const isOarBroken = state.equipment[oarIndex].durability <= 0;

            // ADADAN GELEN EŞYALARA DA LIMIT UYGULANDI
            addItem(state, 'wood', 8);
            addItem(state, 'leaf', 4);
            addItem(state, 'metal', 1);
            state.logs.unshift("Bir adaya çıktın! Terk edilmiş bir kamp buldun. (Bulabildiğin kadarını çantana attın)");

            if (isOarBroken) {
                state.equipment.splice(oarIndex, 1);
                state.logs.unshift("Adaya kürek çekerken Küreğin KIRILDI!");
            }
        },

        // ==========================================
        // 5. İNŞAAT VE OTOMASYON SİSTEMİ
        // ==========================================

        buildNet: (state) => {
            if (state.isGameOver) return;
            const costWood = 3; const costPlastic = 3;

            if (state.inventory.wood >= costWood && state.inventory.plastic >= costPlastic) {
                state.inventory.wood -= costWood;
                state.inventory.plastic -= costPlastic;
                state.buildings.collectionNet += 1;
                state.logs.unshift(`Yeni bir Toplama Ağı kurdun! (Toplam: ${state.buildings.collectionNet})`);
            } else {
                state.logs.unshift(`Ağ kurmak için ${costWood} Tahta ve ${costPlastic} Plastiğe ihtiyacın var!`);
            }
        },

        buildPurifier: (state) => {
            if (state.isGameOver) return;
            if (state.buildings.waterPurifier) {
                state.logs.unshift("Zaten bir Su Arıtıcın var!"); return;
            }
            const costPlastic = 6; const costMetal = 2;

            if (state.inventory.plastic >= costPlastic && state.inventory.metal >= costMetal) {
                state.inventory.plastic -= costPlastic;
                state.inventory.metal -= costMetal;
                state.buildings.waterPurifier = true;
                state.logs.unshift("Su Arıtıcı kurdun! Artık su kaynatmak için tahta harcamayacaksın.");
            } else {
                state.logs.unshift(`Su Arıtıcı için ${costPlastic} Plastik, ${costMetal} Metal lazım!`);
            }
        },

        buildGrill: (state) => {
            if (state.isGameOver) return;
            if (state.buildings.grill) {
                state.logs.unshift("Zaten bir Izgaran var!"); return;
            }
            const costWood = 5; const costMetal = 2;

            if (state.inventory.wood >= costWood && state.inventory.metal >= costMetal) {
                state.inventory.wood -= costWood;
                state.inventory.metal -= costMetal;
                state.buildings.grill = true;
                state.logs.unshift("Izgara kurdun! Artık balık pişirmek için tahta harcamayacaksın.");
            } else {
                state.logs.unshift(`Izgara için ${costWood} Tahta, ${costMetal} Metal lazım!`);
            }
        },

        // ==========================================
        // 6. HAYATTA KALMA (SURVIVAL) EYLEMLERİ
        // ==========================================

        boilWater: (state) => {
            if (state.isGameOver) return;
            // LIMIT KONTROLÜ
            if (state.inventory.water >= ITEM_LIMITS.water) {
                state.logs.unshift(`Çantanda daha fazla su için yer yok (Limit ${ITEM_LIMITS.water})!`);
                return;
            }

            if (state.buildings.waterPurifier) {
                addItem(state, 'water');
                state.logs.unshift("Su arıtıcından 1 şişe Temiz Su doldurdun. (Çantana Eklendi)");
            } else {
                if (state.inventory.wood >= 1) {
                    state.inventory.wood -= 1;
                    addItem(state, 'water');
                    state.logs.unshift("Ateş yakıp deniz suyunu arıttın. 1 şişe Temiz Su elde ettin. (-1 Tahta)");
                } else {
                    state.logs.unshift("Su kaynatmak için en az 1 Tahta lazım!");
                }
            }
        },

        cookFish: (state) => {
            if (state.isGameOver) return;
            // LIMIT KONTROLÜ
            if (state.inventory.food >= ITEM_LIMITS.food) {
                state.logs.unshift(`Çantanda daha fazla yemek için yer yok (Limit ${ITEM_LIMITS.food})!`);
                return;
            }

            const hasGrill = state.buildings.grill;
            const woodCost = hasGrill ? 0 : 1;
            const plasticCost = 1;

            if (state.inventory.wood >= woodCost && state.inventory.plastic >= plasticCost) {
                state.inventory.wood -= woodCost;
                state.inventory.plastic -= plasticCost;
                addItem(state, 'food');

                if (hasGrill) {
                    state.logs.unshift("Balık tutup ızgarada nar gibi kızarttın! 1 Pişmiş Balık çantana eklendi. (-1 Plastik)");
                } else {
                    state.logs.unshift("Balık tuttun ve ateşte pişirdin. 1 Pişmiş Balık elde ettin. (-1 Tahta, -1 Plastik)");
                }
            } else {
                state.logs.unshift(`Balık pişirmek için ${woodCost > 0 ? woodCost + ' Tahta ve ' : ''}${plasticCost} Plastiğe ihtiyacın var!`);
            }
        },

        drinkWater: (state) => {
            if (state.isGameOver) return;
            if (state.inventory.water <= 0) {
                state.logs.unshift("Çantanda hiç su yok!"); return;
            }
            if (state.vitals.thirst >= 100) {
                state.logs.unshift("Zaten hiç susamadın."); return;
            }
            state.inventory.water -= 1;
            state.vitals.thirst = Math.min(100, state.vitals.thirst + 25);
            state.logs.unshift("Çantandan Temiz Su içtin. (+25 Susuzluk)");
        },

        eatFood: (state) => {
            if (state.isGameOver) return;
            if (state.inventory.food <= 0) {
                state.logs.unshift("Çantanda yiyecek hiçbir şey yok!"); return;
            }
            if (state.vitals.hunger >= 100) {
                state.logs.unshift("Karnın zaten tok."); return;
            }
            state.inventory.food -= 1;
            state.vitals.hunger = Math.min(100, state.vitals.hunger + 30);
            state.logs.unshift("Çantandan Pişmiş Balık yedin. Karnın doydu. (+30 Açlık)");
        },

        craftBandage: (state) => {
            if (state.isGameOver) return;
            // LIMIT KONTROLÜ
            if (state.inventory.bandage >= ITEM_LIMITS.bandage) {
                state.logs.unshift(`Çantanda daha fazla bandaj için yer yok (Limit ${ITEM_LIMITS.bandage})!`);
                return;
            }

            const costLeaf = 3;
            if (state.inventory.leaf >= costLeaf) {
                state.inventory.leaf -= costLeaf;
                addItem(state, 'bandage');
                state.logs.unshift("Palmiye yapraklarından 1 adet Bandaj ürettin. Çantana eklendi.");
            } else {
                state.logs.unshift(`Bandaj üretmek için en az ${costLeaf} Yaprak gerekiyor!`);
            }
        },

        useBandage: (state) => {
            if (state.isGameOver) return;
            if (state.inventory.bandage <= 0) {
                state.logs.unshift("Çantanda hiç bandaj yok!"); return;
            }
            if (state.vitals.health >= 100) {
                state.logs.unshift("Canın zaten dolu! Bandaj harcamana gerek yok."); return;
            }

            state.inventory.bandage -= 1;
            state.vitals.health = Math.min(100, state.vitals.health + 25);
            state.logs.unshift("Çantandan bir Bandaj kullandın. Yaralarını sardın (+25 Can).");
        },

        // ==========================================
        // 7. OYUN AKIŞ KONTROLLERİ
        // ==========================================

        startGame: (state) => { state.isGameStarted = true; },
        pauseGame: (state) => { state.isGamePaused = true; },
        resumeGame: (state) => { state.isGamePaused = false; },
        quitToMenu: (state) => { state.isGameStarted = false; state.isGamePaused = false; },

        startNewGame: (state) => {
            state.vitals = { health: 100, hunger: 100, thirst: 100 };
            state.inventory = { wood: 0, plastic: 0, leaf: 0, metal: 0, bandage: 0, water: 0, food: 0 };
            state.inventoryOrder = [
                'wood', 'plastic', 'leaf', 'metal', 'empty_1',
                'water', 'food', 'bandage', 'empty_2', 'empty_3',
                'hook', 'spear', 'oar', 'empty_4', 'empty_5'
            ];
            state.equipment = [{ itemId: 'hook', id: 'start_hook', durability: TOOL_STATS.hook.maxDurability, maxDurability: TOOL_STATS.hook.maxDurability }];
            state.buildings = { collectionNet: 0, waterPurifier: false, grill: false };
            state.logs = ["Uçsuz bucaksız okyanusta, küçük bir salın üzerindesin..."];
            state.day = 1;
            state.time = 8;
            state.weather = 'sunny';
            state.isGameOver = false;
            state.isGamePaused = false;
            state.isGameStarted = true;
        },

        restartGame: () => { return initialState; }
    }
});

export const { dropItem, swapInventorySlots, throwHook, gameTick, startGame, startNewGame, pauseGame, resumeGame, quitToMenu, restartGame, boilWater, cookFish, drinkWater, eatFood, buildNet, buildPurifier, buildGrill, craftSpear, craftHook, gatherByHand, craftOar, exploreIsland, craftBandage, useBandage } = gameSlice.actions;
export default gameSlice.reducer;