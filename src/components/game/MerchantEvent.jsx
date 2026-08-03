import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { tradeWithMerchant } from '../../store/gameSlice';

const MerchantEvent = () => {
    const dispatch = useDispatch();
    // Redux'tan merchant bilgisini çekiyoruz
    const { merchant } = useSelector((state) => state.game);

    // Eğer martı aktif değilse ekranda hiçbir şey gösterme (Gizle)
    if (!merchant || !merchant.active) return null;

    // İngilizce kodları Türkçeye çevirmek için ufak bir sözlük
    const itemName = (item) => {
        if (item === 'plastic') return 'Plastik';
        if (item === 'leaf') return 'Yaprak';
        if (item === 'metal') return 'Metal';
        if (item === 'water') return 'Temiz Su';
        return item;
    };

    return (
        <div style={{
            backgroundColor: '#2e1c14', padding: '15px', borderRadius: '8px',
            border: '2px solid #fdcb6e', marginBottom: '15px',
            boxShadow: '0 0 15px rgba(253, 203, 110, 0.2)'
        }}>
            <p style={{ color: '#fdcb6e', margin: '0 0 10px 0', fontWeight: 'bold', fontSize: '16px' }}>
                🐦 Gezgin Martı Kondu!
            </p>

            <p style={{ color: '#aaa', fontSize: '14px', marginBottom: '15px', fontStyle: 'italic' }}>
                "{merchant.offer.costCount} adet {itemName(merchant.offer.costItem)} ver,
                sana {merchant.offer.rewardCount} adet {itemName(merchant.offer.rewardItem)} vereyim."
            </p>

            <div style={{ display: 'flex', gap: '10px' }}>
                <button
                    onClick={() => dispatch(tradeWithMerchant())}
                    style={{
                        flex: 1, padding: '10px', backgroundColor: '#fdcb6e', color: '#2e1c14',
                        border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer',
                        transition: '0.2s'
                    }}
                >
                    Takas Et
                </button>
            </div>

            <div style={{ marginTop: '10px', fontSize: '12px', color: '#ff6b81', textAlign: 'center' }}>
                ⏳ Kalan Süre: {merchant.timer} Tur
            </div>
        </div>
    );
};

export default MerchantEvent;