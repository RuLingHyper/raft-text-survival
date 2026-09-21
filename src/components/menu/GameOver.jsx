import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { startNewGame, quitToMenu } from "../../store/gameSlice";
import { Skull, RotateCcw, Home } from "lucide-react";
import { playGameOver, playClick } from "../../utils/soundEffects";

const GameOver = () => {
    const dispatch = useDispatch();
    const isSoundEnabled = useSelector((state) => state.game.isSoundEnabled);

    useEffect(() => {
        playGameOver(isSoundEnabled);
    }, [isSoundEnabled]);

    return (
        <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            minHeight: '100vh', backgroundColor: '#0a0a0a', padding: '15px'
        }}>

            {/* KAN KIRMIZISI AHŞAP KUTU */}
            <div style={{
                backgroundColor: '#1a100c',
                padding: '40px 30px',
                borderRadius: '12px',
                border: '3px solid #ff4757',
                boxShadow: '0 0 50px rgba(255, 71, 87, 0.3)',
                width: '100%', maxWidth: '400px',
                textAlign: 'center'
            }}>

                {/* Kuru Kafa İkonu */}
                <Skull size={70} color="#ff4757" style={{ marginBottom: '15px' }} />

                <h1 style={{
                    margin: '0 0 10px 0', color: '#ff4757', fontSize: '38px',
                    letterSpacing: '5px', textShadow: '2px 2px 4px rgba(0,0,0,0.9)'
                }}>
                    OYUN BİTTİ
                </h1>

                <p style={{ color: '#aaa', fontSize: '15px', marginBottom: '35px', fontStyle: 'italic', lineHeight: '1.6' }}>
                    Okyanusun acımasız şartlarına yenik düştün.<br />Salın artık sulara gömüldü...
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>

                    {/* YENİDEN BAŞLA BUTONU */}
                    <button
                        onClick={() => {
                            playClick(isSoundEnabled);
                            dispatch(startNewGame());
                        }}
                        style={{
                            padding: '16px', backgroundColor: '#8b0000', color: '#fff',
                            border: '2px solid #ff4757', borderRadius: '8px', fontSize: '18px', fontWeight: 'bold',
                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                            boxShadow: '0 4px 15px rgba(255, 71, 87, 0.4)', transition: '0.2s'
                        }}
                    >
                        <RotateCcw size={22} /> Yeniden Başla
                    </button>

                    {/* ANA MENÜYE DÖN BUTONU */}
                    <button
                        onClick={() => {
                            playClick(isSoundEnabled);
                            dispatch(quitToMenu());
                        }}
                        style={{
                            padding: '16px', backgroundColor: '#2e1c14', color: '#aaa',
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

export default GameOver;