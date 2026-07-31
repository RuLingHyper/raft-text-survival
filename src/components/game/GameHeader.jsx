import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { pauseGame } from "../../store/gameSlice";
import { Pause, Heart, Utensils, Droplets, Sun, Moon, CloudRain, CloudLightning } from "lucide-react";

const GameHeader = ({ vitals }) => {
    const dispatch = useDispatch();
    // Redux'tan gün, saat ve tickCount bilgisini çekiyoruz
    const { day, time, tickCount, weather } = useSelector(state => state.game);

    // Gece mi gündüz mü kontrolü (Akşam 8 ile Sabah 6 arası gece)
    const isNight = time >= 20 || time < 6;

    // YENİ: Dakika hesaplama (Çift tick'lerde 00, tek tick'lerde 30)
    const minutes = tickCount % 2 === 0 ? "00" : "30";

    return (
        <div style={{
            display: 'flex', flexDirection: 'column', gap: '15px',
            backgroundColor: isNight ? 'rgba(20, 20, 30, 0.85)' : 'rgba(139, 90, 43, 0.2)', // Gece karanlık, gündüz ahşap
            border: isNight ? '2px solid #2d3436' : '2px solid #5c3a21',
            padding: '15px', borderRadius: '10px', marginBottom: '20px',
            transition: 'all 1s ease' // Geceye geçerken yumuşak animasyon
        }}>

            {/* ÜST SATIR: Zaman ve Durdur Butonu */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

                {/* ZAMAN GÖSTERGESİ */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: isNight ? '#a29bfe' : '#ffeaa7', fontWeight: 'bold', fontSize: '18px' }}>
                    {isNight ? <Moon size={24} fill="#a29bfe" /> : <Sun size={24} fill="#ffeaa7" />}
                    <span>GÜN {day}</span>
                    <span style={{ fontSize: '14px', opacity: 0.8, backgroundColor: 'rgba(0,0,0,0.3)', padding: '2px 6px', borderRadius: '4px', fontFamily: 'monospace' }}>
                        {time < 10 ? `0${time}` : time} : {minutes}
                    </span>

                    {/* HAVA DURUMU İKONU */}
                    <div style={{ display: 'flex', alignItems: 'center', marginLeft: '5px' }}>
                        {weather === 'rainy' && <CloudRain size={20} color="#74b9ff" />}
                        {weather === 'stormy' && <CloudLightning size={20} color="#fdcb6e" />}
                    </div>
                </div>



                {/* DURDUR BUTONU */}
                <button
                    onClick={() => dispatch(pauseGame())}
                    style={{ padding: '6px 12px', backgroundColor: '#3e2723', color: '#d2b48c', border: '1px solid #5c3a21', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
                >
                    <Pause size={16} />
                </button>
            </div>

            {/* ALT SATIR: Yaşamsal Değerler (Merkezlenmiş) */}
            <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)', padding: '8px', borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ff6b81', fontWeight: 'bold', fontSize: '16px' }}>
                    <Heart size={18} fill="#ff6b81" /> %{vitals.health}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#eccc68', fontWeight: 'bold', fontSize: '16px' }}>
                    <Utensils size={18} /> %{vitals.hunger}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#70a1ff', fontWeight: 'bold', fontSize: '16px' }}>
                    <Droplets size={18} fill="#70a1ff" /> %{vitals.thirst}
                </div>
            </div>

        </div>
    );
};

export default GameHeader;