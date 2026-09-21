import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useBandage, drinkWater, eatFood, dropItem, swapInventorySlots, fillCup, startPurifying, startFishingMode, startCooking } from "../../store/gameSlice";
import { TreePine, Box, Leaf, Wrench, PlusSquare, Droplets, Utensils, Trash2, CheckCircle, Cpu, Battery, Radio, Fish, Coffee, Waves, Anchor, Sword, Compass } from "lucide-react";
import { playDrink, playEat, playClick } from "../../utils/soundEffects";

// ==========================================
// SABİT EŞYA ÖZELLİKLERİ (METADATA SÖZLÜĞÜ)
// ==========================================
const ITEM_META = {
    wood: { name: "Tahta", max: 50, icon: <TreePine size={24} /> },
    plastic: { name: "Plastik", max: 50, icon: <Box size={24} /> },
    leaf: { name: "Yaprak", max: 50, icon: <Leaf size={24} /> },
    metal: { name: "Metal", max: 50, icon: <Wrench size={24} /> },
    bandage: { name: "Bandaj", max: 10, icon: <PlusSquare size={24} />, isUsable: true, action: useBandage },

    water: { name: "Temiz Su", max: 20, icon: <Droplets size={24} />, isUsable: true, action: drinkWater },
    food: { name: "Pişmiş Balık", max: 20, icon: <Utensils size={24} />, isUsable: true, action: eatFood },
    fishing_rod: { name: "Olta", max: 1, icon: <Fish size={24} color="#ffb142" />, isUsable: true, action: startFishingMode },
    empty_cup: { name: "Boş Bardak", max: 5, icon: <Coffee size={24} color="#d2dae2" />, isUsable: true, action: fillCup },
    salt_water: { name: "Tuzlu Su", max: 5, icon: <Waves size={24} color="#34ace0" />, isUsable: true, action: startPurifying },
    raw_fish: { name: "Çiğ Balık", max: 10, icon: <Fish size={24} color="#ff5252" />, isUsable: true, action: startCooking },

    circuit_board: { name: "Devre Kartı", max: 1, icon: <Cpu size={24} color="#00d8d6" /> },
    military_battery: { name: "Askeri Batarya", max: 1, icon: <Battery size={24} color="#ffdd59" /> },
    signal_antenna: { name: "Sinyal Anteni", max: 1, icon: <Radio size={24} color="#ff3f34" /> },
};

// ==========================================
// SÜRÜKLENEBİLİR KUTU (SLOT) BİLEŞENİ
// ==========================================
const InventorySlot = ({ item, index, isSelected, onDragStart, onDrop, onDragOver, onSlotClick }) => {
    const isEmpty = !item;
    const hasItem = !isEmpty && item.count > 0;

    return (
        <div
            draggable={hasItem}
            onDragStart={(e) => onDragStart(e, index)}
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, index)}
            onClick={() => onSlotClick(index, item)}
            style={{
                backgroundColor: isSelected ? "rgba(253, 203, 110, 0.4)" : "rgba(139, 90, 43, 0.4)",
                border: isSelected ? "2px solid #fdcb6e" : "2px solid #5c3a21",
                borderRadius: "6px",
                aspectRatio: "1", position: "relative", display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                cursor: "pointer",
                color: "white", transition: "0.2s",
                boxShadow: isSelected ? "0 0 12px rgba(253, 203, 110, 0.8)" : item?.isUsable && hasItem ? "0 0 8px rgba(255, 71, 87, 0.5)" : "none",
                opacity: hasItem ? 1 : isSelected ? 0.8 : 0.25
            }}
        >
            {hasItem && (
                <>
                    {/* Sol Üst: Eşya İsmi */}
                    <div style={{ position: "absolute", top: "4px", left: "4px", fontSize: "10px", color: "#ddd", fontWeight: "bold", pointerEvents: 'none' }}>{item.name}</div>

                    {/* Sağ Üst: Kullanılabilir Etiketi */}
                    {item.isUsable && (
                        <div style={{ position: "absolute", top: "4px", right: "4px", fontSize: "9px", backgroundColor: "#ff4757", padding: "2px 4px", borderRadius: "3px", pointerEvents: 'none', fontWeight: 'bold' }}>Kullan</div>
                    )}

                    {/* Orta: İkon */}
                    <div style={{ marginTop: "10px", color: item?.isUsable ? "#ff4757" : "#fff", pointerEvents: 'none' }}>{item.icon}</div>

                    {/* Sağ Alt: Miktar */}
                    <div style={{ position: "absolute", bottom: "4px", right: "6px", fontSize: "12px", fontWeight: "bold", textShadow: "1px 1px 2px black", pointerEvents: 'none' }}>
                        {item.max ? `${item.count}/${item.max}` : item.count}
                    </div>
                </>
            )}
        </div>
    );
};

