import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { startGame, startNewGame } from "../../store/gameSlice";
import { Play, Plus, Settings, Info } from "lucide-react";

const MainMenu = () => {
    const dispatch = useDispatch();

    // Kayıt kontrolü için sadece gerekli olan state'leri çekiyoruz
    const { logs, inventory, vitals } = useSelector((state) => state.game);
    const hasSave = logs.length > 1 || inventory.wood > 0 || vitals.health < 100;

    return (
        <div style={{ maxWidth: '600px', margin: '40px auto', padding: '40px', backgroundColor: '#111', borderRadius: '12px', textAlign: 'center', border: '1px solid #333', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', minHeight: '80vh', justifyContent: 'space-between' }}>
            <div>
                <h1 style={{ color: '#0fbcf9', fontSize: '56px', margin: '0 0 15px 0', letterSpacing: '4px', textTransform: 'uppercase' }}>
                    Kayıp Sal
                </h1>
                <p style={{ color: '#aaa', fontSize: '16px', lineHeight: '1.6', marginBottom: '40px', padding: '0 20px' }}>
                    Uçsuz bucaksız okyanusta sadece kancan ve sen varsın.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '300px', margin: '0 auto' }}>
                    <button onClick={() => dispatch(startGame())} disabled={!hasSave}
                        style={{ padding: '15px', backgroundColor: hasSave ? '#0fbcf9' : '#333', color: hasSave ? '#000' : '#666', border: 'none', borderRadius: '8px', fontSize: '18px', fontWeight: 'bold', cursor: hasSave ? 'pointer' : 'not-allowed', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}
                    >
                        <Play size={20} /> Devam Et
                    </button>

                    <button
                        onClick={() => { if (window.confirm("Eski kayıt silinecek emin misin?")) dispatch(startNewGame()) }}
                        style={{ padding: '15px', backgroundColor: '#05c46b', color: '#000', border: 'none', borderRadius: '8px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}
                    >
                        <Plus size={20} /> Yeni Oyun
                    </button>

                    <button
                        onClick={() => alert("Ayarlar menüsü yakında eklenecek!")}
                        style={{ padding: '15px', backgroundColor: '#2d2d2d', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}
                    >
                        <Settings size={20} /> Ayarlar
                    </button>

                    <button
                        onClick={() => alert("Geliştirici: Mehmet İŞERİ")}
                        style={{ padding: '15px', backgroundColor: '#2d2d2d', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}
                    >
                        <Info size={20} /> Geliştiriciler
                    </button>
                </div>
            </div>

            <div style={{ marginTop: '40px', borderTop: '1px solid #333', paddingTop: '20px', color: '#666', fontSize: '14px' }}>
                <p style={{ margin: '0 0 10px 0' }}>Sosyal Medya Hesaplarımız:</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
                    <a href="https://instagram.com/mhmtiseri06" target="blank" rel="noreferrer" style={{ color: '#0fbcf9', textDecoration: 'none' }}>Instagram</a>
                    <a href="https://x.com/RuLingHyper" target="blank" rel="noreferrer" style={{ color: '#0fbcf9', textDecoration: 'none' }}>X</a>
                    <a href="https://github.com/RuLingHyper" target="blank" rel="noreferrer" style={{ color: '#0fbcf9', textDecoration: 'none' }}>GitHub</a>
                    <a href="https://tiktok.com/rulibey" target="blank" rel="noreferrer" style={{ color: '#0fbcf9', textDecoration: 'none' }}>Tiktok</a>
                </div>
            </div>
        </div>
    );
};

export default MainMenu;