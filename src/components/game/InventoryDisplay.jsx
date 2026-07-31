import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useBandage, drinkWater, eatFood, dropItem, swapInventorySlots } from "../../store/gameSlice";
import { TreePine, Box, Leaf, Wrench, PlusSquare, Sword, Compass, Anchor, Droplets, Utensils, Trash2 } from "lucide-react";

// SÜRÜKLENEBİLİR (Draggable) KUTU BİLEŞENİ
const InventorySlot = ({ item, index, onDragStart, onDrop, onDragOver }) => {
    const dispatch = useDispatch();

    // Kutunun boş olup olmadığını kontrol ediyoruz
    const isEmpty = !item || item.empty;
    const hasItem = !isEmpty && item.count > 0;

    return (
        <div
            draggable={true} // HTML5 Sürükleme Özelliği
            onDragStart={(e) => onDragStart(e, index)}
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, index)}
            onClick={item?.isUsable && hasItem ? item.action : undefined}
            style={{
                backgroundColor: "rgba(139, 90, 43, 0.4)", border: "2px solid #5c3a21", borderRadius: "6px",
                aspectRatio: "1", position: "relative", display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                cursor: isEmpty ? "default" : (item?.isUsable && hasItem ? "pointer" : "grab"),
                color: "white", transition: "0.2s",
                boxShadow: item?.isUsable && hasItem ? "0 0 8px rgba(255, 71, 87, 0.5)" : "none",
                opacity: hasItem ? 1 : (isEmpty ? 0.2 : 0.4) // Boşsa iyice soluk
            }}
        >
            {/* Çöpe At Butonu */}
            {hasItem && item.itemKey && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        dispatch(dropItem({ itemKey: item.itemKey, itemName: item.name }));
                    }}
                    style={{
                        position: 'absolute', top: '4px', right: '4px',
                        background: 'rgba(0,0,0,0.6)', border: 'none', color: '#ff4757',
                        borderRadius: '4px', padding: '3px', cursor: 'pointer', zIndex: 10
                    }}
                    title="1 Adet At"
                >
                    <Trash2 size={12} />
                </button>
            )}

            {/* Eşya Varsa Bilgileri Çiz */}
            {!isEmpty && (
                <>
                    <div style={{ position: "absolute", top: "4px", left: "4px", fontSize: "10px", color: "#ddd", fontWeight: "bold", pointerEvents: 'none' }}>{item.name}</div>
                    <div style={{ marginTop: "10px", color: item.isUsable && hasItem ? "#ff4757" : "#fff", pointerEvents: 'none' }}>{item.icon}</div>

                    {hasItem && (
                        <div style={{ position: "absolute", bottom: "4px", right: "6px", fontSize: "12px", fontWeight: "bold", textShadow: "1px 1px 2px black", pointerEvents: 'none' }}>
                            {item.max ? `${item.count}/${item.max}` : item.count}
                        </div>
                    )}

                    {item.isUsable && hasItem && (
                        <div style={{ position: "absolute", bottom: "4px", left: "4px", fontSize: "9px", backgroundColor: "#ff4757", padding: "2px 4px", borderRadius: "3px", pointerEvents: 'none' }}>Kullan</div>
                    )}
                </>
            )}
        </div>
    );
};

const InventoryDisplay = ({ inventory }) => {
    const dispatch = useDispatch();
    const { equipment, inventoryOrder } = useSelector(state => state.game);

    const safeEquipment = Array.isArray(equipment) ? equipment : [];
    const hookCount = safeEquipment.filter(item => item.itemId === 'hook').length;
    const spearCount = safeEquipment.filter(item => item.itemId === 'spear').length;
    const oarCount = safeEquipment.filter(item => item.itemId === 'oar').length;

    // Eşyaların özelliklerini ve miktarlarını tanımladığımız sözlük
    const itemDefinitions = {
        wood: { name: "Tahta", count: inventory.wood, max: 50, itemKey: "wood", icon: <TreePine size={24} /> },
        plastic: { name: "Plastik", count: inventory.plastic, max: 50, itemKey: "plastic", icon: <Box size={24} /> },
        leaf: { name: "Yaprak", count: inventory.leaf, max: 50, itemKey: "leaf", icon: <Leaf size={24} /> },
        metal: { name: "Metal", count: inventory.metal, max: 50, itemKey: "metal", icon: <Wrench size={24} /> },
        water: { name: "Temiz Su", count: inventory.water, max: 20, itemKey: "water", icon: <Droplets size={24} />, isUsable: true, action: () => dispatch(drinkWater()) },
        food: { name: "Pişmiş Balık", count: inventory.food, max: 20, itemKey: "food", icon: <Utensils size={24} />, isUsable: true, action: () => dispatch(eatFood()) },
        bandage: { name: "Bandaj", count: inventory.bandage, max: 10, itemKey: "bandage", icon: <PlusSquare size={24} />, isUsable: true, action: () => dispatch(useBandage()) },
        hook: { name: "Kanca", count: hookCount, icon: <Anchor size={24} /> },
        spear: { name: "Mızrak", count: spearCount, icon: <Sword size={24} /> },
        oar: { name: "Kürek", count: oarCount, icon: <Compass size={24} /> },
        // Boş kutular
        empty_1: { empty: true }, empty_2: { empty: true }, empty_3: { empty: true }, empty_4: { empty: true }, empty_5: { empty: true }
    };

    // SÜRÜKLE BIRAK (DRAG & DROP) OLAYLARI
    const handleDragStart = (e, index) => {
        e.dataTransfer.setData("slotIndex", index); // Nereden sürüklendiğini aklında tut
    };

    const handleDragOver = (e) => {
        e.preventDefault(); // Sürüklenen eşyanın bırakılmasına izin ver
    };

    const handleDrop = (e, toIndex) => {
        const fromIndex = e.dataTransfer.getData("slotIndex");
        if (fromIndex !== "" && Number(fromIndex) !== toIndex) {
            // Redux'a yer değiştirme emrini gönder
            dispatch(swapInventorySlots({ fromIndex: Number(fromIndex), toIndex }));
        }
    };

    return (
        <div style={{ padding: '5px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>

                {/* Dizilimi Redux'tan (inventoryOrder) çekerek ekrana çiziyoruz */}
                {inventoryOrder.map((itemKey, index) => (
                    <InventorySlot
                        key={index}
                        index={index}
                        item={itemDefinitions[itemKey]}
                        onDragStart={handleDragStart}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                    />
                ))}

            </div>
        </div>
    );
};

export default InventoryDisplay;