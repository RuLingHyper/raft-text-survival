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

        // ÇOK ÖNEMLİ DETAY: 
        // Oyuncu sayfayı yenilediğinde (F5) direkt oyunun ortasında doğmasın, 
        // Ana Menü ekranını görsün diye oyunu durdurulmuş ve başlamamış olarak ayarlıyoruz.
        if (parsedState && parsedState.game) {
            parsedState.game.isGameStarted = false;
            parsedState.game.isGamePaused = false;
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