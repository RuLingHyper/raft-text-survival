import { createSlice } from "@reduxjs/toolkit";

const TOOL_STATS = {
    hook: { maxDurability: 40 },
    spear: { maxDurability: 20 },
    oar: { maxDurability: 50 }
};

// YENİ: Nadir eşyalar da listeye eklendi (Limitleri 1, çünkü 1 tane bulmak yeterli)
const STACK_LIMITS = {
    wood: 50, plastic: 50, leaf: 50, metal: 50,
    water: 20, food: 20, bandage: 10,
    circuit_board: 1, military_battery: 1, signal_antenna: 1
};

const INVENTORY_SIZE = 15;

const addItem = (state, itemId, amount = 1) => {
    let remaining = amount;
    for (let i = 0; i < INVENTORY_SIZE; i++) {
        const slot = state.inventory[i];
        if (slot && slot.itemId === itemId && slot.count < STACK_LIMITS[itemId]) {
            const spaceLeft = STACK_LIMITS[itemId] - slot.count;
            if (remaining <= spaceLeft) {
                slot.count += remaining;
                return true;
            } else {
                slot.count += spaceLeft;
                remaining -= spaceLeft;
            }
        }
    }
    for (let i = 0; i < INVENTORY_SIZE; i++) {
        if (state.inventory[i] === null) {
            const addAmount = Math.min(remaining, STACK_LIMITS[itemId]);
            state.inventory[i] = { itemId, count: addAmount };
            remaining -= addAmount;
            if (remaining <= 0) return true;
        }
    }
    return remaining < amount;
};

const hasEnough = (state, itemId, amount) => {
    const total = state.inventory.reduce((sum, slot) => {
        return slot && slot.itemId === itemId ? sum + slot.count : sum;
    }, 0);
    return total >= amount;
};

const removeItems = (state, itemId, amount) => {
    let remaining = amount;
    for (let i = INVENTORY_SIZE - 1; i >= 0; i--) {
        const slot = state.inventory[i];
        if (slot && slot.itemId === itemId) {
            if (slot.count > remaining) {
                slot.count -= remaining;
                return;
            } else {
                remaining -= slot.count;
                state.inventory[i] = null;
                if (remaining <= 0) return;
            }
        }
    }
};

const initialState = {
    vitals: { health: 100, hunger: 100, thirst: 100 },
    inventory: Array(INVENTORY_SIZE).fill(null),
    equipment: [
        { itemId: 'hook', id: 'start_hook', durability: TOOL_STATS.hook.maxDurability, maxDurability: TOOL_STATS.hook.maxDurability }
    ],
    buildings: {
        collectionNet: 0,
        waterPurifier: false,
        grill: false
    },
    merchant: {
        active: false,
        timer: 0,
        offer: { costItem: '', costCount: 0, rewardItem: '', rewardCount: 0 }
    },
    logs: ["Uçsuz bucaksız okyanusta, küçük bir salın üzerindesin..."],
    tickCount: 0,
    day: 1,
    time: 8,
    weather: 'sunny',
    isGameOver: false,
    isGameWon: false, // YENİ: Oyunu kazanma durumu eklendi!
    isGameStarted: true,
    isGamePaused: false,
};

