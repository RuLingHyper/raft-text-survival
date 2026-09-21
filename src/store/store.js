import { configureStore } from '@reduxjs/toolkit';
import gameReducer from './gameSlice';

// 1. ADIM: Tarayıcı hafızasından (localStorage) kaydı çeken fonksiyon
const loadState = () => {
    try {
        const serializedState = localStorage.getItem('rafttextsurvival_save');
        if (serializedState === null) {
            return undefined; // Kayıt yoksa Redux kendi varsayılan ayarlarıyla başlar
        }
        const parsedState = JSON.parse(serializedState);

        // Eğer oyun bitmişse (ölüm veya zafer), eski kaydı silip sıfırdan başlatalım
        if (parsedState && parsedState.game && (parsedState.game.isGameOver || parsedState.game.isGameWon)) {
            localStorage.removeItem('rafttextsurvival_save');
            return undefined;
        }

        // ÇOK ÖNEMLİ DETAY: 
        // Oyuncu sayfayı yenilediğinde (F5) direkt oyunun ortasında doğmasın, 
        // Ana Menü ekranını görsün diye oyunu durdurulmuş ve başlamamış olarak ayarlıyoruz.
        if (parsedState && parsedState.game) {
            parsedState.game.isGameStarted = false;
            parsedState.game.isGamePaused = false;
            parsedState.game.isFishingMode = false;
            if (!parsedState.game.buildings) {
                parsedState.game.buildings = { collectionNet: 0, waterPurifier: false, grill: false, raftSize: 4, shelter: false, sail: false };
            } else {
                if (typeof parsedState.game.buildings.raftSize !== 'number') parsedState.game.buildings.raftSize = 4;
                if (typeof parsedState.game.buildings.shelter !== 'boolean') parsedState.game.buildings.shelter = false;
                if (typeof parsedState.game.buildings.sail !== 'boolean') parsedState.game.buildings.sail = false;
            }
            if (typeof parsedState.game.sharkCooldown !== 'number') {
                parsedState.game.sharkCooldown = 40;
            }
            if (typeof parsedState.game.grillTimer !== 'number') parsedState.game.grillTimer = 0;
            if (typeof parsedState.game.purifierTimer !== 'number') parsedState.game.purifierTimer = 0;
            if (typeof parsedState.game.isGrillActive !== 'boolean') parsedState.game.isGrillActive = false;
            if (typeof parsedState.game.isPurifierActive !== 'boolean') parsedState.game.isPurifierActive = false;
            if (typeof parsedState.game.isSoundEnabled !== 'boolean') parsedState.game.isSoundEnabled = true;
            if (!parsedState.game.weather) parsedState.game.weather = 'sunny';
        }

        return parsedState;
    } catch (err) {
        console.error("Kayıt yüklenirken hata oluştu:", err);
        return undefined;
    }
};

// 2. ADIM: Oyundaki mevcut durumu tarayıcı hafızasına (localStorage) kaydeden fonksiyon
const saveState = (state) => {
    try {
        if (!state || !state.game || state.game.isGameOver || state.game.isGameWon) {
            localStorage.removeItem('rafttextsurvival_save');
            return;
        }
        const serializedState = JSON.stringify(state);
        localStorage.setItem('rafttextsurvival_save', serializedState);
    } catch (err) {
        console.error("Kayıt edilirken hata oluştu:", err);
    }
};

// 3. ADIM: Kayıtlı veriyi al
const persistedState = loadState();

// 4. ADIM: Redux Mağazasını (Store) oluştur ve kayıtlı veriyi içine yükle
export const store = configureStore({
    reducer: {
        game: gameReducer,
    },
    preloadedState: persistedState // Oyun başlarken eski kaydı Redux'a enjekte eder
});

// 5. ADIM: Oyunda HERHANGİ BİR ŞEY değiştiğinde (tahta toplama, can azalması vs.) otomatik kaydet!
store.subscribe(() => {
    saveState({
        game: store.getState().game
    });
});