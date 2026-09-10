import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { throwHook, gatherByHand, craftHook } from "../../store/gameSlice";
import { Anchor, Hand, Hammer } from "lucide-react";

const ActionPanel = ({ hasHook }) => {
    const dispatch = useDispatch();

    // YENİ: Bekleme süresi (Cooldown) için State'ler
    const [isHookCoolingDown, setIsHookCoolingDown] = useState(false);
    const [cooldownTime, setCooldownTime] = useState(0);

    // YENİ: Geri sayımı kontrol eden sistem
    useEffect(() => {
        let timer;
        if (isHookCoolingDown && cooldownTime > 0) {
            timer = setInterval(() => {
                setCooldownTime((prev) => prev - 1);
            }, 1000); // Her 1 saniyede (1000ms) bir sayıyı düşür
        } else if (cooldownTime <= 0) {
            setIsHookCoolingDown(false);
            clearInterval(timer);
        }
        return () => clearInterval(timer);
    }, [isHookCoolingDown, cooldownTime]);

    // YENİ: Butona tıklandığında çalışacak olan özel fonksiyon
    const handleThrowHook = () => {
        if (isHookCoolingDown) return; // Zaten beklemedeyse hiçbir şey yapma (Spam engeli)

        dispatch(throwHook()); // Kancayı at (Redux)
        setIsHookCoolingDown(true); // Beklemeyi başlat
        setCooldownTime(3); // 3 saniye bekle
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>

            {/* EĞER KANCA VARSA: Sadece büyük fırlatma butonu görünür */}
            {hasHook ? (
                <button
                    onClick={handleThrowHook}
                    disabled={isHookCoolingDown} // Beklemedeyse butonu kilitle
                    style={{
                        width: '100%', padding: '14px 16px',
                        // Bekleme durumuna göre renk ve gölge değişimi
                        backgroundColor: isHookCoolingDown ? '#22150f' : '#3e2723',
                        color: isHookCoolingDown ? '#888' : '#d2b48c',
                        border: `3px solid ${isHookCoolingDown ? '#332014' : '#8b5a2b'}`,
                        borderRadius: '8px', fontSize: '18px', fontWeight: 'bold',
                        cursor: isHookCoolingDown ? 'not-allowed' : 'pointer',
                        display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px',
                        boxShadow: isHookCoolingDown ? 'none' : '0 4px 8px rgba(0,0,0,0.6)',
                        textTransform: 'uppercase', letterSpacing: '2px', transition: 'all 0.3s ease'
                    }}
                >
                    {isHookCoolingDown ? (
                        <span style={{ fontSize: '16px', letterSpacing: '1px' }}>
                            ⏳ Kanca Çekiliyor... ({cooldownTime})
                        </span>
                    ) : (
                        <>
                            <Anchor size={24} color="#d2b48c" /> Kancayı Fırlat
                        </>
                    )}
                </button>
            ) : (

                /* EĞER KANCA KIRILDIYSA / YOKSA: Kurtarma butonları görünür */
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        onClick={() => dispatch(gatherByHand())}
                        style={{
                            flex: 1, padding: '15px',
                            backgroundColor: '#2e1c14', color: '#aaa', border: '2px dashed #555',
                            borderRadius: '8px', fontSize: '16px', fontWeight: 'bold',
                            cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px',
                            transition: '0.2s'
                        }}
                    >
                        <Hand size={20} /> Elle Topla
                    </button>

                    <button
                        onClick={() => dispatch(craftHook())}
                        style={{
                            flex: 1, padding: '15px',
                            backgroundColor: '#8b0000', color: '#fff', border: '2px solid #ff4757',
                            borderRadius: '8px', fontSize: '16px', fontWeight: 'bold',
                            cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px',
                            boxShadow: '0 0 15px rgba(255, 71, 87, 0.4)', transition: '0.2s'
                        }}
                    >
                        <Hammer size={20} /> Yeni Kanca Üret
                    </button>
                </div>
            )}

        </div>
    );
};

export default ActionPanel;