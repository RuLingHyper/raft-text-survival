import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { quitToMenu } from "../../store/gameSlice";

const VictoryScreen = () => {
    const dispatch = useDispatch();
    const { day } = useSelector(state => state.game);

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: '#0a0a0a', zIndex: 9999,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: '20px', textAlign: 'center',
            backgroundImage: 'radial-gradient(circle, rgba(45,52,54,1) 0%, rgba(0,0,0,1) 100%)'
        }}>

            {/* Animasyonlu veya gölgeli büyük başlık */}
            <h1 style={{
                color: '#4cd137', fontSize: '42px', margin: '0 0 20px 0',
                textShadow: '0 0 30px rgba(76, 209, 55, 0.6)', letterSpacing: '2px'
            }}>
                KURTULDUN!
            </h1>

            <p style={{ color: '#d2b48c', fontSize: '16px', maxWidth: '400px', lineHeight: '1.6', marginBottom: '30px' }}>
                S.O.S Sinyal İstasyonunu başarıyla kurdun! Ufukta beliren kurtarma helikopteri seni bu uçsuz bucaksız okyanustan alıp eve götürüyor.
            </p>

            <div style={{
                backgroundColor: '#1e1e1e', border: '2px solid #5c3a21',
                padding: '20px 40px', borderRadius: '10px', marginBottom: '40px',
                boxShadow: '0 10px 20px rgba(0,0,0,0.5)'
            }}>
                <div style={{ color: '#aaa', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '5px' }}>
                    Hayatta Kalınan Süre
                </div>
                <div style={{ color: '#ffb142', fontSize: '32px', fontWeight: 'bold' }}>
                    {day} GÜN
                </div>
            </div>

            <button
                onClick={() => dispatch(quitToMenu())}
                style={{
                    padding: '15px 40px', backgroundColor: '#4cd137', color: '#111',
                    fontSize: '16px', fontWeight: 'bold', border: 'none', borderRadius: '8px',
                    cursor: 'pointer', boxShadow: '0 5px 15px rgba(76,209,55,0.3)'
                }}
            >
                ANA MENÜYE DÖN
            </button>
        </div>
    );
};

export default VictoryScreen;