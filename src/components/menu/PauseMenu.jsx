import React from "react";
import { useDispatch } from "react-redux";
import { resumeGame, quitToMenu } from "../../store/gameSlice";
import { Play, Settings, Home } from "lucide-react";

const PauseMenu = () => {
    const dispatch = useDispatch();

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)', // YENİ: Oyunun üzerine yarı saydam siyah gölge
            zIndex: 1000, // Çantadan bile daha üstte görünsün diye 1000 verdik
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            backdropFilter: 'blur(3px)' // YENİ: Arkadaki oyunu hafifçe bulanıklaştırır (Çok şık durur)
        }}>

            {/* Ahşap Menü Kutusu */}
            <div style={{
                backgroundColor: '#2e1c14',
                padding: '35px',
                borderRadius: '12px',
                border: '3px solid #8b5a2b',
                boxShadow: '0 0 30px rgba(0,0,0,1)',
                width: '90%', maxWidth: '350px',
                textAlign: 'center'
            }}>

                <h2 style={{
                    color: '#d2b48c', marginTop: 0, marginBottom: '30px',
                    letterSpacing: '2px', textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
                }}>
                    OYUN DURDURULDU
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>

                    <button
                        onClick={() => dispatch(resumeGame())}
                        style={{
                            padding: '15px', backgroundColor: '#3e2723', color: '#4cd137',
                            border: '2px solid #5c3a21', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold',
                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                            transition: '0.2s'
                        }}
                    >
                        <Play size={20} /> Devam Et
                    </button>

                    <button
                        style={{
                            padding: '15px', backgroundColor: '#3e2723', color: '#aaa',
                            border: '2px solid #5c3a21', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold',
                            cursor: 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
                        }}
                    >
                        <Settings size={20} /> Ayarlar (Yakında)
                    </button>

                    <button
                        onClick={() => dispatch(quitToMenu())}
                        style={{
                            padding: '15px', backgroundColor: '#3e2723', color: '#ff4757',
                            border: '2px solid #5c3a21', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold',
                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
                        }}
                    >
                        <Home size={20} /> Ana Menüye Dön
                    </button>

                </div>
            </div>
        </div>
    );
};

export default PauseMenu;