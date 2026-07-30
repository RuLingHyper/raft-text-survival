import { createSlice } from "@reduxjs/toolkit";

// Aletlerin maksimum can değerlerini bir sözlükte tutalım (İleride items.js'e taşıyabiliriz)
const TOOL_STATS = {
    hook: { maxDurability: 40 },
    spear: { maxDurability: 20 },
    oar: { maxDurability: 50 }
};

const initialState = {
    vitals: { health: 100, hunger: 100, thirst: 100 },
    inventory: {
        wood: 0,
        plastic: 0,
        leaf: 0,
        metal: 0,
    },
    // YENİ SİSTEM: Aletler artık true/false değil, canı olan objelerden oluşan bir liste!
    equipment: [
        // Oyuna 40 canı olan bir başlangıç kancası ile başlıyoruz
        { itemId: 'hook', id: 'start_hook', durability: TOOL_STATS.hook.maxDurability, maxDurability: TOOL_STATS.hook.maxDurability }
    ],
    buildings: {
        collectionNet: 0,
        waterPurifier: 0, // Su arıtıcı
        grill: 0          // Pişirme ızgarası
    },
    logs: ["Uçsuz bucaksız okyanusta, küçük bir salın üzerindesin..."],
    isGameOver: false,
    isGameStarted: true,
    isGamePaused: false,
};

