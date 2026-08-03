import React from "react";
import { useDispatch } from "react-redux";
import { exploreIsland } from "../../store/gameSlice";
import { Map, ShieldAlert, ShieldCheck, Anchor } from "lucide-react";

const DefenseExplorationPanel = ({ hasSpear, hasOar }) => {
    const dispatch = useDispatch();

    return (
        <div>
            <h3 style={{ margin: '0 0 15px 0', color: '#d2b48c', fontSize: '16px', borderBottom: '1px solid #5c3a21', paddingBottom: '5px' }}>
                🗺️ DURUM & SEYAHAT
            </h3>

            {/* Durum Bilgi Kutuları */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                <div style={{ flex: 1, backgroundColor: "rgba(139, 90, 43, 0.2)", border: "2px solid #5c3a21", borderRadius: "6px", padding: "10px", textAlign: 'center' }}>
                    <div style={{ color: hasOar ? '#4cd137' : '#aaa', marginBottom: '5px', display: 'flex', justifyContent: 'center' }}>
                        <Anchor size={24} />
                    </div>
                    <div style={{ color: '#fff', fontSize: '13px', fontWeight: 'bold' }}>Seyahat Durumu</div>
                    <div style={{ color: hasOar ? '#4cd137' : '#ffb142', fontSize: '11px', marginTop: '3px' }}>
                        {hasOar ? "Kürek Çantanda" : "Sürükleniyor..."}
                    </div>
                </div>

                <div style={{ flex: 1, backgroundColor: "rgba(139, 90, 43, 0.2)", border: "2px solid #5c3a21", borderRadius: "6px", padding: "10px", textAlign: 'center' }}>
                    <div style={{ color: hasSpear ? '#4cd137' : '#ff4757', marginBottom: '5px', display: 'flex', justifyContent: 'center' }}>
                        {hasSpear ? <ShieldCheck size={24} /> : <ShieldAlert size={24} />}
                    </div>
                    <div style={{ color: '#fff', fontSize: '13px', fontWeight: 'bold' }}>Savunma</div>
                    <div style={{ color: hasSpear ? '#4cd137' : '#ff4757', fontSize: '11px', marginTop: '3px' }}>
                        {hasSpear ? "Mızrak Kuşanıldı" : "Savunmasız!"}
                    </div>
                </div>
            </div>

            {/* Keşif Kartı - Hero Section */}
            <div style={{ backgroundColor: "rgba(139, 90, 43, 0.3)", border: "2px solid #5c3a21", borderRadius: "6px", padding: "15px", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", textAlign: 'center' }}>
                <Map size={36} color="#0fbcf9" />
                <div>
                    <div style={{ fontWeight: 'bold', color: '#fff', fontSize: '16px' }}>Bilinmeyen Adayı Keşfet</div>
                    <div style={{ color: '#aaa', fontSize: '12px', marginTop: '4px' }}>Adada değerli kaynaklar bulabilirsin. Ancak bu yolculuk seni çok yoracak.</div>
                    <div style={{ color: '#ff4757', fontSize: '13px', fontWeight: 'bold', marginTop: '6px' }}>Maliyet: -25 Açlık ve Susuzluk</div>
                </div>
                <button
                    onClick={() => dispatch(exploreIsland())}
                    disabled={!hasOar}
                    style={{ width: '100%', padding: '12px', backgroundColor: hasOar ? '#0fbcf9' : '#333', color: hasOar ? '#000' : '#888', border: 'none', borderRadius: '4px', fontSize: '16px', fontWeight: 'bold', cursor: hasOar ? 'pointer' : 'not-allowed', marginTop: '5px' }}
                >
                    {hasOar ? "Küreklere Asıl ve Keşfet!" : "Önce Çantana Kürek Almalısın"}
                </button>
            </div>
        </div>
    );
};

export default DefenseExplorationPanel;