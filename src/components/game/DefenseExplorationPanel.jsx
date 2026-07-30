import React from "react";
import { useDispatch } from "react-redux";
import { craftSpear, craftOar, exploreIsland } from "../../store/gameSlice";
import { Sword, Compass, Map } from "lucide-react";

const DefenseExplorationPanel = ({ hasSpear, hasOar }) => {
    const dispatch = useDispatch();

    return (
        <>
            {/* Savunma */}
            <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#301b1b', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #ff4757' }}>
                <div>
                    <span style={{ color: '#888', display: 'block', marginBottom: '5px', fontSize: '14px' }}>Savunma</span>
                    <strong style={{ fontSize: '20px', color: hasSpear ? '#2ed573' : '#ff4757' }}>
                        {hasSpear ? "Mızrak Kuşanıldı" : "Savunmasız!"}
                    </strong>
                </div>
                <button
                    onClick={() => dispatch(craftSpear())}
                    disabled={hasSpear}
                    style={{ padding: '10px 15px', backgroundColor: hasSpear ? '#555' : '#ff4757', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', cursor: hasSpear ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
                >
                    <Sword size={16} /> Mızrak Üret (4 Tahta, 1 Metal)
                </button>
            </div>

            {/* Seyahat ve Keşif */}
            <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#1e272e', borderRadius: '8px', border: '1px solid #0fbcf9' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <div>
                        <span style={{ color: '#888', display: 'block', marginBottom: '5px', fontSize: '14px' }}>Seyahat Durumu</span>
                        <strong style={{ fontSize: '20px', color: hasOar ? '#0fbcf9' : '#888' }}>
                            {hasOar ? "Kürek Hazır" : "Sürükleniyor..."}
                        </strong>
                    </div>
                    <button
                        onClick={() => dispatch(craftOar())}
                        disabled={hasOar}
                        style={{ padding: '10px 15px', backgroundColor: hasOar ? '#555' : '#0fbcf9', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', cursor: hasOar ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
                    >
                        <Compass size={16} /> Kürek Üret (5 Tahta, 5 Plastik)
                    </button>
                </div>
                <button
                    onClick={() => dispatch(exploreIsland())}
                    disabled={!hasOar}
                    style={{ width: '100%', padding: '12px', backgroundColor: hasOar ? '#05c46b' : '#333', color: hasOar ? '#000' : '#555', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: hasOar ? 'pointer' : 'not-allowed', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', transition: '0.2s' }}
                >
                    <Map size={20} /> Adayı Keşfet (-25 Açlık ve Susuzluk)
                </button>
            </div>
        </>
    );
};

export default DefenseExplorationPanel;