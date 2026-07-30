import { configureStore } from "@reduxjs/toolkit";
import gameReducer from './gameSlice';

// 1. Tarayıcının hafızasından eski kaydı okuyan fonksiyon
const loadState = () => {
    try {
        const savedState = localStorage.getItem('survivalSaveData');
        if (savedState === null) return undefined; // Kayıt yoksa sıfırdan başla
        return JSON.parse(savedState);
    } catch (err) {
        return undefined;
    }
};

// 2. Hafızadaki güncel durumu tarayıcıya yazan fonksiyon
const savedState = (state) => {
    try {
        const stateToSave = JSON.stringify(state);
        localStorage.setItem('survivalSaveData', stateToSave);
    } catch (err) {
        //Hata durumunda yoksay
    }
};

// 3. Merkezi Hafıza (Store) Kurulumu
export const store = configureStore({
    reducer: {
        game: gameReducer
    },
    preloadedState: loadState() // Oyun açılırken ilk iş kaydı yükle
});

// 4. Herhangi bir değişiklik olduğunda (kanca atma, zaman geçmesi) otomatik kaydet
store.subscribe(() => {
    savedState(store.getState());
})