// ==========================================
// ANA ENVANTER BİLEŞENİ
// ==========================================
const InventoryDisplay = ({ inventory }) => {
    const dispatch = useDispatch();
    const equipment = useSelector((state) => state.game.equipment) || [];
    const isSoundEnabled = useSelector((state) => state.game.isSoundEnabled);
    const [activeSlotIndex, setActiveSlotIndex] = useState(null);
    const [swapSourceIndex, setSwapSourceIndex] = useState(null);
    const [dropAmount, setDropAmount] = useState(1);

    const handleDragStart = (e, index) => {
        e.dataTransfer.setData("slotIndex", index);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e, toIndex) => {
        const fromIndex = e.dataTransfer.getData("slotIndex");
        if (fromIndex !== "" && Number(fromIndex) !== toIndex) {
            dispatch(swapInventorySlots({ fromIndex: Number(fromIndex), toIndex }));
        }
    };

    const handleSlotClick = (index, itemProps) => {
        // Eğer taşıma modu aktifse
        if (swapSourceIndex !== null) {
            if (swapSourceIndex !== index) {
                dispatch(swapInventorySlots({ fromIndex: swapSourceIndex, toIndex: index }));
            }
            setSwapSourceIndex(null);
            return;
        }

        if (itemProps && itemProps.count > 0) {
            setDropAmount(1);
            setActiveSlotIndex(index);
        }
    };

    // Güncel aktif slot verisini doğrudan Redux inventory'den oku
    const activeSlot = activeSlotIndex !== null ? inventory[activeSlotIndex] : null;
    let activeItemProps = null;
    if (activeSlot) {
        const meta = ITEM_META[activeSlot.itemId];
        if (meta) activeItemProps = { ...meta, count: activeSlot.count, itemId: activeSlot.itemId };
    }

    return (
        <div style={{ padding: '5px' }}>
            {/* KUŞANILAN EKİPMANLAR & DAYANIKLILIK */}
            <div style={{
                backgroundColor: 'rgba(30, 20, 15, 0.6)',
                border: '1px solid #5c3a21',
                borderRadius: '6px',
                padding: '8px 10px',
                marginBottom: '10px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
            }}>
                <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#d2b48c', letterSpacing: '0.5px' }}>
                    🛡️ KUŞANILAN EKİPMANLAR
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {equipment.length === 0 ? (
                        <span style={{ fontSize: '11px', color: '#777', fontStyle: 'italic' }}>Kuşanılmış ekipman yok</span>
                    ) : (
                        equipment.map((eq) => {
                            const percent = Math.max(0, Math.round((eq.durability / eq.maxDurability) * 100));
                            const name = eq.itemId === 'hook' ? 'Kanca' : eq.itemId === 'spear' ? 'Mızrak' : eq.itemId === 'oar' ? 'Kürek' : eq.itemId;
                            const icon = eq.itemId === 'hook' ? <Anchor size={13} color="#d2b48c" /> : eq.itemId === 'spear' ? <Sword size={13} color="#ff6b81" /> : <Compass size={13} color="#4cd137" />;
                            const barColor = percent > 50 ? '#4cd137' : percent > 20 ? '#ffb142' : '#ff4757';

                            return (
                                <div key={eq.id || eq.itemId} style={{
                                    flex: '1 1 calc(33.3% - 6px)', minWidth: '90px',
                                    backgroundColor: '#1e130e', border: '1px solid #5c3a21', borderRadius: '4px',
                                    padding: '4px 6px', display: 'flex', flexDirection: 'column', gap: '3px'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', color: '#ddd' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>{icon} {name}</span>
                                        <span style={{ fontWeight: 'bold', color: barColor }}>%{percent}</span>
                                    </div>
                                    <div style={{ width: '100%', height: '4px', backgroundColor: '#33231b', borderRadius: '2px', overflow: 'hidden' }}>
                                        <div style={{ width: `${percent}%`, height: '100%', backgroundColor: barColor, transition: 'width 0.3s' }} />
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {swapSourceIndex !== null && (
                <div style={{
                    backgroundColor: '#e67e22', color: '#fff', padding: '8px',
                    borderRadius: '6px', marginBottom: '10px', fontSize: '13px',
                    textAlign: 'center', fontWeight: 'bold'
                }}>
                    🔄 Taşımak için hedef slota tıklayın (İptal etmek için seçili slota basın)
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
                {inventory.map((slot, index) => {
                    let itemProps = null;
                    if (slot !== null) {
                        const meta = ITEM_META[slot.itemId];
                        if (meta) itemProps = { ...meta, count: slot.count, itemId: slot.itemId };
                    }
                    return (
                        <InventorySlot
                            key={index} index={index} item={itemProps}
                            isSelected={swapSourceIndex === index}
                            onDragStart={handleDragStart} onDragOver={handleDragOver}
                            onDrop={handleDrop} onSlotClick={handleSlotClick}
                        />
                    );
                })}
            </div>

            {/* POPUP MENÜ */}
            {activeItemProps && (
                <div
                    onClick={() => setActiveSlotIndex(null)}
                    style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.85)', zIndex: 200,
                        display: 'flex', justifyContent: 'center', alignItems: 'center'
                    }}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            backgroundColor: '#2d2d2d', border: '2px solid #5c3a21', borderRadius: '8px',
                            padding: '20px', width: '85%', maxWidth: '300px',
                            display: 'flex', flexDirection: 'column', gap: '12px',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.9)'
                        }}
                    >
                        {/* 1. BAŞLIK */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '2px solid #5c3a21', paddingBottom: '15px', marginBottom: '5px' }}>
                            <div style={{ color: activeItemProps.isUsable ? '#ff4757' : '#d2b48c' }}>
                                {activeItemProps.icon}
                            </div>
                            <div>
                                <div style={{ color: '#fff', fontWeight: 'bold', fontSize: '16px' }}>{activeItemProps.name}</div>
                                <div style={{ color: '#aaa', fontSize: '12px' }}>Mevcut: {activeItemProps.count} adet</div>
                            </div>
                        </div>

                        {/* 2. KULLAN BUTONU */}
                        {activeItemProps.isUsable && (
                            <button
                                onClick={() => {
                                    if (activeItemProps.itemId === 'water' || activeItemProps.itemId === 'salt_water' || activeItemProps.itemId === 'empty_cup') {
                                        playDrink(isSoundEnabled);
                                    } else if (activeItemProps.itemId === 'food' || activeItemProps.itemId === 'raw_fish') {
                                        playEat(isSoundEnabled);
                                    } else {
                                        playClick(isSoundEnabled);
                                    }
                                    dispatch(activeItemProps.action());
                                    if (activeItemProps.count <= 1) {
                                        setActiveSlotIndex(null);
                                    }
                                }}
                                style={{ padding: '12px', backgroundColor: '#4cd137', color: '#111', border: 'none', borderRadius: '5px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
                            >
                                <CheckCircle size={18} /> 1 ADET KULLAN
                            </button>
                        )}

                        {/* 3. TAŞI BUTONU (Mobilde Kolay Yer Değiştirme) */}
                        <button
                            onClick={() => {
                                playClick(isSoundEnabled);
                                setSwapSourceIndex(activeSlotIndex);
                                setActiveSlotIndex(null);
                            }}
                            style={{ padding: '10px', backgroundColor: '#3e2723', color: '#d2b48c', border: '1px solid #5c3a21', borderRadius: '5px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}
                        >
                            📦 Başka Slota Taşı
                        </button>

                        {/* 4. MİKTAR SEÇİCİ */}
                        {activeItemProps.count > 1 && (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#1e1e1e', padding: '10px', borderRadius: '6px' }}>
                                <button
                                    onClick={() => setDropAmount(1)}
                                    style={{ padding: '6px 10px', backgroundColor: '#8b0000', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                                >
                                    MIN
                                </button>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <button
                                        onClick={() => setDropAmount(prev => Math.max(1, prev - 1))}
                                        style={{ backgroundColor: '#3e2723', color: '#d2b48c', border: '1px solid #5c3a21', width: '32px', height: '32px', borderRadius: '4px', fontSize: '20px', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}
                                    >-</button>

                                    <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '16px', minWidth: '24px', textAlign: 'center' }}>
                                        {Math.min(dropAmount, activeItemProps.count)}
                                    </span>

                                    <button
                                        onClick={() => setDropAmount(prev => Math.min(activeItemProps.count, prev + 1))}
                                        style={{ backgroundColor: '#3e2723', color: '#d2b48c', border: '1px solid #5c3a21', width: '32px', height: '32px', borderRadius: '4px', fontSize: '20px', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}
                                    >+</button>
                                </div>

                                <button
                                    onClick={() => setDropAmount(activeItemProps.count)}
                                    style={{ padding: '6px 10px', backgroundColor: '#8b0000', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                                >
                                    MAX
                                </button>
                            </div>
                        )}

                        {/* 5. YERE AT BUTONU */}
                        <button
                            onClick={() => {
                                const validAmount = Math.min(dropAmount, activeItemProps.count);
                                dispatch(dropItem({ slotIndex: activeSlotIndex, itemName: activeItemProps.name, amount: validAmount }));
                                if (validAmount >= activeItemProps.count) {
                                    setActiveSlotIndex(null);
                                } else {
                                    setDropAmount(1);
                                }
                            }}
                            style={{ padding: '12px', backgroundColor: '#e84118', color: '#fff', border: 'none', borderRadius: '5px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
                        >
                            <Trash2 size={18} /> {dropAmount >= activeItemProps.count ? "HEPSİNİ YERE AT" : `${dropAmount} ADET YERE AT`}
                        </button>

                        {/* 6. İPTAL BUTONU */}
                        <button
                            onClick={() => setActiveSlotIndex(null)}
                            style={{ padding: '10px', backgroundColor: 'transparent', color: '#aaa', border: '2px solid #555', borderRadius: '5px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}
                        >
                            Kapat
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InventoryDisplay;