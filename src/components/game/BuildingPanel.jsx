import React from "react";
import { useDispatch } from "react-redux";
import { buildNet, buildPurifier, buildGrill } from "../../store/gameSlice";
import { Grid, Droplets, Flame } from "lucide-react";

const BuildingPanel = ({ buildings }) => {
    const dispatch = useDispatch();

    return (
        <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#2d2d2d', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '15px' }}>

            {/* Ağ Kurulumu */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <span style={{ color: '#888', display: 'block', marginBottom: '5px', fontSize: '14px' }}>Toplama Ağları</span>
                    <strong style={{ fontSize: '18px', color: '#2ed573' }}>{buildings.collectionNet} Adet</strong>
                </div>
                <button onClick={() => dispatch(buildNet())}
                    style={{ padding: '10px 15px', backgroundColor: '#9b59b6', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }} >
                    <Grid size={16} /> Ağ Kur (3 Tahta, 3 Plastik)
                </button>
            </div>

            {/* Su Arıtıcı */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #444', paddingTop: '15px' }}>
                <div>
                    <span style={{ color: '#888', display: 'block', marginBottom: '5px', fontSize: '14px' }}>Su Arıtıcı</span>
                    <strong style={{ fontSize: '16px', color: buildings.waterPurifier ? '#1e90ff' : '#555' }}>
                        {buildings.waterPurifier ? "Aktif (Bedava Su)" : "Yok"}
                    </strong>
                </div>
                <button onClick={() => dispatch(buildPurifier())} disabled={buildings.waterPurifier}
                    style={{ padding: '10px 15px', backgroundColor: buildings.waterPurifier ? '#555' : '#1e90ff', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', cursor: buildings.waterPurifier ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }} >
                    <Droplets size={16} /> Arıtıcı Kur (6 Plastik, 2 Metal)
                </button>
            </div>

            {/* Izgara */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #444', paddingTop: '15px' }}>
                <div>
                    <span style={{ color: '#888', display: 'block', marginBottom: '5px', fontSize: '14px' }}>Pişirme Izgarası</span>
                    <strong style={{ fontSize: '16px', color: buildings.grill ? '#ffa502' : '#555' }}>
                        {buildings.grill ? "Aktif (Bedava Ateş)" : "Yok"}
                    </strong>
                </div>
                <button onClick={() => dispatch(buildGrill())} disabled={buildings.grill}
                    style={{ padding: '10px 15px', backgroundColor: buildings.grill ? '#555' : '#ffa502', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', cursor: buildings.grill ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }} >
                    <Flame size={16} /> Izgara Kur (5 Tahta, 2 Metal)
                </button>
            </div>
        </div>
    );
};

export default BuildingPanel;