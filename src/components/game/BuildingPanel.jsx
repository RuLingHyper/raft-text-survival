import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { buildNet, buildPurifier, buildGrill, craftBandage, craftSpear, craftOar, buildSOS, craftFishingRod, craftEmptyCup, buildFoundation, buildShelter, buildSail } from "../../store/gameSlice";
import { Grid, Droplets, Flame, PlusSquare, Utensils, Hammer, Sword, Compass, Radio, Fish, Coffee, Layers, Tent, Wind } from "lucide-react";
import { playCraft, playClick } from "../../utils/soundEffects";

// ==========================================
// ALT BİLEŞENLER
// ==========================================
const CategoryBtn = ({ id, icon, currentCategory, setCategory }) => {
    const isSoundEnabled = useSelector((state) => state.game.isSoundEnabled);
    return (
        <button
            onClick={() => {
                playClick(isSoundEnabled);
                setCategory(id);
            }}
            style={{
                width: '50px', height: '50px',
                backgroundColor: currentCategory === id ? '#8d6e63' : '#3e2723',
                border: '2px solid #5c3a21', borderRadius: '4px',
                color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
        >
            {icon}
        </button>
    );
};

const CraftCard = ({ name, desc, icon, costs, onCraft, isBuilt, btnText }) => {
    const isSoundEnabled = useSelector((state) => state.game.isSoundEnabled);
    // costs: [{ name: 'Tahta', count: 4, has: 10 }, ...]
    const canAfford = costs.every(c => c.has >= c.count);
    const disabled = isBuilt || !canAfford;

    const handleCraft = () => {
        if (disabled) return;
        playCraft(isSoundEnabled);
        onCraft();
    };

    return (
        <div style={{
            backgroundColor: "rgba(139, 90, 43, 0.2)",
            border: `2px solid ${isBuilt ? '#2ed573' : canAfford ? '#8b5a2b' : '#443026'}`,
            borderRadius: "6px", padding: "10px", display: "flex", gap: "12px", alignItems: "center",
            opacity: isBuilt ? 0.7 : 1
        }}>
            <div style={{ backgroundColor: "#3e2723", padding: "10px", borderRadius: "4px", color: '#d2b48c' }}>
                {icon}
            </div>
            <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'bold', color: '#fff', fontSize: '15px' }}>{name}</div>
                <div style={{ color: '#aaa', fontSize: '12px', marginBottom: '6px' }}>{desc}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {costs.map((c, i) => {
                        const satisfied = c.has >= c.count;
                        return (
                            <span key={i} style={{
                                fontSize: '11px', fontWeight: 'bold',
                                color: satisfied ? '#4cd137' : '#ff6b81',
                                backgroundColor: satisfied ? 'rgba(76, 209, 55, 0.1)' : 'rgba(255, 107, 129, 0.1)',
                                padding: '2px 5px', borderRadius: '3px'
                            }}>
                                {c.name}: {c.has}/{c.count} {satisfied ? '✓' : '✗'}
                            </span>
                        );
                    })}
                </div>
            </div>
            <button
                onClick={handleCraft}
                disabled={disabled}
                style={{
                    padding: '10px 14px',
                    backgroundColor: isBuilt ? '#2f3542' : canAfford ? '#4cd137' : '#33231b',
                    color: isBuilt ? '#747d8c' : canAfford ? '#111' : '#777',
                    border: 'none', borderRadius: '4px', fontWeight: 'bold',
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    whiteSpace: 'nowrap', transition: '0.2s'
                }}
            >
                {isBuilt ? "Kurulu" : btnText || "Üret"}
            </button>
        </div>
    );
};

