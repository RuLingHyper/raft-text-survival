import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { startGame, startNewGame } from "../../store/gameSlice";
import { Play, Plus, Settings, Info, AlertTriangle, X, Check, Code, Globe, Volume2 } from "lucide-react";

const MainMenu = () => {
    const dispatch = useDispatch();
    const { logs, inventory, vitals } = useSelector((state) => state.game);

    // Açılır pencerelerin (modal) durumlarını tutan state'ler
    const [showConfirm, setShowConfirm] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [showDevelopers, setShowDevelopers] = useState(false);

    const hasSave = logs.length > 1 || inventory.wood > 0 || vitals.health < 100;

    const handleNewGame = () => {
        if (hasSave) {
            setShowConfirm(true);
        } else {
            dispatch(startNewGame());
        }
    };

    const confirmNewGame = () => {
        dispatch(startNewGame());
        setShowConfirm(false);
    };

    return (
        <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            height: '100vh', width: '100vw', backgroundColor: '#111', padding: '15px', position: 'relative',
            overflow: 'hidden', boxSizing: 'border-box'
        }}>

            {/* ANA MENÜ KUTUSU */}
            <div style={{
                backgroundColor: '#2e1c14', padding: '30px', borderRadius: '12px',
                border: '3px solid #8b5a2b', boxShadow: '0 0 30px rgba(0,0,0,0.8)',
                width: '100%', maxWidth: '400px', textAlign: 'center'
            }}>

                <h1 style={{
                    margin: '0 0 10px 0', color: '#d2b48c', fontSize: '30px',
                    letterSpacing: '2px', textShadow: '2px 2px 4px rgba(0,0,0,0.9)'
                }}>
                    ⛵ RAFT TEXT SURVIVAL
                </h1>
                <p style={{ color: '#aaa', fontSize: '14px', marginBottom: '30px', fontStyle: 'italic' }}>
                    Uçsuz bucaksız okyanusta sadece kancan ve sen varsın.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <button
                        onClick={() => dispatch(startGame())}
                        disabled={!hasSave}
                        style={{
                            padding: '15px', backgroundColor: hasSave ? '#3e2723' : '#22150f',
                            color: hasSave ? '#4cd137' : '#555', border: `2px solid ${hasSave ? '#5c3a21' : '#332014'}`,
                            borderRadius: '8px', fontSize: '18px', fontWeight: 'bold',
                            cursor: hasSave ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                            transition: '0.2s'
                        }}
                    >
                        <Play size={20} /> Devam Et
                    </button>

                    <button
                        onClick={handleNewGame}
                        style={{
                            padding: '15px', backgroundColor: '#3e2723', color: '#d2b48c',
                            border: '2px solid #5c3a21', borderRadius: '8px', fontSize: '18px', fontWeight: 'bold',
                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                            transition: '0.2s'
                        }}
                    >
                        <Plus size={20} /> Yeni Oyun
                    </button>

                    <button
                        onClick={() => setShowSettings(true)}
                        style={{
                            padding: '15px', backgroundColor: '#3e2723', color: '#aaa',
                            border: '2px solid #5c3a21', borderRadius: '8px', fontSize: '15px', fontWeight: 'bold',
                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                            transition: '0.2s'
                        }}
                    >
                        <Settings size={18} /> Ayarlar
                    </button>

                    <button
                        onClick={() => setShowDevelopers(true)}
                        style={{
                            padding: '15px', backgroundColor: '#3e2723', color: '#aaa',
                            border: '2px solid #5c3a21', borderRadius: '8px', fontSize: '15px', fontWeight: 'bold',
                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                            transition: '0.2s'
                        }}
                    >
                        <Info size={18} /> Geliştirici
                    </button>
                </div>

                <div style={{ marginTop: '25px', borderTop: '1px solid #5c3a21', paddingTop: '15px' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', fontSize: '13px' }}>

                        <a href="https://github.com/RuLingHyper" target="_blank" rel="noopener noreferrer" style={{ color: '#d2b48c', cursor: 'pointer', textDecoration: 'underline' }}>
                            GitHub
                        </a>

                        <a href="https://instagram.com/mhmtiseri06" target="_blank" rel="noopener noreferrer" style={{ color: '#d2b48c', cursor: 'pointer', textDecoration: 'underline' }}>
                            Instagram
                        </a>

                    </div>
                </div>
            </div>

            {/* ======================================================= */}
            {/* ONAY PENCERESİ: YENİ OYUN */}
            {/* ======================================================= */}
            {showConfirm && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.85)', zIndex: 1000,
                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                    padding: '20px', backdropFilter: 'blur(4px)'
                }}>
                    <div style={{
                        backgroundColor: '#2e1c14', padding: '30px', borderRadius: '12px',
                        border: '3px solid #ff4757', boxShadow: '0 0 40px rgba(255, 71, 87, 0.4)',
                        width: '100%', maxWidth: '350px', textAlign: 'center'
                    }}>
                        <AlertTriangle size={50} color="#ff4757" style={{ marginBottom: '15px' }} />
                        <h2 style={{ color: '#fff', fontSize: '22px', margin: '0 0 10px 0' }}>Emin Misin?</h2>
                        <p style={{ color: '#aaa', fontSize: '14px', marginBottom: '25px', lineHeight: '1.5' }}>
                            Yeni bir oyuna başlarsan <strong>mevcut hayatta kalma kaydın tamamen silinecek.</strong> Bu işlem geri alınamaz!
                        </p>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                                onClick={() => setShowConfirm(false)}
                                style={{
                                    flex: 1, padding: '12px', backgroundColor: '#3e2723', color: '#aaa',
                                    border: '2px solid #5c3a21', borderRadius: '8px', fontWeight: 'bold',
                                    cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px'
                                }}
                            >
                                <X size={18} /> İptal
                            </button>
                            <button
                                onClick={confirmNewGame}
                                style={{
                                    flex: 1, padding: '12px', backgroundColor: '#ff4757', color: '#fff',
                                    border: 'none', borderRadius: '8px', fontWeight: 'bold',
                                    cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px',
                                    boxShadow: '0 4px 10px rgba(255, 71, 87, 0.3)'
                                }}
                            >
                                <Check size={18} /> Evet, Sil
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ======================================================= */}
            {/* AYARLAR PENCERESİ */}
            {/* ======================================================= */}
            {showSettings && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.85)', zIndex: 1000,
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
                            <span style={{ color: '#aaa', display: 'flex', alignItems: 'center', gap: '8px' }}><Volume2 size={18} /> Ses Efektleri</span>
                            <span style={{ color: '#ff6b81', fontWeight: 'bold', fontSize: '12px', backgroundColor: 'rgba(255, 107, 129, 0.2)', padding: '4px 8px', borderRadius: '4px' }}>YAKINDA</span>
                        </div>

                        <button
                            onClick={() => setShowSettings(false)}
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

            {/* ======================================================= */}
            {/* GELİŞTİRİCİ PENCERESİ */}
            {/* ======================================================= */}
            {showDevelopers && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.85)', zIndex: 1000,
                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                    padding: '20px', backdropFilter: 'blur(4px)'
                }}>
                    <div style={{
                        backgroundColor: '#2e1c14', padding: '30px', borderRadius: '12px',
                        border: '3px solid #5c3a21', boxShadow: '0 0 30px rgba(0,0,0,0.8)',
                        width: '100%', maxWidth: '350px', textAlign: 'center'
                    }}>
                        <Code size={50} color="#4cd137" style={{ marginBottom: '15px' }} />
                        <h2 style={{ color: '#fff', fontSize: '22px', margin: '0 0 10px 0' }}>Geliştirici Ekibi</h2>

                        <div style={{ backgroundColor: '#22150f', padding: '15px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #332014', textAlign: 'left' }}>
                            <p style={{ color: '#aaa', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Info size={16} color="#d2b48c" /> <strong>Geliştirici:</strong> Mehmet İŞERİ
                            </p>
                            <p style={{ color: '#aaa', margin: '0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Globe size={16} color="#d2b48c" /> <strong>Web Sitesi:</strong> ---
                            </p>
                        </div>

                        <button
                            onClick={() => setShowDevelopers(false)}
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

export default MainMenu;