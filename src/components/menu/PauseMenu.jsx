import React from "react";
import { useDispatch } from "react-redux";
import { resumeGame, quitToMenu } from "../../store/gameSlice";
import { Play, Settings, Home } from "lucide-react";

const PauseMenu = () => {
    const dispatch = useDispatch();

    return (
        <div style={{ maxWidth: '400px', margin: '100px auto', padding: '40px', backgroundColor: '#1a1a1a', borderRadius: '12px', textAlign: 'center', border: '2px solid #0fbcf9' }}>
            <h2 style={{ color: '#fff', fontSize: '32px', marginBottom: '30px' }}>OYUN DURDURULDU</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <button onClick={() => dispatch(resumeGame())} style={{ padding: '15px', backgroundColor: '#05c46b', color: '#000', border: 'none', borderRadius: '8px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' }}>
                    <Play size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} /> Devam Et
                </button>
                <button onClick={() => alert("Ayarlar yakında eklenecek")} style={{ padding: '15px', backgroundColor: '#2d2d2d', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' }}>
                    <Settings size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} /> Ayarlar
                </button>
                <button onClick={() => dispatch(quitToMenu())} style={{ padding: '15px', backgroundColor: '#ff4757', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' }}>
                    <Home size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} /> Ana Menüye Dön
                </button>
            </div>
        </div>
    );
};

export default PauseMenu;