// ==========================================
// ANA BİLEŞEN
// ==========================================
const BuildingPanel = ({ buildings }) => {
    const dispatch = useDispatch();
    const inventory = useSelector((state) => state.game.inventory) || [];
    const [category, setCategory] = useState("food");

    const getCount = (itemId) => {
        return inventory.reduce((sum, slot) => {
            return slot && slot.itemId === itemId ? sum + slot.count : sum;
        }, 0);
    };

    const countWood = getCount('wood');
    const countPlastic = getCount('plastic');
    const countLeaf = getCount('leaf');
    const countMetal = getCount('metal');
    const countCircuit = getCount('circuit_board');
    const countBattery = getCount('military_battery');
    const countAntenna = getCount('signal_antenna');

    return (
        <div style={{ display: 'flex', gap: '12px', height: '100%', minHeight: 0, overflow: 'hidden' }}>

            {/* SOL KISIM: Kategoriler (Sabit Yan Menü - Asla Kaymaz) */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                borderRight: '2px solid #5c3a21',
                paddingRight: '12px',
                flexShrink: 0
            }}>
                <CategoryBtn id="food" icon={<Utensils size={24} />} currentCategory={category} setCategory={setCategory} />
                <CategoryBtn id="tools" icon={<Hammer size={24} />} currentCategory={category} setCategory={setCategory} />
                <CategoryBtn id="structures" icon={<Layers size={24} />} currentCategory={category} setCategory={setCategory} />
                <CategoryBtn id="weapons" icon={<Sword size={24} />} currentCategory={category} setCategory={setCategory} />
                <CategoryBtn id="medical" icon={<PlusSquare size={24} />} currentCategory={category} setCategory={setCategory} />
            </div>

            {/* SAĞ KISIM: Başlık ve Sadece Ürünlerin Kaydırılabilir Olduğu Alan */}
            <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                minHeight: 0,
                overflow: 'hidden'
            }}>
                {/* Sabit Kategori Başlığı */}
                <h3 style={{
                    margin: '0 0 10px 0',
                    color: '#d2b48c',
                    fontSize: '14px',
                    borderBottom: '1px solid #5c3a21',
                    paddingBottom: '5px',
                    flexShrink: 0
                }}>
                    {category === "food" && "YİYECEK & İÇECEK"}
                    {category === "tools" && "ARAÇ GEREÇLER"}
                    {category === "structures" && "YAPILAR & İNŞAAT"}
                    {category === "weapons" && "SİLAHLAR"}
                    {category === "medical" && "TIBBİ MALZEMELER"}
                </h3>

                {/* Sadece Ürünlerin Olduğu Kaydırılabilir Liste */}
                <div style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    paddingRight: '4px',
                    overflowY: 'auto',
                    minHeight: 0
                }}>
                    {category === "food" && (
                        <>
                            <CraftCard
                                name="Su Arıtıcı" desc="Deniz suyunu içilebilir yapar."
                                costs={[
                                    { name: 'Plastik', count: 6, has: countPlastic },
                                    { name: 'Metal', count: 2, has: countMetal }
                                ]}
                                icon={<Droplets size={24} />}
                                isBuilt={buildings.waterPurifier}
                                btnText="Kur"
                                onCraft={() => dispatch(buildPurifier())}
                            />
                            <CraftCard
                                name="Pişirme Izgarası" desc="Balıkları tahta harcamadan pişirir."
                                costs={[
                                    { name: 'Tahta', count: 5, has: countWood },
                                    { name: 'Metal', count: 2, has: countMetal }
                                ]}
                                icon={<Flame size={24} />}
                                isBuilt={buildings.grill}
                                btnText="Kur"
                                onCraft={() => dispatch(buildGrill())}
                            />
                        </>
                    )}

                    {category === "tools" && (
                        <>
                            <CraftCard
                                name="Olta" desc="Denizden balık tutmanı sağlar."
                                costs={[
                                    { name: 'Tahta', count: 4, has: countWood },
                                    { name: 'Plastik', count: 2, has: countPlastic }
                                ]}
                                icon={<Fish size={24} />}
                                btnText="Üret"
                                onCraft={() => dispatch(craftFishingRod())}
                            />
                            <CraftCard
                                name="Boş Bardak" desc="Denizden su doldurmak için."
                                costs={[
                                    { name: 'Plastik', count: 2, has: countPlastic }
                                ]}
                                icon={<Coffee size={24} />}
                                btnText="Üret"
                                onCraft={() => dispatch(craftEmptyCup())}
                            />
                            <CraftCard
                                name="Ahşap Kürek" desc="Açık denizlerde seyahat etmeni sağlar."
                                costs={[
                                    { name: 'Tahta', count: 5, has: countWood },
                                    { name: 'Plastik', count: 5, has: countPlastic }
                                ]}
                                icon={<Compass size={24} />}
                                btnText="Üret"
                                onCraft={() => dispatch(craftOar())}
                            />
                            <CraftCard
                                name="Toplama Ağı" desc="Suda yüzen eşyaları otomatik yakalar."
                                costs={[
                                    { name: 'Tahta', count: 3, has: countWood },
                                    { name: 'Plastik', count: 3, has: countPlastic }
                                ]}
                                icon={<Grid size={24} />}
                                btnText={`Kur (${buildings.collectionNet})`}
                                onCraft={() => dispatch(buildNet())}
                            />

                            <CraftCard
                                name="S.O.S İstasyonu" desc="Helikopteri çağırır ve oyunu bitirir!"
                                costs={[
                                    { name: 'Devre Kartı', count: 1, has: countCircuit },
                                    { name: 'Askeri Batarya', count: 1, has: countBattery },
                                    { name: 'Sinyal Anteni', count: 1, has: countAntenna },
                                    { name: 'Metal', count: 15, has: countMetal },
                                    { name: 'Plastik', count: 20, has: countPlastic }
                                ]}
                                icon={<Radio size={24} color="#ff3f34" />}
                                btnText="İNŞA ET VE KURTUL"
                                onCraft={() => dispatch(buildSOS())}
                            />
                        </>
                    )}

                    {category === "structures" && (
                        <>
                            <CraftCard
                                name={`Ahşap Temel (${buildings.raftSize || 4} Mevcut)`}
                                desc="Salını 1 kare genişletir ve köpek balığı saldırılarına karşı korur."
                                costs={[
                                    { name: 'Tahta', count: 4, has: countWood },
                                    { name: 'Plastik', count: 2, has: countPlastic }
                                ]}
                                icon={<Layers size={24} color="#d2b48c" />}
                                btnText="Genişlet"
                                onCraft={() => dispatch(buildFoundation())}
                            />
                            <CraftCard
                                name="Gölgelik (Çatı)"
                                desc="Fırtına dalgalarının salına hasar vermesini tamamen engeller."
                                costs={[
                                    { name: 'Tahta', count: 8, has: countWood },
                                    { name: 'Yaprak', count: 6, has: countLeaf }
                                ]}
                                icon={<Tent size={24} color="#4cd137" />}
                                isBuilt={buildings.shelter}
                                btnText="Kur"
                                onCraft={() => dispatch(buildShelter())}
                            />
                            <CraftCard
                                name="Ahşap Yelken"
                                desc="Ada keşif maliyetini yarıya düşürür (%50 indirim) ve nadir eşya bulma şansını artırır."
                                costs={[
                                    { name: 'Tahta', count: 6, has: countWood },
                                    { name: 'Yaprak', count: 8, has: countLeaf },
                                    { name: 'Plastik', count: 4, has: countPlastic }
                                ]}
                                icon={<Wind size={24} color="#0fbcf9" />}
                                isBuilt={buildings.sail}
                                btnText="Kur"
                                onCraft={() => dispatch(buildSail())}
                            />
                        </>
                    )}

                    {category === "weapons" && (
                        <>
                            <CraftCard
                                name="Tahta Mızrak" desc="Seni köpek balığı saldırılarından korur."
                                costs={[
                                    { name: 'Tahta', count: 4, has: countWood },
                                    { name: 'Metal', count: 1, has: countMetal }
                                ]}
                                icon={<Sword size={24} />}
                                btnText="Üret"
                                onCraft={() => dispatch(craftSpear())}
                            />
                        </>
                    )}

                    {category === "medical" && (
                        <>
                            <CraftCard
                                name="Şifalı Bandaj" desc="Yaraları iyileştirir ve 25 Can verir."
                                costs={[
                                    { name: 'Yaprak', count: 3, has: countLeaf }
                                ]}
                                icon={<PlusSquare size={24} />}
                                btnText="Üret"
                                onCraft={() => dispatch(craftBandage())}
                            />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BuildingPanel;