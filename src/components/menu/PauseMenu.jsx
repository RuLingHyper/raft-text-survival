import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resumeGame, quitToMenu, toggleSound } from "../../store/gameSlice";
import { Play, Settings, Home, Volume2, VolumeX, X } from "lucide-react";
import { playClick } from "../../utils/soundEffects";

const PauseMenu = () => {
    const dispatch = useDispatch();
    const isSoundEnabled = useSelector((state) => state.game.isSoundEnabled);
    const [showSettings, setShowSettings] = useState(false);

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            zIndex: 1000,
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            backdropFilter: 'blur(3px)'
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
                        onClick={() => {
                            playClick(isSoundEnabled);
                            dispatch(resumeGame());
                        }}
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
                        onClick={() => {
                            playClick(isSoundEnabled);
                            setShowSettings(true);
                        }}
                        style={{
                            padding: '15px', backgroundColor: '#3e2723', color: '#d2b48c',
                            border: '2px solid #5c3a21', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold',
                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
                        }}
                    >
                        <Settings size={20} /> Ayarlar
                    </button>

                    <button
                        onClick={() => {
                            playClick(isSoundEnabled);
                            dispatch(quitToMenu());
                        }}
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

            {/* AYARLAR PENCERESİ */}
            {showSettings && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.85)', zIndex: 1100,
                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                    padding: '20px', backdropFilter: 'blur(4px)'
                }}>
                    <div style={{
                        backgroundColor: '#2e1c14', padding: '30px', borderRadius: '12px',
                        border: '3px solid #5c3a21', boxShadow: '0 0 30px rgba(0,0,0,0.8)',
                        width: '100%', maxWidth: '350px', textAlign: 'center'
                    }}>
                        <Settings size={50} color="#d2b48c" style={{ marginBottom: '15px' }} />
                        <h2 style={{ color: '#fff', fontSize: '22px', margin: '0 0 15px 0' }}>Oyun Ayarları</h2>

                        <div style={{ backgroundColor: '#22150f', padding: '15px', borderRadius: '8px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #332014' }}>
                            <span style={{ color: '#aaa', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                {isSoundEnabled ? <Volume2 size={18} color="#4cd137" /> : <VolumeX size={18} color="#ff4757" />}
                                Ses Efektleri
                            </span>
                            <button
                                onClick={() => {
                                    dispatch(toggleSound());
                                    playClick(!isSoundEnabled);
                                }}
                                style={{
                                    padding: '6px 14px',
                                    backgroundColor: isSoundEnabled ? 'rgba(76, 209, 55, 0.2)' : 'rgba(255, 71, 87, 0.2)',
                                    color: isSoundEnabled ? '#4cd137' : '#ff4757',
                                    border: `1px solid ${isSoundEnabled ? '#4cd137' : '#ff4757'}`,
                                    borderRadius: '6px',
                                    fontWeight: 'bold',
                                    fontSize: '13px',
                                    cursor: 'pointer'
                                }}
                            >
                                {isSoundEnabled ? 'AÇIK' : 'KAPALI'}
                            </button>
                        </div>

                        <button
                            onClick={() => {
                                playClick(isSoundEnabled);
                                setShowSettings(false);
                            }}
                            style={{
                                width: '100%', padding: '12px', backgroundColor: '#3e2723', color: '#d2b48c',
                                border: '2px solid #5c3a21', borderRadius: '8px', fontWeight: 'bold',
                                cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px'
                            }}
                        >
                            <X size={18} /> Kapat
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PauseMenu;