export const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        // ==========================================
        // SADECE TEST İÇİN - GELİŞTİRİCİ HİLESİ
        // ==========================================
        debugGiveAllItems: (state) => {
            // SOS için gereken her şeyi çantaya doldurur
            addItem(state, 'circuit_board', 1);
            addItem(state, 'military_battery', 1);
            addItem(state, 'signal_antenna', 1);
            addItem(state, 'metal', 15);
            addItem(state, 'plastic', 20);

            // Eğer sığmazsa diye biraz da yer açalım
            state.logs.unshift("🛠️ GELİŞTİRİCİ HİLESİ KULLANILDI: Tüm nadir parçalar çantaya eklendi!");
        },

        tradeWithMerchant: (state) => {
            const { costItem, costCount, rewardItem, rewardCount } = state.merchant.offer;
            if (hasEnough(state, costItem, costCount)) {
                removeItems(state, costItem, costCount);
                addItem(state, rewardItem, rewardCount);
                state.merchant.active = false;
                state.logs.unshift(`✅ Martı ile ticaret yaptın: ${costCount} ${costItem} verip, ${rewardCount} ${rewardItem} aldın.`);
            } else {
                state.logs.unshift("❌ Martı, teklifini kabul etmedi: Yeterli eşyan yok!");
            }
        },

        dropItem: (state, action) => {
            if (state.isGameOver || state.isGameWon) return;
            const { slotIndex, itemName, amount = 1 } = action.payload;
            const slot = state.inventory[slotIndex];

            if (slot) {
                slot.count -= amount;
                if (slot.count <= 0) state.inventory[slotIndex] = null;
                state.logs.unshift(`Envanterden ${amount} adet ${itemName} denize atıldı.`);
            }
        },

        swapInventorySlots: (state, action) => {
            const { fromIndex, toIndex } = action.payload;
            const temp = state.inventory[fromIndex];
            state.inventory[fromIndex] = state.inventory[toIndex];
            state.inventory[toIndex] = temp;
        },

        throwHook: (state) => {
            if (state.isGameOver || state.isGameWon) return;

            const hookIndex = state.equipment.findIndex(item => item.itemId === 'hook');
            if (hookIndex === -1) {
                state.logs.unshift("Kancan yok! Denizden eşya çekemezsin. Yeni bir kanca üretmelisin.");
                if (state.logs.length > 15) state.logs.pop();
                return;
            }

            state.equipment[hookIndex].durability -= 1;
            const isHookBroken = state.equipment[hookIndex].durability <= 0;
            const chance = Math.floor(Math.random() * 100);

            if (chance < 15) {
                const barrelLoot = ['wood', 'plastic', 'leaf'];
                const lootCount = Math.floor(Math.random() * 3) + 3;
                let logDetails = [];

                for (let i = 0; i < lootCount; i++) {
                    const randomItem = barrelLoot[Math.floor(Math.random() * barrelLoot.length)];
                    if (addItem(state, randomItem)) {
                        logDetails.push(randomItem === 'wood' ? 'Tahta' : randomItem === 'plastic' ? 'Plastik' : 'Yaprak');
                    }
                }

                if (Math.random() < 0.30) {
                    if (addItem(state, 'metal')) logDetails.push('Metal');
                } else if (Math.random() < 0.20) {
                    if (addItem(state, 'water')) logDetails.push('Temiz Su');
                }

                if (logDetails.length > 0) {
                    state.logs.unshift(`🛢️ BÜYÜK İKRAMİYE! Yüzen bir fıçı yakaladın! İçinden çıkanlar: ${logDetails.join(', ')}.`);
                } else {
                    state.logs.unshift("🛢️ Bir fıçı yakaladın ama çantan ağzına kadar dolu olduğu için içindekileri alamadın!");
                }
            }
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

        gameTick: (state) => {
            if (!state.isGameStarted || state.isGameOver || state.isGamePaused || state.isGameWon) return;

            if (!state.merchant) {
                state.merchant = { active: false, timer: 0, offer: { costItem: '', costCount: 0, rewardItem: '', rewardCount: 0 } };
            }

            if (state.merchant.active) {
                state.merchant.timer -= 1;
                if (state.merchant.timer <= 0) {
                    state.merchant.active = false;
                    state.logs.unshift("🐦 Gezgin martı yoruldu ve kanat çırparak uzaklaştı.");
                }
            } else if (state.tickCount % 20 === 0 && Math.random() < 0.4) {
                state.merchant.active = true;
                state.merchant.timer = 15;

                const trades = [
                    { costItem: 'plastic', costCount: 2, rewardItem: 'metal', rewardCount: 1 },
                    { costItem: 'leaf', costCount: 5, rewardItem: 'water', rewardCount: 1 }
                ];
                state.merchant.offer = trades[Math.floor(Math.random() * trades.length)];
                state.logs.unshift("🐦 Bir martı salına kondu! Seninle bir şey takas etmek istiyor.");
            }

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

            if (state.weather === 'rainy' && state.buildings.waterPurifier) {
                if (Math.floor(Math.random() * 100) < 15) {
                    if (addItem(state, 'water')) {
                        state.logs.unshift("💧 Yağmur sayesinde su arıtıcına bedava 1 şişe Temiz Su doldu.");
                    }
                }
            } else if (state.weather === 'stormy') {
                if (Math.floor(Math.random() * 100) < 10) {
                    if (hasEnough(state, 'wood', 1)) {
                        removeItems(state, 'wood', 1);
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
                    if (hasEnough(state, 'wood', 1)) removeItems(state, 'wood', 1);
                    state.logs.unshift("KÖPEK BALIĞI SALDIRDI! Salın hasar gördü ve yaralandın. (-10 Can, -1 Tahta)");
                }
            }

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
                localStorage.removeItem('rafttextsurvival_save');
                localStorage.removeItem('gameState');
            }

            if (state.logs.length > 15) state.logs.length = 15;
        },

        craftSpear: (state) => {
            if (state.isGameOver) return;
            const costWood = 4; const costMetal = 1;
            if (hasEnough(state, 'wood', costWood) && hasEnough(state, 'metal', costMetal)) {
                removeItems(state, 'wood', costWood);
                removeItems(state, 'metal', costMetal);
                state.equipment.push({ itemId: 'spear', id: Date.now().toString(), durability: TOOL_STATS.spear.maxDurability, maxDurability: TOOL_STATS.spear.maxDurability });
                state.logs.unshift("Kendini savunmak için sağlam bir Mızrak ürettin!");
            } else {
                state.logs.unshift(`Mızrak için ${costWood} Tahta ve ${costMetal} Metal gerekiyor!`);
            }
        },

        craftHook: (state) => {
            if (state.isGameOver) return;
            const hasHook = state.equipment.some(item => item.itemId === 'hook');
            if (hasHook) { state.logs.unshift("Zaten sağlam bir kancan var!"); return; }
            const costWood = 2; const costPlastic = 2;
            if (hasEnough(state, 'wood', costWood) && hasEnough(state, 'plastic', costPlastic)) {
                removeItems(state, 'wood', costWood);
                removeItems(state, 'plastic', costPlastic);
                state.equipment.push({ itemId: 'hook', id: Date.now().toString(), durability: TOOL_STATS.hook.maxDurability, maxDurability: TOOL_STATS.hook.maxDurability });
                state.logs.unshift("Yeniden eşya toplayabilmek için yeni bir Plastik Kanca ürettin!");
            } else {
                state.logs.unshift(`Kanca üretmek için ${costWood} Tahta ve ${costPlastic} Plastiğe ihtiyacın var!`);
            }
        },

        gatherByHand: (state) => {
            if (state.isGameOver) return;
            if (state.vitals.hunger < 10) { state.logs.unshift("Denize uzanacak gücün kalmadı! (En az 10 Açlık gerekli)"); return; }
            state.vitals.hunger -= 10;
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
            if (hasEnough(state, 'wood', costWood) && hasEnough(state, 'plastic', costPlastic)) {
                removeItems(state, 'wood', costWood);
                removeItems(state, 'plastic', costPlastic);
                state.equipment.push({ itemId: 'oar', id: Date.now().toString(), durability: TOOL_STATS.oar.maxDurability, maxDurability: TOOL_STATS.oar.maxDurability });
                state.logs.unshift("Adalara gitmek için sağlam bir Kürek ürettin!");
            } else {
                state.logs.unshift(`Kürek için ${costWood} Tahta ve ${costPlastic} Plastik gerekiyor!`);
            }
        },

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

            // YENİ: KAZANMAK İÇİN GEREKLİ OLAN %1 İHTİMALLİ EŞYALAR!
            const rareChance = Math.floor(Math.random() * 100);

            if (rareChance === 0) { // %1 İhtimal
                if (addItem(state, 'circuit_board')) {
                    state.logs.unshift("🌟 İNANILMAZ! Terk edilmiş bir kulübede sağlam bir 'Devre Kartı' buldun!");
                } else {
                    state.logs.unshift("🌟 Devre Kartı buldun ama çantanda yer olmadığı için alamadın!");
                }
            } else if (rareChance === 1) { // %1 İhtimal
                if (addItem(state, 'military_battery')) {
                    state.logs.unshift("🌟 İNANILMAZ! Eski bir sığınakta dolu bir 'Askeri Batarya' buldun!");
                } else {
                    state.logs.unshift("🌟 Askeri Batarya buldun ama çantanda yer olmadığı için alamadın!");
                }
            } else if (rareChance === 2) { // %1 İhtimal
                if (addItem(state, 'signal_antenna')) {
                    state.logs.unshift("🌟 İNANILMAZ! Kumların arasına gömülü paslanmaz bir 'Sinyal Anteni' buldun!");
                } else {
                    state.logs.unshift("🌟 Sinyal Anteni buldun ama çantanda yer olmadığı için alamadın!");
                }
            } else {
                // Eğer şanslı %3'lük dilime giremediysek standart ada ganimeti verir
                addItem(state, 'wood', 8);
                addItem(state, 'leaf', 4);
                addItem(state, 'metal', 1);
                state.logs.unshift("Bir adaya çıktın! Terk edilmiş bir kamp buldun. (Standart malzemeler topladın)");
            }

            if (isOarBroken) {
                state.equipment.splice(oarIndex, 1);
                state.logs.unshift("Adaya kürek çekerken Küreğin KIRILDI!");
            }
        },

        buildNet: (state) => {
            if (state.isGameOver) return;
            const costWood = 3; const costPlastic = 3;
            if (hasEnough(state, 'wood', costWood) && hasEnough(state, 'plastic', costPlastic)) {
                removeItems(state, 'wood', costWood);
                removeItems(state, 'plastic', costPlastic);
                state.buildings.collectionNet += 1;
                state.logs.unshift(`Yeni bir Toplama Ağı kurdun! (Toplam: ${state.buildings.collectionNet})`);
            } else {
                state.logs.unshift(`Ağ kurmak için ${costWood} Tahta ve ${costPlastic} Plastiğe ihtiyacın var!`);
            }
        },

        buildPurifier: (state) => {
            if (state.isGameOver) return;
            if (state.buildings.waterPurifier) { state.logs.unshift("Zaten bir Su Arıtıcın var!"); return; }
            const costPlastic = 6; const costMetal = 2;
            if (hasEnough(state, 'plastic', costPlastic) && hasEnough(state, 'metal', costMetal)) {
                removeItems(state, 'plastic', costPlastic);
                removeItems(state, 'metal', costMetal);
                state.buildings.waterPurifier = true;
                state.logs.unshift("Su Arıtıcı kurdun! Artık su kaynatmak için tahta harcamayacaksın.");
            } else {
                state.logs.unshift(`Su Arıtıcı için ${costPlastic} Plastik, ${costMetal} Metal lazım!`);
            }
        },

        buildGrill: (state) => {
            if (state.isGameOver) return;
            if (state.buildings.grill) { state.logs.unshift("Zaten bir Izgaran var!"); return; }
            const costWood = 5; const costMetal = 2;
            if (hasEnough(state, 'wood', costWood) && hasEnough(state, 'metal', costMetal)) {
                removeItems(state, 'wood', costWood);
                removeItems(state, 'metal', costMetal);
                state.buildings.grill = true;
                state.logs.unshift("Izgara kurdun! Artık balık pişirmek için tahta harcamayacaksın.");
            } else {
                state.logs.unshift(`Izgara için ${costWood} Tahta, ${costMetal} Metal lazım!`);
            }
        },

        // ==========================================
        // YENİ: OYUNU KAZANDIRAN ÜRETİM FONKSİYONU
        // ==========================================
        buildSOS: (state) => {
            if (state.isGameOver) return;

            if (hasEnough(state, 'circuit_board', 1) &&
                hasEnough(state, 'military_battery', 1) &&
                hasEnough(state, 'signal_antenna', 1) &&
                hasEnough(state, 'metal', 15) &&
                hasEnough(state, 'plastic', 20)) {

                removeItems(state, 'circuit_board', 1);
                removeItems(state, 'military_battery', 1);
                removeItems(state, 'signal_antenna', 1);
                removeItems(state, 'metal', 15);
                removeItems(state, 'plastic', 20);

                state.isGameWon = true; // OYUNU KAZANDIN!
                localStorage.removeItem('rafttextsurvival_save'); // Bitirdiği için save dosyasını sil
                localStorage.removeItem('gameState');
                state.logs.unshift("🚁 SOS Sinyali başarıyla gönderildi! Kurtarma helikopteri ufukta göründü...");
            } else {
                state.logs.unshift("SOS İstasyonu kurmak için 3 nadir parçaya (Devre Kartı, Batarya, Anten) ve 15 Metal, 20 Plastiğe ihtiyacın var!");
            }
        },

        boilWater: (state) => {
            if (state.isGameOver) return;
            if (state.buildings.waterPurifier) {
                if (addItem(state, 'water')) {
                    state.logs.unshift("Su arıtıcından 1 şişe Temiz Su doldurdun. (Çantana Eklendi)");
                } else {
                    state.logs.unshift(`Çantanda daha fazla su için yer yok!`);
                }
            } else {
                if (hasEnough(state, 'wood', 1)) {
                    if (addItem(state, 'water')) {
                        removeItems(state, 'wood', 1);
                        state.logs.unshift("Ateş yakıp deniz suyunu arıttın. 1 şişe Temiz Su elde ettin. (-1 Tahta)");
                    } else {
                        state.logs.unshift(`Çantanda daha fazla su için yer yok!`);
                    }
                } else {
                    state.logs.unshift("Su kaynatmak için en az 1 Tahta lazım!");
                }
            }
        },

        cookFish: (state) => {
            if (state.isGameOver) return;
            const hasGrill = state.buildings.grill;
            const woodCost = hasGrill ? 0 : 1;
            const plasticCost = 1;

            if (hasEnough(state, 'wood', woodCost) && hasEnough(state, 'plastic', plasticCost)) {
                if (addItem(state, 'food')) {
                    removeItems(state, 'wood', woodCost);
                    removeItems(state, 'plastic', plasticCost);
                    if (hasGrill) {
                        state.logs.unshift("Balık tutup ızgarada nar gibi kızarttın! 1 Pişmiş Balık çantana eklendi. (-1 Plastik)");
                    } else {
                        state.logs.unshift("Balık tuttun ve ateşte pişirdin. 1 Pişmiş Balık elde ettin. (-1 Tahta, -1 Plastik)");
                    }
                } else {
                    state.logs.unshift(`Çantanda daha fazla yemek için yer yok!`);
                }
            } else {
                state.logs.unshift(`Balık pişirmek için ${woodCost > 0 ? woodCost + ' Tahta ve ' : ''}${plasticCost} Plastiğe ihtiyacın var!`);
            }
        },

        drinkWater: (state) => {
            if (state.isGameOver) return;
            if (!hasEnough(state, 'water', 1)) { state.logs.unshift("Çantanda hiç su yok!"); return; }
            if (state.vitals.thirst >= 100) { state.logs.unshift("Zaten hiç susamadın."); return; }
            removeItems(state, 'water', 1);
            state.vitals.thirst = Math.min(100, state.vitals.thirst + 25);
            state.logs.unshift("Çantandan Temiz Su içtin. (+25 Susuzluk)");
        },

        eatFood: (state) => {
            if (state.isGameOver) return;
            if (!hasEnough(state, 'food', 1)) { state.logs.unshift("Çantanda yiyecek hiçbir şey yok!"); return; }
            if (state.vitals.hunger >= 100) { state.logs.unshift("Karnın zaten tok."); return; }
            removeItems(state, 'food', 1);
            state.vitals.hunger = Math.min(100, state.vitals.hunger + 30);
            state.logs.unshift("Çantandan Pişmiş Balık yedin. Karnın doydu. (+30 Açlık)");
        },

        craftBandage: (state) => {
            if (state.isGameOver) return;
            const costLeaf = 3;
            if (hasEnough(state, 'leaf', costLeaf)) {
                if (addItem(state, 'bandage')) {
                    removeItems(state, 'leaf', costLeaf);
                    state.logs.unshift("Palmiye yapraklarından 1 adet Bandaj ürettin. Çantana eklendi.");
                } else {
                    state.logs.unshift(`Çantanda daha fazla bandaj için yer yok!`);
                }
            } else {
                state.logs.unshift(`Bandaj üretmek için en az ${costLeaf} Yaprak gerekiyor!`);
            }
        },

        useBandage: (state) => {
            if (state.isGameOver) return;
            if (!hasEnough(state, 'bandage', 1)) { state.logs.unshift("Çantanda hiç bandaj yok!"); return; }
            if (state.vitals.health >= 100) { state.logs.unshift("Canın zaten dolu! Bandaj harcamana gerek yok."); return; }
            removeItems(state, 'bandage', 1);
            state.vitals.health = Math.min(100, state.vitals.health + 25);
            state.logs.unshift("Çantandan bir Bandaj kullandın. Yaralarını sardın (+25 Can).");
        },

        startGame: (state) => { state.isGameStarted = true; },
        pauseGame: (state) => { state.isGamePaused = true; },
        resumeGame: (state) => { state.isGamePaused = false; },
        quitToMenu: (state) => {
            if (state.isGameOver || state.isGameWon) {
                return { ...initialState, isGameStarted: false };
            } else {
                state.isGameStarted = false;
                state.isGamePaused = false;
            }
        },

        startNewGame: (state) => {
            state.vitals = { health: 100, hunger: 100, thirst: 100 };
            state.inventory = Array(INVENTORY_SIZE).fill(null);
            state.equipment = [{ itemId: 'hook', id: 'start_hook', durability: TOOL_STATS.hook.maxDurability, maxDurability: TOOL_STATS.hook.maxDurability }];
            state.buildings = { collectionNet: 0, waterPurifier: false, grill: false };
            state.logs = ["Uçsuz bucaksız okyanusta, küçük bir salın üzerindesin..."];
            state.tickCount = 0;
            state.day = 1;
            state.time = 8;
            state.weather = 'sunny';
            localStorage.removeItem('gameState');
            localStorage.removeItem('rafttextsurvival_save');
            state.isGameOver = false;
            state.isGameWon = false; // Yeni oyunda kazanma durumunu sıfırla
            state.isGamePaused = false;
            state.isGameStarted = true;
        },

        restartGame: () => { return initialState; }
    }
});

export const { debugGiveAllItems, dropItem, swapInventorySlots, throwHook, gameTick, startGame, startNewGame, pauseGame, resumeGame, quitToMenu, restartGame, boilWater, cookFish, drinkWater, eatFood, buildNet, buildPurifier, buildGrill, buildSOS, craftSpear, craftHook, gatherByHand, craftOar, exploreIsland, craftBandage, useBandage, tradeWithMerchant } = gameSlice.actions;
export default gameSlice.reducer;