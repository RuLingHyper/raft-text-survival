import React from "react";
import { useDispatch } from "react-redux";
import { throwHook, gatherByHand, craftHook, craftBandage, boilWater, cookFish } from "../../store/gameSlice";
import { Anchor, Plus, Droplets, Fish } from "lucide-react";

const ActionPanel = ({ hasHook, buildings }) => {
    const dispatch = useDispatch();

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Kanca Butonu ve Üretim Alanı */}
            <div style={{ display: 'flex', gap: '12px' }}>
                <button
                    onClick={() => dispatch(throwHook())}
                    disabled={!hasHook}
                    style={{ flex: hasHook ? '1' : '0.4', padding: '18px', backgroundColor: hasHook ? '#2ed573' : '#333', color: hasHook ? '#000' : '#555', border: 'none', borderRadius: '8px', fontSize: '18px', fontWeight: 'bold', cursor: hasHook ? 'pointer' : 'not-allowed', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}
                >
                    <Anchor size={24} /> {hasHook ? "Kancayı Fırlat" : "Kancan Kırıldı!"}
                </button>

                {!hasHook && (
                    <>
                        <button onClick={() => dispatch(gatherByHand())} style={{ flex: '0.3', padding: '15px', backgroundColor: '#ffa502', color: '#000', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                            Denize Uzan<br />(-10 Açlık)
                        </button>
                        <button onClick={() => dispatch(craftHook())} style={{ flex: '0.3', padding: '15px', backgroundColor: '#0fbcf9', color: '#000', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                            Kanca Üret<br />(2T, 2P)
                        </button>
                    </>
                )}
            </div>

            {/* Hayatta Kalma Butonları */}
            <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={() => dispatch(craftBandage())} style={{ flex: 1, padding: '15px', backgroundColor: '#ff4757', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px' }}>
                    <Plus size={18} /> Bandaj (3 Yaprak)
                </button>
                <button onClick={() => dispatch(boilWater())} style={{ flex: 1, padding: '15px', backgroundColor: '#1e90ff', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px', textAlign: 'center' }}>
                    <Droplets size={18} /> {buildings.waterPurifier ? "Su İç\n(Bedava)" : "Su Kaynat\n(1 Tahta)"}
                </button>
                <button onClick={() => dispatch(cookFish())} style={{ flex: 1, padding: '15px', backgroundColor: '#ffa502', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px', textAlign: 'center' }}>
                    <Fish size={18} /> {buildings.grill ? "Balık Pişir\n(1 Plastik)" : "Balık Pişir\n(1T, 1P)"}
                </button>
            </div>
        </div>
    );
};

export default ActionPanel;