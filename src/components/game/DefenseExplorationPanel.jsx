import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { exploreIsland } from "../../store/gameSlice";
import { Map, ShieldAlert, ShieldCheck, Anchor, Wind, Tent, Layers } from "lucide-react";

const DefenseExplorationPanel = ({ hasSpear, hasOar }) => {
    const dispatch = useDispatch();
    const vitals = useSelector((state) => state.game.vitals) || { health: 100, hunger: 100, thirst: 100 };
    const buildings = useSelector((state) => state.game.buildings) || {};
    const equipment = useSelector((state) => state.game.equipment) || [];
    const oar = equipment.find(item => item.itemId === 'oar');
    const spear = equipment.find(item => item.itemId === 'spear');

    const energyCost = buildings.sail ? 12 : 25;
    const hasEnoughEnergy = vitals.hunger >= energyCost && vitals.thirst >= energyCost;
    const canExplore = hasOar && hasEnoughEnergy;

    const oarPercent = oar ? Math.max(0, Math.round((oar.durability / oar.maxDurability) * 100)) : 0;
    const oarBarColor = oarPercent > 50 ? '#4cd137' : oarPercent > 20 ? '#ffb142' : '#ff4757';

    const spearPercent = spear ? Math.max(0, Math.round((spear.durability / spear.maxDurability) * 100)) : 0;
    const spearBarColor = spearPercent > 50 ? '#4cd137' : spearPercent > 20 ? '#ffb142' : '#ff4757';

    return (
        <div>
            <h3 style={{ margin: '0 0 15px 0', color: '#d2b48c', fontSize: '16px', borderBottom: '1px solid #5c3a21', paddingBottom: '5px' }}>
                🗺️ DURUM & SEYAHAT
            </h3>

            {/* Durum Bilgi Kutuları */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                <div style={{ flex: 1, backgroundColor: "rgba(139, 90, 43, 0.2)", border: "2px solid #5c3a21", borderRadius: "6px", padding: "8px", textAlign: 'center' }}>
                    <div style={{ color: hasOar ? '#4cd137' : '#aaa', marginBottom: '4px', display: 'flex', justifyContent: 'center' }}>
                        <Anchor size={20} />
                    </div>
                    <div style={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}>Seyahat</div>
                    <div style={{ color: hasOar ? '#4cd137' : '#ffb142', fontSize: '11px', marginTop: '2px' }}>
                        {hasOar ? "Kürek Var" : "Sürükleniyor"}
                    </div>
                    {hasOar && oar && (
                        <div style={{ marginTop: '4px' }}>
                            <div style={{ width: '100%', height: '4px', backgroundColor: '#33231b', borderRadius: '2px', overflow: 'hidden', marginBottom: '2px' }}>
                                <div style={{ width: `${oarPercent}%`, height: '100%', backgroundColor: oarBarColor }} />
                            </div>
                            <span style={{ fontSize: '10px', color: oarBarColor, fontWeight: 'bold' }}>
                                %{oarPercent}
                            </span>
                        </div>
                    )}
                </div>

                <div style={{ flex: 1, backgroundColor: "rgba(139, 90, 43, 0.2)", border: "2px solid #5c3a21", borderRadius: "6px", padding: "8px", textAlign: 'center' }}>
                    <div style={{ color: hasSpear ? '#4cd137' : '#ff4757', marginBottom: '4px', display: 'flex', justifyContent: 'center' }}>
                        {hasSpear ? <ShieldCheck size={20} /> : <ShieldAlert size={20} />}
                    </div>
                    <div style={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}>Savunma</div>
                    <div style={{ color: hasSpear ? '#4cd137' : '#ff4757', fontSize: '11px', marginTop: '2px' }}>
                        {hasSpear ? "Mızrak Var" : "Savunmasız"}
                    </div>
                    {hasSpear && spear && (
                        <div style={{ marginTop: '4px' }}>
                            <div style={{ width: '100%', height: '4px', backgroundColor: '#33231b', borderRadius: '2px', overflow: 'hidden', marginBottom: '2px' }}>
                                <div style={{ width: `${spearPercent}%`, height: '100%', backgroundColor: spearBarColor }} />
                            </div>
                            <span style={{ fontSize: '10px', color: spearBarColor, fontWeight: 'bold' }}>
                                %{spearPercent}
                            </span>
                        </div>
                    )}
                </div>

                <div style={{ flex: 1, backgroundColor: "rgba(139, 90, 43, 0.2)", border: "2px solid #5c3a21", borderRadius: "6px", padding: "8px", textAlign: 'center' }}>
                    <div style={{ color: '#d2b48c', marginBottom: '4px', display: 'flex', justifyContent: 'center' }}>
                        <Layers size={20} />
                    </div>
                    <div style={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}>Sal Boyutu</div>
                    <div style={{ color: '#4cd137', fontSize: '11px', marginTop: '2px', fontWeight: 'bold' }}>
                        {buildings.raftSize || 4} Temel
                    </div>
                    <div style={{ fontSize: '10px', color: '#aaa', marginTop: '4px', display: 'flex', justifyContent: 'center', gap: '4px' }}>
                        {buildings.shelter ? <Tent size={12} color="#4cd137" title="Gölgelik Var" /> : null}
                        {buildings.sail ? <Wind size={12} color="#0fbcf9" title="Yelken Açık" /> : null}
                        {!buildings.shelter && !buildings.sail && <span>Standart</span>}
                    </div>
                </div>
            </div>

            {/* Keşif Kartı - Hero Section */}
            <div style={{ backgroundColor: "rgba(139, 90, 43, 0.3)", border: "2px solid #5c3a21", borderRadius: "6px", padding: "15px", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", textAlign: 'center' }}>
                <Map size={36} color="#0fbcf9" />
                <div>
                    <div style={{ fontWeight: 'bold', color: '#fff', fontSize: '16px' }}>Bilinmeyen Adayı Keşfet</div>
                    <div style={{ color: '#aaa', fontSize: '12px', marginTop: '4px' }}>Adada değerli kaynaklar ve kurtarma parçaları bulabilirsin.</div>
                    
                    {buildings.sail && (
                        <div style={{ color: '#0fbcf9', fontSize: '11px', fontWeight: 'bold', marginTop: '4px' }}>
                            ⛵ Yelken Etkin: Keşif Maliyeti %50 İndirimli!
                        </div>
                    )}

                    <div style={{
                        color: hasEnoughEnergy ? '#4cd137' : '#ff4757',
                        fontSize: '13px', fontWeight: 'bold', marginTop: '6px'
                    }}>
                        Maliyet: -{energyCost} Açlık (%{vitals.hunger}/{energyCost}) ve -{energyCost} Susuzluk (%{vitals.thirst}/{energyCost})
                    </div>
                </div>
                <button
                    onClick={() => dispatch(exploreIsland())}
                    disabled={!canExplore}
                    style={{
                        width: '100%', padding: '12px',
                        backgroundColor: canExplore ? '#0fbcf9' : '#33231b',
                        color: canExplore ? '#000' : '#777',
                        border: 'none', borderRadius: '4px', fontSize: '15px', fontWeight: 'bold',
                        cursor: canExplore ? 'pointer' : 'not-allowed', marginTop: '5px',
                        transition: '0.2s'
                    }}
                >
                    {!hasOar
                        ? "Önce Ahşap Kürek Üretmelisin"
                        : !hasEnoughEnergy
                            ? `Adaya Gidecek Gücün Yok (Min %${energyCost})`
                            : "Küreklere Asıl ve Keşfet!"}
                </button>
            </div>
        </div>
    );
};

export default DefenseExplorationPanel;