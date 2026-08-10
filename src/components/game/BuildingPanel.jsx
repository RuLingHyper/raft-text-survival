import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { debugGiveAllItems, buildNet, buildPurifier, buildGrill, craftBandage, craftSpear, craftOar, buildSOS, craftFishingRod, craftEmptyCup } from "../../store/gameSlice";
import { Grid, Droplets, Flame, PlusSquare, Utensils, Hammer, Sword, Compass, Radio, Fish, Coffee } from "lucide-react";

// ==========================================
// ALT BİLEŞENLER
// ==========================================
const CategoryBtn = ({ id, icon, currentCategory, setCategory }) => (
    <button
        onClick={() => setCategory(id)}
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

const CraftCard = ({ name, desc, icon, cost, onCraft, disabled, btnText }) => (
    <div style={{ backgroundColor: "rgba(139, 90, 43, 0.2)", border: "2px solid #5c3a21", borderRadius: "6px", padding: "10px", display: "flex", gap: "15px", alignItems: "center" }}>
        <div style={{ backgroundColor: "#3e2723", padding: "10px", borderRadius: "4px", color: '#d2b48c' }}>
            {icon}
        </div>
        <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 'bold', color: '#fff', fontSize: '15px' }}>{name}</div>
            <div style={{ color: '#aaa', fontSize: '12px', marginBottom: '5px' }}>{desc}</div>
            <div style={{ color: '#ffb142', fontSize: '11px', fontWeight: 'bold' }}>{cost}</div>
        </div>
        <button
            onClick={onCraft}
            disabled={disabled}
            style={{ padding: '10px', backgroundColor: disabled ? '#555' : '#4cd137', color: disabled ? '#888' : '#000', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: disabled ? 'not-allowed' : 'pointer' }}
        >
            {btnText || "Üret"}
        </button>
    </div>
);

// ==========================================
// ANA BİLEŞEN
// ==========================================
const BuildingPanel = ({ buildings }) => {
    const dispatch = useDispatch();
    const [category, setCategory] = useState("food");

    return (
        <div style={{ display: 'flex', gap: '15px', minHeight: '420px' }}>

            {/* SOL KISIM: Kategoriler */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderRight: '2px solid #5c3a21', paddingRight: '15px' }}>
                <CategoryBtn id="food" icon={<Utensils size={24} />} currentCategory={category} setCategory={setCategory} />
                <CategoryBtn id="tools" icon={<Hammer size={24} />} currentCategory={category} setCategory={setCategory} />
                <CategoryBtn id="weapons" icon={<Sword size={24} />} currentCategory={category} setCategory={setCategory} />
                <CategoryBtn id="medical" icon={<PlusSquare size={24} />} currentCategory={category} setCategory={setCategory} />

                {/* TEST BUTONU */}
                <button
                    onClick={() => dispatch(debugGiveAllItems())}
                    style={{ marginTop: '20px', padding: '10px', backgroundColor: 'purple', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                    TEST: EŞYA AL
                </button>
            </div>

            {/* SAĞ KISIM: Seçili Kategori İçeriği */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px', paddingRight: '5px' }}>

                {category === "food" && (
                    <>
                        <h3 style={{ margin: '0 0 10px 0', color: '#d2b48c', fontSize: '14px', borderBottom: '1px solid #5c3a21', paddingBottom: '5px' }}>YİYECEK & İÇECEK</h3>

                        <CraftCard
                            name="Su Arıtıcı" desc="Deniz suyunu içilebilir yapar." cost="6 Plastik, 2 Metal" icon={<Droplets size={24} />}
                            disabled={buildings.waterPurifier} btnText={buildings.waterPurifier ? "Kurulu" : "Kur"}
                            onCraft={() => dispatch(buildPurifier())}
                        />
                        <CraftCard
                            name="Pişirme Izgarası" desc="Balıkları tahta harcamadan pişirir." cost="5 Tahta, 2 Metal" icon={<Flame size={24} />}
                            disabled={buildings.grill} btnText={buildings.grill ? "Kurulu" : "Kur"}
                            onCraft={() => dispatch(buildGrill())}
                        />
                    </>
                )}

                {category === "tools" && (
                    <>
                        <h3 style={{ margin: '0 0 10px 0', color: '#d2b48c', fontSize: '14px', borderBottom: '1px solid #5c3a21', paddingBottom: '5px' }}>ARAÇ GEREÇLER</h3>

                        <CraftCard
                            name="Olta" desc="Denizden balık tutmanı sağlar." cost="4 Tahta, 2 Plastik" icon={<Fish size={24} />}
                            disabled={false} btnText="Üret"
                            onCraft={() => dispatch(craftFishingRod())}
                        />
                        <CraftCard
                            name="Boş Bardak" desc="Denizden su doldurmak için." cost="2 Plastik" icon={<Coffee size={24} />}
                            disabled={false} btnText="Üret"
                            onCraft={() => dispatch(craftEmptyCup())}
                        />
                        <CraftCard
                            name="Ahşap Kürek" desc="Açık denizlerde seyahat etmeni sağlar." cost="5 Tahta, 5 Plastik" icon={<Compass size={24} />}
                            disabled={false} btnText="Üret"
                            onCraft={() => dispatch(craftOar())}
                        />
                        <CraftCard
                            name="Toplama Ağı" desc="Suda yüzen eşyaları otomatik yakalar." cost="3 Tahta, 3 Plastik" icon={<Grid size={24} />}
                            disabled={false} btnText="Kur"
                            onCraft={() => dispatch(buildNet())}
                        />

                        <CraftCard
                            name="S.O.S İstasyonu" desc="Helikopteri çağırır ve oyunu bitirir!"
                            cost="1 Kart, 1 Batarya, 1 Anten, 15 Metal, 20 Plastik" icon={<Radio size={24} color="#ff3f34" />}
                            disabled={false} btnText="İNŞA ET VE KURTUL"
                            onCraft={() => dispatch(buildSOS())}
                        />
                    </>
                )}

                {category === "weapons" && (
                    <>
                        <h3 style={{ margin: '0 0 10px 0', color: '#d2b48c', fontSize: '14px', borderBottom: '1px solid #5c3a21', paddingBottom: '5px' }}>SİLAHLAR</h3>
                        <CraftCard
                            name="Tahta Mızrak" desc="Seni köpek balığı saldırılarından korur." cost="4 Tahta, 1 Metal" icon={<Sword size={24} />}
                            disabled={false} btnText="Üret"
                            onCraft={() => dispatch(craftSpear())}
                        />
                    </>
                )}

                {category === "medical" && (
                    <>
                        <h3 style={{ margin: '0 0 10px 0', color: '#d2b48c', fontSize: '14px', borderBottom: '1px solid #5c3a21', paddingBottom: '5px' }}>TIBBİ MALZEMELER</h3>
                        <CraftCard
                            name="Şifalı Bandaj" desc="Yaraları iyileştirir ve 25 Can verir." cost="3 Yaprak" icon={<PlusSquare size={24} />}
                            disabled={false} btnText="Üret"
                            onCraft={() => dispatch(craftBandage())}
                        />
                    </>
                )}

            </div>
        </div>
    );
};

export default BuildingPanel;