export const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        throwHook: (state) => {
            if (state.isGameOver) return;

            // YENİ: Envanterde kanca var mı kontrol et
            const hookIndex = state.equipment.findIndex(item => item.itemId === 'hook');
            if (hookIndex === -1) {
                state.logs.unshift("Kancan yok! Denizden eşya çekemezsin. Yeni bir kanca üretmelisin.");
                if (state.logs.length > 15) state.logs.pop();
                return;
            }

            // Kancanın canını 1 düşür
            state.equipment[hookIndex].durability -= 1;
            const isHookBroken = state.equipment[hookIndex].durability <= 0;

            const chance = Math.floor(Math.random() * 100);

            if (chance < 35) {
                state.inventory.wood += 1;
                state.logs.unshift("Kancayı salladın ve denizden 1 adet Tahta çektin.");
            } else if (chance < 60) {
                state.inventory.plastic += 1;
                state.logs.unshift("Kancayı salladın ve denizden 1 adet Plastik çektin.");
            } else if (chance < 85) {
                state.inventory.leaf += 1;
                state.logs.unshift("Kancayı salladın ve denizden 1 adet Yaprak çektin.")
            } else if (chance < 95) {
                state.inventory.metal += 1;
                state.logs.unshift("Ağır bir şey çektin! Denizden 1 adet Metal buldun.");
            } else {
                state.logs.unshift("Kancayı salladın ama ucuna sadece yosun takıldı. Boş çektin.");
            }

            // Kanca kırıldıysa listeden sil
            if (isHookBroken) {
                state.equipment.splice(hookIndex, 1);
                state.logs.unshift("KIRILDI! Kancan parçalandı, yenisini yapmalısın.");
            }

            if (state.logs.length > 15) state.logs.pop();
        },

        gameTick: (state) => {
            if (!state.isGameStarted || state.isGameOver || state.isGamePaused) return;

            if (state.vitals.hunger > 0) state.vitals.hunger -= 1;
            if (state.vitals.thirst > 0) state.vitals.thirst -= 1;

            if (state.vitals.hunger === 0 || state.vitals.thirst === 0) {
                if (state.vitals.health > 0) state.vitals.health -= 5;
            }

            // Köpek Balığı Saldırısı (DENGELENDİ)
            const eventChance = Math.floor(Math.random() * 100);
            if (eventChance < 7) { // İhtimali %10'dan %7'ye düşürdük
                // Mızrak var mı kontrol et
                const spearIndex = state.equipment.findIndex(item => item.itemId === 'spear');

                if (spearIndex !== -1) {
                    state.logs.unshift("Köpek balığı saldırdı ama MIZRAK ile savuşturdun! (Mızrağın hasar aldı)");
                    // Mızrağın canını 5 azalt (Maks canı 20, yani 4 saldırı savuşturabilir)
                    state.equipment[spearIndex].durability -= 5;

                    if (state.equipment[spearIndex].durability <= 0) {
                        state.equipment.splice(spearIndex, 1);
                        state.logs.unshift("Mızrağın KIRILDI!");
                    }
                } else {
                    state.vitals.health -= 10; // -20 can yerine -10 can
                    state.inventory.wood = Math.max(0, state.inventory.wood - 1); // -2 tahta yerine -1 tahta
                    state.logs.unshift("KÖPEK BALIĞI SALDIRDI! Salın hasar gördü ve yaralandın. (-10 Can, -1 Tahta)");
                }
            }

            if (state.buildings.collectionNet > 0) {
                for (let i = 0; i < state.buildings.collectionNet; i++) {
                    const chance = Math.floor(Math.random() * 100);
                    if (chance < 30) {
                        state.inventory.wood += 1;
                        state.logs.unshift("Ağlarına 1 adet Tahta takıldı.");
                    } else if (chance < 50) {
                        state.inventory.plastic += 1;
                        state.logs.unshift("Ağlarına 1 adet Plastik takıldı.")
                    }
                }
            }

            if (state.vitals.health <= 0) {
                state.isGameOver = true;
            }

            if (state.logs.length > 15) state.logs.length = 15;
        },

        // YENİ SİSTEM: Mızrak Üretme
        craftSpear: (state) => {
            if (state.isGameOver) return;
            const costWood = 4;
            const costMetal = 1;

            if (state.inventory.wood >= costWood && state.inventory.metal >= costMetal) {
                state.inventory.wood -= costWood;
                state.inventory.metal -= costMetal;
                // Mızrağı objesiyle birlikte çantaya ekle
                state.equipment.push({
                    itemId: 'spear',
                    id: Date.now().toString(),
                    durability: TOOL_STATS.spear.maxDurability,
                    maxDurability: TOOL_STATS.spear.maxDurability
                });
                state.logs.unshift("Kendini savunmak için sağlam bir Mızrak ürettin!");
            } else {
                state.logs.unshift(`Mızrak için ${costWood} Tahta ve ${costMetal} Metal gerekiyor!`);
            }
        },

        // YENİ: Kanca Üretme Fonksiyonu
        craftHook: (state) => {
            if (state.isGameOver) return;

            // Zaten kancası var mı diye kontrol edelim
            const hasHook = state.equipment.some(item => item.itemId === 'hook');
            if (hasHook) {
                state.logs.unshift("Zaten sağlam bir kancan var!");
                return;
            }

            const costWood = 2;
            const costPlastic = 2;

            if (state.inventory.wood >= costWood && state.inventory.plastic >= costPlastic) {
                state.inventory.wood -= costWood;
                state.inventory.plastic -= costPlastic;

                // Yeni kancayı çantaya ekle
                state.equipment.push({
                    itemId: 'hook',
                    id: Date.now().toString(),
                    durability: 40, // maxDurability
                    maxDurability: 40
                });
                state.logs.unshift("Yeniden eşya toplayabilmek için yeni bir Plastik Kanca ürettin!");
            } else {
                state.logs.unshift(`Kanca üretmek için ${costWood} Tahta ve ${costPlastic} Plastiğe ihtiyacın var!`);
            }
        },

        // YENİ: Kancasız kalındığında elle toplama (Acil Durum)
        gatherByHand: (state) => {
            if (state.isGameOver) return;

            if (state.vitals.hunger < 10) {
                state.logs.unshift("Denize uzanacak gücün kalmadı! (En az 10 Açlık gerekli)");
                return;
            }

            // Elle toplamak yorucudur
            state.vitals.hunger -= 10;

            // Garantili acil durum malzemesi veriyoruz
            state.inventory.wood += 1;
            state.inventory.plastic += 1;

            state.logs.unshift("Tehlikeyi göze alıp denize uzandın ve zar zor biraz malzeme yakaladın! (-10 Açlık, +1 Tahta, +1 Plastik)");

            if (state.logs.length > 15) state.logs.pop();
        },

        // YENİ SİSTEM: Kürek Üretme
        craftOar: (state) => {
            if (state.isGameOver) return;
            const costWood = 5;
            const costPlastic = 5;

            if (state.inventory.wood >= costWood && state.inventory.plastic >= costPlastic) {
                state.inventory.wood -= costWood;
                state.inventory.plastic -= costPlastic;
                // Küreği çantaya ekle
                state.equipment.push({
                    itemId: 'oar',
                    id: Date.now().toString(),
                    durability: TOOL_STATS.oar.maxDurability,
                    maxDurability: TOOL_STATS.oar.maxDurability
                });
                state.logs.unshift("Adalara gitmek için sağlam bir Kürek ürettin!");
            } else {
                state.logs.unshift(`Kürek için ${costWood} Tahta ve ${costPlastic} Plastik gerekiyor!`);
            }
        },

        exploreIsland: (state) => {
            if (state.isGameOver) return;

            // Kürek var mı kontrol et
            const oarIndex = state.equipment.findIndex(item => item.itemId === 'oar');
            if (oarIndex === -1) {
                state.logs.unshift("Açık denizlerde ilerlemek ve adaları keşfetmek için Kürek üretmelisin!");
                return;
            }

            if (state.vitals.hunger < 25 || state.vitals.thirst < 25) {
                state.logs.unshift("Adayı keşfedecek gücün yok. (En az 25 Açlık ve Susuzluk gerekli)");
                return;
            }

            state.vitals.hunger -= 25;
            state.vitals.thirst -= 25;

            // Küreğin canını azalt
            state.equipment[oarIndex].durability -= 10;
            const isOarBroken = state.equipment[oarIndex].durability <= 0;

            state.inventory.wood += 8;
            state.inventory.leaf += 4;
            state.inventory.metal += 1;

            state.logs.unshift("Bir adaya çıktın! Terk edilmiş bir kamp buldun. (+8 Tahta, +4 Yaprak, +1 Metal)");

            if (isOarBroken) {
                state.equipment.splice(oarIndex, 1);
                state.logs.unshift("Adaya kürek çekerken Küreğin KIRILDI!");
            }
        },

        buildNet: (state) => {
            if (state.isGameOver) return;
            const costWood = 3;
            const costPlastic = 3;

            if (state.inventory.wood >= costWood && state.inventory.plastic >= costPlastic) {
                state.inventory.wood -= costWood;
                state.inventory.plastic -= costPlastic;
                state.buildings.collectionNet += 1;
                state.logs.unshift(`Yeni bir Toplama Ağı kurdun! (Toplam: ${state.buildings.collectionNet})`);
            } else {
                state.logs.unshift(`Ağ kurmak için ${costWood} Tahta ve ${costPlastic} Plastiğe ihtiyacın var!`);
            }
        },

        // YENİ: Su Arıtıcı Kur
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

        // YENİ: Izgara Kur
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

        // GÜNCELLENDİ: Su Arıtma (Arıtıcı varsa bedava)
        boilWater: (state) => {
            if (state.isGameOver) return;

            if (state.buildings.waterPurifier) {
                state.vitals.thirst = Math.min(100, state.vitals.thirst + 20);
                state.logs.unshift("Su arıtıcından temiz su içtin. (+20 Susuzluk)");
            } else {
                if (state.inventory.wood >= 1) {
                    state.inventory.wood -= 1;
                    state.vitals.thirst = Math.min(100, state.vitals.thirst + 20);
                    state.logs.unshift("Ateş yakıp deniz suyunu arıttın. (-1 Tahta, +20 Susuzluk)");
                } else {
                    state.logs.unshift("Su kaynatmak için en az 1 Tahta lazım!");
                }
            }
            if (state.logs.length > 10) state.logs.length = 10;
        },

        // GÜNCELLENDİ: Balık Pişirme (Izgara varsa tahta istemez)
        cookFish: (state) => {
            if (state.isGameOver) return;

            const hasGrill = state.buildings.grill;
            const woodCost = hasGrill ? 0 : 1;
            const plasticCost = 1; // Olta ipi/yem maliyeti

            if (state.inventory.wood >= woodCost && state.inventory.plastic >= plasticCost) {
                state.inventory.wood -= woodCost;
                state.inventory.plastic -= plasticCost;
                state.vitals.hunger = Math.min(100, state.vitals.hunger + 20);

                if (hasGrill) {
                    state.logs.unshift("Balık tutup ızgarada nar gibi kızarttın! (-1 Plastik, +20 Açlık)");
                } else {
                    state.logs.unshift("Balık tuttun ve ateşte pişirdin. (-1 Tahta, -1 Plastik, +20 Açlık)");
                }
            } else {
                state.logs.unshift(`Balık pişirmek için ${woodCost > 0 ? woodCost + ' Tahta ve ' : ''}${plasticCost} Plastiğe ihtiyacın var!`);
            }
            if (state.logs.length > 10) state.logs.length = 10;
        },

        startGame: (state) => { state.isGameStarted = true; },
        startNewGame: (state) => {
            state.vitals = { health: 100, hunger: 100, thirst: 100 };
            state.inventory = { wood: 0, plastic: 0, leaf: 0, metal: 0 };
            state.equipment = [{ itemId: 'hook', id: 'start_hook', durability: TOOL_STATS.hook.maxDurability, maxDurability: TOOL_STATS.hook.maxDurability }];
            state.buildings = {
                collectionNet: 0,
                waterPurifier: false, // YENİ
                grill: false          // YENİ
            };
            state.logs = ["Uçsuz bucaksız okyanusta, küçük bir salın üzerindesin..."];
            state.isGameOver = false;
            state.isGamePaused = false;
            state.isGameStarted = true;
        },
        pauseGame: (state) => { state.isGamePaused = true; },
        resumeGame: (state) => { state.isGamePaused = false; },
        quitToMenu: (state) => { state.isGameStarted = false; state.isGamePaused = false; },
        restartGame: () => { return initialState; },

        boilWater: (state) => {
            if (state.isGameOver) return;
            if (state.inventory.wood >= 1) {
                state.inventory.wood -= 1;
                state.vitals.thirst = Math.min(100, state.vitals.thirst + 20);
                state.logs.unshift("Ateş yakıp deniz suyunu arıttın. (+20 Susuzluk)");
            } else {
                state.logs.unshift("Su kaynatmak için en az 1 Tahta lazım!");
            }
            if (state.logs.length > 10) state.logs.pop();
        },

        cookFish: (state) => {
            if (state.isGameOver) return;
            if (state.inventory.wood >= 1 && state.inventory.plastic >= 1) {
                state.inventory.wood -= 1;
                state.inventory.plastic -= 1;
                state.vitals.hunger = Math.min(100, state.vitals.hunger + 20);
                state.logs.unshift("Plastik ipten olta yapıp balık tuttun ve ateşte pişirdin. (+20 Açlık)");
            } else {
                state.logs.unshift("Balık tutup pişirmek için 1 Tahta ve 1 Plastiğe ihtiyacın var!");
            }
            if (state.logs.length > 10) state.logs.pop();
        },

        craftBandage: (state) => {
            if (state.isGameOver) return;
            if (state.vitals.health >= 100) {
                state.logs.unshift("Canın zaten dolu! Bandaj harcamana gerek yok.");
                return;
            }
            const costLeaf = 3;
            if (state.inventory.leaf >= costLeaf) {
                state.inventory.leaf -= costLeaf;
                state.vitals.health = Math.min(100, state.vitals.health + 25);
                state.logs.unshift("Palmiye yapraklarından şifalı bir bandaj yapıp yaralarını sardın. (+25 Can)");
            } else {
                state.logs.unshift(`Bandaj yapmak için en az ${costLeaf} Yaprak gerekiyor!`);
            }
        }
    }
});

export const { throwHook, gameTick, startGame, startNewGame, pauseGame, resumeGame, quitToMenu, restartGame, boilWater, cookFish, buildNet, buildPurifier, buildGrill, craftSpear, craftHook, gatherByHand, craftOar, exploreIsland, craftBandage } = gameSlice.actions;
export default gameSlice.reducer;