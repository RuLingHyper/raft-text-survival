import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useBandage, drinkWater, eatFood, dropItem, swapInventorySlots, fillCup, startPurifying, startFishingMode, startCooking } from "../../store/gameSlice";
import { TreePine, Box, Leaf, Wrench, PlusSquare, Droplets, Utensils, Trash2, CheckCircle, Cpu, Battery, Radio, Fish, Coffee, Waves } from "lucide-react";

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
    empty_cup: { name: "Boş Bardak", max: 1, icon: <Coffee size={24} color="#d2dae2" />, isUsable: true, action: fillCup },
    salt_water: { name: "Tuzlu Su", max: 1, icon: <Waves size={24} color="#34ace0" />, isUsable: true, action: startPurifying },
    raw_fish: { name: "Çiğ Balık", max: 10, icon: <Fish size={24} color="#ff5252" />, isUsable: true, action: startCooking },

    circuit_board: { name: "Devre Kartı", max: 1, icon: <Cpu size={24} color="#00d8d6" /> },
    military_battery: { name: "Askeri Batarya", max: 1, icon: <Battery size={24} color="#ffdd59" /> },
    signal_antenna: { name: "Sinyal Anteni", max: 1, icon: <Radio size={24} color="#ff3f34" /> },
};

// ==========================================
// SÜRÜKLENEBİLİR KUTU (SLOT) BİLEŞENİ
// ==========================================
const InventorySlot = ({ item, index, onDragStart, onDrop, onDragOver, onSlotClick }) => {
    const isEmpty = !item;
    const hasItem = !isEmpty && item.count > 0;

    return (
        <div
            draggable={hasItem}
            onDragStart={(e) => onDragStart(e, index)}
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, index)}
            onClick={() => {
                if (hasItem) onSlotClick(index, item);
            }}
            style={{
                backgroundColor: "rgba(139, 90, 43, 0.4)", border: "2px solid #5c3a21", borderRadius: "6px",
                aspectRatio: "1", position: "relative", display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                cursor: hasItem ? "pointer" : "default",
                color: "white", transition: "0.2s",
                boxShadow: item?.isUsable && hasItem ? "0 0 8px rgba(255, 71, 87, 0.5)" : "none",
                opacity: hasItem ? 1 : 0.2
            }}
        >
            {hasItem && (
                <>
                    {/* Sol Üst: Eşya İsmi */}
                    <div style={{ position: "absolute", top: "4px", left: "4px", fontSize: "10px", color: "#ddd", fontWeight: "bold", pointerEvents: 'none' }}>{item.name}</div>

                    {/* YENİ - Sağ Üst: Kullanılabilir Etiketi (Çöp kutusunun eski yerine aldık ve şıklaştırdık) */}
                    {item.isUsable && (
                        <div style={{ position: "absolute", top: "4px", right: "4px", fontSize: "9px", backgroundColor: "#ff4757", padding: "2px 4px", borderRadius: "3px", pointerEvents: 'none', fontWeight: 'bold' }}>Kullan</div>
                    )}

                    {/* Orta: İkon */}
                    <div style={{ marginTop: "10px", color: item?.isUsable ? "#ff4757" : "#fff", pointerEvents: 'none' }}>{item.icon}</div>

                    {/* Sağ Alt: Miktar (Artık üstüne hiçbir şey binmeyecek, tamamen rahat) */}
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
    const [activeActionMenu, setActiveActionMenu] = useState(null);

    // YENİ: Atılacak eşya miktarını tutan state
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
        setDropAmount(1); // Menü her açıldığında miktarı varsayılan olarak 1'e sıfırla
        setActiveActionMenu({ index, item: itemProps });
    };

    return (
        <div style={{ padding: '5px' }}>
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
                            onDragStart={handleDragStart} onDragOver={handleDragOver}
                            onDrop={handleDrop} onSlotClick={handleSlotClick}
                        />
                    );
                })}
            </div>

            {/* POPUP MENÜ */}
            {activeActionMenu && (
                <div
                    onClick={() => setActiveActionMenu(null)}
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
                            padding: '20px', width: '80%', maxWidth: '280px',
                            display: 'flex', flexDirection: 'column', gap: '12px',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.9)'
                        }}
                    >
                        {/* 1. BAŞLIK */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '2px solid #5c3a21', paddingBottom: '15px', marginBottom: '5px' }}>
                            <div style={{ color: activeActionMenu.item.isUsable ? '#ff4757' : '#d2b48c' }}>
                                {activeActionMenu.item.icon}
                            </div>
                            <div>
                                <div style={{ color: '#fff', fontWeight: 'bold', fontSize: '16px' }}>{activeActionMenu.item.name}</div>
                                <div style={{ color: '#aaa', fontSize: '12px' }}>Mevcut: {activeActionMenu.item.count} adet</div>
                            </div>
                        </div>

                        {/* 2. KULLAN BUTONU (EN ÜSTE ALINDI) */}
                        {activeActionMenu.item.isUsable && (
                            <button
                                onClick={() => {
                                    dispatch(activeActionMenu.item.action());
                                    if (activeActionMenu.item.count <= 1) setActiveActionMenu(null);
                                    else {
                                        setActiveActionMenu(prev => ({ ...prev, item: { ...prev.item, count: prev.item.count - 1 } }));
                                        setDropAmount(prev => Math.min(prev, activeActionMenu.item.count - 1));
                                    }
                                }}
                                style={{ padding: '12px', backgroundColor: '#4cd137', color: '#111', border: 'none', borderRadius: '5px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
                            >
                                <CheckCircle size={18} /> 1 ADET KULLAN
                            </button>
                        )}

                        {/* 3. MİKTAR SEÇİCİ (YERE AT BUTONUNUN ÜSTÜNE ALINDI) */}
                        {activeActionMenu.item.count > 1 && (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#1e1e1e', padding: '10px', borderRadius: '6px', marginTop: '10px' }}>

                                {/* YENİ: MIN BUTONU (Sola eklendi) */}
                                <button
                                    onClick={() => setDropAmount(1)}
                                    style={{ padding: '8px 12px', backgroundColor: '#8b0000', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                                >
                                    MIN
                                </button>

                                {/* ORTA KISIM: - SAYI + */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <button
                                        onClick={() => setDropAmount(prev => Math.max(1, prev - 1))}
                                        style={{ backgroundColor: '#3e2723', color: '#d2b48c', border: '1px solid #5c3a21', width: '32px', height: '32px', borderRadius: '4px', fontSize: '20px', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}
                                    >-</button>

                                    <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '16px', minWidth: '24px', textAlign: 'center' }}>
                                        {dropAmount}
                                    </span>

                                    <button
                                        onClick={() => setDropAmount(prev => Math.min(activeActionMenu.item.count, prev + 1))}
                                        style={{ backgroundColor: '#3e2723', color: '#d2b48c', border: '1px solid #5c3a21', width: '32px', height: '32px', borderRadius: '4px', fontSize: '20px', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}
                                    >+</button>
                                </div>

                                {/* SAĞ KISIM: MAX BUTONU */}
                                <button
                                    onClick={() => setDropAmount(activeActionMenu.item.count)}
                                    style={{ padding: '8px 12px', backgroundColor: '#8b0000', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                                >
                                    MAX
                                </button>
                            </div>
                        )}

                        {/* 4. YERE AT BUTONU */}
                        <button
                            onClick={() => {
                                dispatch(dropItem({ slotIndex: activeActionMenu.index, itemName: activeActionMenu.item.name, amount: dropAmount }));

                                if (dropAmount >= activeActionMenu.item.count) {
                                    setActiveActionMenu(null);
                                } else {
                                    setActiveActionMenu(prev => ({ ...prev, item: { ...prev.item, count: prev.item.count - dropAmount } }));
                                    setDropAmount(1);
                                }
                            }}
                            style={{ padding: '12px', backgroundColor: '#e84118', color: '#fff', border: 'none', borderRadius: '5px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
                        >
                            <Trash2 size={18} /> {dropAmount === activeActionMenu.item.count ? "HEPSİNİ YERE AT" : `${dropAmount} ADET YERE AT`}
                        </button>

                        {/* 5. İPTAL BUTONU */}
                        <button
                            onClick={() => setActiveActionMenu(null)}
                            style={{ padding: '12px', backgroundColor: 'transparent', color: '#aaa', border: '2px solid #555', borderRadius: '5px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer', marginTop: '5px' }}
                        >
                            İptal
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InventoryDisplay;