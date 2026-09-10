import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { tradeWithMerchant } from '../../store/gameSlice';
import { X, ArrowRight, Clock } from 'lucide-react';

const MerchantEvent = () => {
    const dispatch = useDispatch();
    const [isOpen, setIsOpen] = useState(false);
    const { merchant, inventory } = useSelector((state) => state.game);

    if (!merchant || !merchant.active) return null;

    const itemName = (item) => {
        if (item === 'plastic') return 'Plastik';
        if (item === 'leaf') return 'Yaprak';
        if (item === 'metal') return 'Metal';
        if (item === 'water') return 'Temiz Su';
        if (item === 'wood') return 'Tahta';
        return item;
    };

    const hasItemCount = (inventory || []).reduce((sum, slot) => {
        return slot && slot.itemId === merchant.offer.costItem ? sum + slot.count : sum;
    }, 0);

    const canTrade = hasItemCount >= merchant.offer.costCount;

    const handleTrade = () => {
        dispatch(tradeWithMerchant());
        setIsOpen(false);
    };

    return (
        <>
            {/* 1. SAĞDA YÜZEN KÜÇÜK ETKİNLİK KARE BUTONU (MOBİL OYUN ETKİNLİK İKONU) */}
            <div
                onClick={() => setIsOpen(true)}
                style={{
                    position: 'absolute',
                    top: '72px',
                    right: '16px',
                    zIndex: 40,
                    width: '54px',
                    height: '54px',
                    backgroundColor: '#2e1c14',
                    border: '2px solid #fdcb6e',
                    borderRadius: '10px',
                    boxShadow: '0 4px 15px rgba(253, 203, 110, 0.4)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    userSelect: 'none',
                    animation: 'floatPulse 2s infinite ease-in-out'
                }}
            >
                <span style={{ fontSize: '20px', lineHeight: 1 }}>🐦</span>
                <span style={{
                    fontSize: '9px',
                    fontWeight: 'bold',
                    color: '#fdcb6e',
                    marginTop: '2px',
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    padding: '1px 4px',
                    borderRadius: '3px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2px'
                }}>
                    <Clock size={8} /> {merchant.timer}
                </span>
            </div>

            {/* 2. BUTONA TIKLANDIĞINDA AÇILAN ŞIK TAKAS PENCERESİ */}
            {isOpen && (
                <div
                    onClick={() => setIsOpen(false)}
                    style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.8)', zIndex: 300,
                        display: 'flex', justifyContent: 'center', alignItems: 'center',
                        padding: '15px'
                    }}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            backgroundColor: '#2e1c14',
                            border: '2px solid #fdcb6e',
                            borderRadius: '10px',
                            padding: '20px',
                            width: '90%',
                            maxWidth: '320px',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.8)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '12px'
                        }}
                    >
                        {/* Başlık ve Kapat Butonu */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #5c3a21', paddingBottom: '8px' }}>
                            <div style={{ color: '#fdcb6e', fontWeight: 'bold', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span>🐦</span> Gezgin Martı Takası
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                style={{ background: 'none', border: 'none', color: '#ff4757', cursor: 'pointer', padding: 0 }}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Martı Diyaloğu */}
                        <p style={{ color: '#ddd', fontSize: '13px', margin: 0, fontStyle: 'italic', lineHeight: '1.4' }}>
                            "Salına bir martı kondu! Seninle hızlı bir takas yapmak istiyor."
                        </p>

                        {/* Takas Teklif Kutusu */}
                        <div style={{
                            backgroundColor: '#1e130e', border: '1px solid #5c3a21',
                            borderRadius: '8px', padding: '12px',
                            display: 'flex', alignItems: 'center', justifyContent: 'space-around'
                        }}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '11px', color: '#aaa' }}>Verilecek</div>
                                <div style={{ color: '#ffb142', fontWeight: 'bold', fontSize: '14px', marginTop: '2px' }}>
                                    {merchant.offer.costCount}x {itemName(merchant.offer.costItem)}
                                </div>
                            </div>

                            <ArrowRight size={18} color="#fdcb6e" />

                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '11px', color: '#aaa' }}>Alınacak</div>
                                <div style={{ color: '#4cd137', fontWeight: 'bold', fontSize: '14px', marginTop: '2px' }}>
                                    {merchant.offer.rewardCount}x {itemName(merchant.offer.rewardItem)}
                                </div>
                            </div>
                        </div>

                        {/* Malzeme Durumu */}
                        <div style={{
                            fontSize: '12px', fontWeight: 'bold', textAlign: 'center',
                            color: canTrade ? '#4cd137' : '#ff6b81'
                        }}>
                            Çantanda: {hasItemCount}/{merchant.offer.costCount} {itemName(merchant.offer.costItem)} {canTrade ? '✓ (Yeterli)' : '✗ (Yetersiz)'}
                        </div>

                        {/* Takas Butonu */}
                        <button
                            onClick={handleTrade}
                            disabled={!canTrade}
                            style={{
                                padding: '12px',
                                backgroundColor: canTrade ? '#fdcb6e' : '#33231b',
                                color: canTrade ? '#2e1c14' : '#777',
                                border: 'none', borderRadius: '6px', fontWeight: 'bold',
                                fontSize: '15px', cursor: canTrade ? 'pointer' : 'not-allowed',
                                transition: '0.2s', marginTop: '4px'
                            }}
                        >
                            {canTrade ? "Takası Kabul Et" : "Yeterli Malzemen Yok"}
                        </button>

                        <div style={{ fontSize: '11px', color: '#ff6b81', textAlign: 'center' }}>
                            ⏳ Kalan Süre: {merchant.timer} Tur sonra uçup gidecek
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default MerchantEvent;