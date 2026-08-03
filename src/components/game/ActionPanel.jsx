import React from "react";
import { useDispatch } from "react-redux";
// Kendi gameSlice'ındaki fonksiyon isimlerinin bunlar olduğundan emin ol:
import { throwHook, gatherByHand, craftHook } from "../../store/gameSlice";
import { Anchor, Hand, Hammer } from "lucide-react";

const ActionPanel = ({ hasHook }) => {
    const dispatch = useDispatch();

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

            {/* EĞER KANCA VARSA: Sadece büyük fırlatma butonu görünür */}
            {hasHook ? (
                <button
                    onClick={() => dispatch(throwHook())}
                    style={{
                        width: '100%', padding: '20px',
                        backgroundColor: '#3e2723', color: '#d2b48c', border: '3px solid #8b5a2b',
                        borderRadius: '8px', fontSize: '20px', fontWeight: 'bold',
                        cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px',
                        boxShadow: '0 6px 10px rgba(0,0,0,0.6)',
                        textTransform: 'uppercase', letterSpacing: '3px', transition: '0.2s'
                    }}
                >
                    <Anchor size={28} color="#d2b48c" /> Kancayı Fırlat
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