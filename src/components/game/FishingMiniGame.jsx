import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { endFishingMode } from "../../store/gameSlice";
import { Fish } from "lucide-react";

const FishingMiniGame = () => {
    const dispatch = useDispatch();
    const [position, setPosition] = useState(50);
    const [hits, setHits] = useState(0);

    const positionRef = useRef(50);
    const directionRef = useRef(1);
    const requestRef = useRef();

    const speed = 1.8;
    const targetStart = 35;
    const targetEnd = 65;
    const requiredHits = 3;

    useEffect(() => {
        const animate = () => {
            positionRef.current += speed * directionRef.current;

            if (positionRef.current >= 100) {
                positionRef.current = 100;
                directionRef.current = -1;
            } else if (positionRef.current <= 0) {
                positionRef.current = 0;
                directionRef.current = 1;
            }

            setPosition(positionRef.current);
            requestRef.current = requestAnimationFrame(animate);
        };

        requestRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(requestRef.current);
    }, []);

    // YENİ: handleTap artık 'position' state'i yerine doğrudan anlık 'positionRef' değerini okuyor (Sıfır gecikme!)
    const handleTap = () => {
        const currentPos = positionRef.current;

        if (currentPos >= targetStart && currentPos <= targetEnd) {
            const newHits = hits + 1;
            setHits(newHits);

            if (newHits >= requiredHits) {
                const reward = Math.random() < 0.80 ? 'fish' : 'trash';
                dispatch(endFishingMode({ success: true, reward }));
            }
        } else {
            dispatch(endFishingMode({ success: false, reward: null }));
        }
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.85)', zIndex: 9999,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(3px)'
        }}>
            <div style={{
                backgroundColor: '#3e2723', border: '3px solid #5c3a21',
                borderRadius: '12px', padding: '25px', width: '90%', maxWidth: '400px',
                textAlign: 'center', color: '#fff', boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
            }}>
                <Fish size={40} color="#ffb142" style={{ marginBottom: '10px' }} />
                <h2 style={{ margin: '0 0 10px 0', color: '#d2b48c' }}>Balık Yakalandı!</h2>
                <p style={{ fontSize: '13px', color: '#aaa', marginBottom: '25px' }}>
                    İbre <span style={{ color: '#4cd137', fontWeight: 'bold' }}>yeşil alandayken</span> tam zamanında "ÇEK" butonuna bas! ({requiredHits} kere)
                </p>

                {/* Hedef Barı */}
                <div style={{
                    position: 'relative', width: '100%', height: '40px',
                    backgroundColor: '#1e1e1e', borderRadius: '8px', overflow: 'hidden',
                    marginBottom: '25px', border: '2px solid #2d1912'
                }}>
                    <div style={{
                        position: 'absolute', left: `${targetStart}%`, width: `${targetEnd - targetStart}%`, height: '100%',
                        backgroundColor: 'rgba(76, 209, 55, 0.3)', borderLeft: '2px solid #4cd137', borderRight: '2px solid #4cd137'
                    }} />
                    <div style={{
                        position: 'absolute', left: `${position}%`, top: 0,
                        width: '6px', height: '100%', backgroundColor: '#ff4757',
                        transform: 'translateX(-50%)', boxShadow: '0 0 10px rgba(255, 71, 87, 0.8)',
                        borderRadius: '3px'
                    }} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '25px' }}>
                    {[...Array(requiredHits)].map((_, i) => (
                        <div key={i} style={{
                            width: '18px', height: '18px', borderRadius: '50%',
                            backgroundColor: hits > i ? '#4cd137' : '#555',
                            border: '2px solid #fff', transition: '0.3s'
                        }} />
                    ))}
                </div>

                {/* YENİ: onClick tamamen kaldırıldı, her şey parmağın değdiği anı yakalayan onPointerDown'a bağlandı! */}
                <button
                    onPointerDown={(e) => {
                        e.target.style.transform = 'translateY(5px)';
                        handleTap();
                    }}
                    onPointerUp={(e) => e.target.style.transform = 'translateY(0)'}
                    onPointerLeave={(e) => e.target.style.transform = 'translateY(0)'}
                    style={{
                        width: '100%', padding: '18px', fontSize: '22px', fontWeight: 'bold',
                        backgroundColor: '#4cd137', color: '#111', border: 'none', borderRadius: '8px',
                        cursor: 'pointer', boxShadow: '0 5px 0 #359828', transition: '0.1s'
                    }}
                >
                    ÇEK!
                </button>
            </div>
        </div>
    );
};

export default FishingMiniGame;