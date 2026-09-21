import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { throwHook, gatherByHand, craftHook } from "../../store/gameSlice";
import { Anchor, Hand, Hammer } from "lucide-react";
import { playHookThrow, playClick } from "../../utils/soundEffects";

const ActionPanel = ({ hasHook }) => {
    const dispatch = useDispatch();
    const equipment = useSelector((state) => state.game.equipment) || [];
    const isSoundEnabled = useSelector((state) => state.game.isSoundEnabled);
    const hook = equipment.find(item => item.itemId === 'hook');

    // Kanca Bekleme Süresi (Cooldown)
    const [isHookCoolingDown, setIsHookCoolingDown] = useState(false);
    const [cooldownTime, setCooldownTime] = useState(0);

    // Elle Toplama Bekleme Süresi (Spam engeli)
    const [isGatherCoolingDown, setIsGatherCoolingDown] = useState(false);
    const [gatherCooldownTime, setGatherCooldownTime] = useState(0);

    // Kanca geri sayımı
    useEffect(() => {
        let timer;
        if (isHookCoolingDown && cooldownTime > 0) {
            timer = setInterval(() => {
                setCooldownTime((prev) => prev - 1);
            }, 1000);
        } else if (cooldownTime <= 0) {
            setIsHookCoolingDown(false);
            clearInterval(timer);
        }
        return () => clearInterval(timer);
    }, [isHookCoolingDown, cooldownTime]);

    // Elle toplama geri sayımı
    useEffect(() => {
        let timer;
        if (isGatherCoolingDown && gatherCooldownTime > 0) {
            timer = setInterval(() => {
                setGatherCooldownTime((prev) => prev - 1);
            }, 1000);
        } else if (gatherCooldownTime <= 0) {
            setIsGatherCoolingDown(false);
            clearInterval(timer);
        }
        return () => clearInterval(timer);
    }, [isGatherCoolingDown, gatherCooldownTime]);

    const handleThrowHook = () => {
        if (isHookCoolingDown) return;
        playHookThrow(isSoundEnabled);
        dispatch(throwHook());
        setIsHookCoolingDown(true);
        setCooldownTime(3);
    };

    const handleGatherByHand = () => {
        if (isGatherCoolingDown) return;
        playClick(isSoundEnabled);
        dispatch(gatherByHand());
        setIsGatherCoolingDown(true);
        setGatherCooldownTime(2);
    };

    const hookDurabilityPercent = hook ? Math.max(0, Math.round((hook.durability / hook.maxDurability) * 100)) : 0;
    const hookBarColor = hookDurabilityPercent > 50 ? '#4cd137' : hookDurabilityPercent > 20 ? '#ffb142' : '#ff4757';

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>

            {/* EĞER KANCA VARSA: Büyük fırlatma butonu ve dayanıklılık */}
            {hasHook ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <button
                        onClick={handleThrowHook}
                        disabled={isHookCoolingDown}
                        style={{
                            width: '100%', padding: '14px 16px',
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

                    {/* Kanca Dayanıklılık Göstergesi */}
                    {hook && (
                        <div style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            backgroundColor: 'rgba(30, 20, 15, 0.7)', padding: '3px 8px',
                            borderRadius: '4px', border: '1px solid #5c3a21', fontSize: '11px'
                        }}>
                            <span style={{ color: '#aaa' }}>Kanca Dayanıklılığı:</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <div style={{ width: '80px', height: '5px', backgroundColor: '#33231b', borderRadius: '3px', overflow: 'hidden' }}>
                                    <div style={{ width: `${hookDurabilityPercent}%`, height: '100%', backgroundColor: hookBarColor, transition: 'width 0.3s' }} />
                                </div>
                                <span style={{ fontWeight: 'bold', color: hookBarColor }}>
                                    {hook.durability}/{hook.maxDurability} (%{hookDurabilityPercent})
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            ) : (

                /* EĞER KANCA KIRILDIYSA / YOKSA: Kurtarma butonları görünür */
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        onClick={handleGatherByHand}
                        disabled={isGatherCoolingDown}
                        style={{
                            flex: 1, padding: '15px',
                            backgroundColor: isGatherCoolingDown ? '#1e130e' : '#2e1c14',
                            color: isGatherCoolingDown ? '#666' : '#aaa',
                            border: `2px dashed ${isGatherCoolingDown ? '#33231b' : '#555'}`,
                            borderRadius: '8px', fontSize: '15px', fontWeight: 'bold',
                            cursor: isGatherCoolingDown ? 'not-allowed' : 'pointer',
                            display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px',
                            transition: '0.2s'
                        }}
                    >
                        <Hand size={18} /> {isGatherCoolingDown ? `Toplanıyor... (${gatherCooldownTime})` : "Elle Topla"}
                    </button>

                    <button
                        onClick={() => dispatch(craftHook())}
                        style={{
                            flex: 1, padding: '15px',
                            backgroundColor: '#8b0000', color: '#fff', border: '2px solid #ff4757',
                            borderRadius: '8px', fontSize: '15px', fontWeight: 'bold',
                            cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px',
                            boxShadow: '0 0 15px rgba(255, 71, 87, 0.4)', transition: '0.2s'
                        }}
                    >
                        <Hammer size={18} /> Yeni Kanca Üret
                    </button>
                </div>
            )}

        </div>
    );
};

export default ActionPanel;