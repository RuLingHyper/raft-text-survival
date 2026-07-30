import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { throwHook, gameTick, startGame, startNewGame, pauseGame, resumeGame, quitToMenu, restartGame, boilWater, cookFish, buildNet, buildPurifier, buildGrill, craftSpear, craftHook, gatherByHand, craftOar, exploreIsland, craftBandage } from "./store/gameSlice";
import { Anchor, Droplets, Heart, Utensils, Flame, Grid, Ship, Sword, Map, Compass, Plus, Fish, Play, Pause, Settings, Info, X, Home } from "lucide-react";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const timer = setInterval(() => {
      dispatch(gameTick());
    }, 3000);
    return () => clearInterval(timer);
  }, [dispatch]);

  const { vitals, inventory, logs, isGameStarted, isGameOver, buildings, equipment, isGamePaused } = useSelector((state) => state.game);

  // YENİ: equipment gerçekten bir dizi mi diye kontrol ediyoruz. 
  // Eğer eski bir kayıt geldiyse hata vermemesi için boş dizi [] kabul ediyoruz.
  const safeEquipment = Array.isArray(equipment) ? equipment : [];

  // YENİ: Ekipmanları dizinin içinde arayarak buluyoruz
  const hasSpear = safeEquipment.some(item => item.itemId === 'spear');
  const hasOar = safeEquipment.some(item => item.itemId === 'oar');
  const hasHook = safeEquipment.some(item => item.itemId === 'hook'); // Kancamız kırıldı mı diye kontrol etmek için

  const hasSave = logs.length > 1 || inventory.wood > 0 || vitals.health < 100;

  if (!isGameStarted) {
    // ... (Ana Menü kodları aynı kalıyor)
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
              onClick={() => alert("Geliştirici:\ Mehmet İŞERİ")}
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
      </div >
    );
  }

  if (isGamePaused) {
    // ... (Pause Menüsü kodları aynı kalıyor)
    return (
      <div style={{ maxWidth: '400px', margin: '100px auto', padding: '40px', backgroundColor: '#1a1a1a', borderRadius: '12px', textAlign: 'center', border: '2px solid #0fbcf9' }}>
        <h2 style={{ color: '#fff', fontSize: '32px', marginBottom: '30px' }}>OYUN DURDURULDU</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <button onClick={() => dispatch(resumeGame())} style={{ padding: '15px', backgroundColor: '#05c46b', color: '#000', border: 'none', borderRadius: '8px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' }}>
            <Play size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} /> Devam Et
          </button>
          <button onClick={() => alert("Ayarlar yakında eklenecek")} style={{ padding: '15px', backgroundColor: '#2d2d2d', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' }}>
            <Settings size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} /> Ayarlar
          </button>
          <button onClick={() => dispatch(quitToMenu())} style={{ padding: '15px', backgroundColor: '#ff4757', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' }}>
            <Home size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} /> Ana Menüye Dön
          </button>
        </div>
      </div>
    );
  }

  if (isGameOver) {
    // ... (Game Over kodları aynı kalıyor)
    return (
      <div style={{ maxWidth: '600px', margin: '40px auto', padding: '50px', backgroundColor: '#1a0b0b', borderRadius: '10px', textAlign: 'center', border: '2px solid #ff4757' }}>
        <h1 style={{ color: '#ff4757', fontSize: '48px', margin: '0 0 15px 0' }}>OYUN BİTTİ</h1>
        <p style={{ color: '#aaa', fontSize: '18px', marginBottom: '30px' }}>Açlık ve susuzluğa yenik düştün. Salın okyanusta sahipsizce sürükleniyor...</p>
        <button
          onClick={() => dispatch(restartGame())} style={{ padding: '15px 40px', backgroundColor: '#ff4757', color: '#fff', border: 'none', borderRadius: 'bold', cursor: 'pointer' }}
        >
          Yeniden Başla
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px', backgroundColor: '#1e1e1e', borderRadius: '10px' }}>

      {/* Oyun İçi Üst Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: '#0fbcf9', margin: 0, letterSpacing: '2px' }}>KAYIP SAL</h2>
        <button
          onClick={() => dispatch(pauseGame())}
          style={{ padding: '8px 15px', backgroundColor: '#333', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
        >
          <Pause size={18} /> Durdur
        </button>
      </div>

      {/* 1. Üst Kısım: Yaşamsal Değerler */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', padding: '15px', backgroundColor: '#2d2d2d', borderRadius: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ff4757', fontWeight: 'bold' }}>
          <Heart size={20} /> %{vitals.health}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ffa502', fontWeight: 'bold' }}>
          <Utensils size={20} /> %{vitals.hunger}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1e90ff', fontWeight: 'bold' }}>
          <Droplets size={20} /> %{vitals.thirst}
        </div>
      </div>

      {/* 2. Orta Kısım: Envanter */}
      <div style={{ marginBottom: '20px', display: 'flex', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
        <div style={{ padding: '15px', backgroundColor: '#2d2d2d', borderRadius: '8px', textAlign: 'center' }}>
          <span style={{ color: '#888', display: 'block', marginBottom: '5px', fontSize: '14px' }}>Tahta</span>
          <strong style={{ fontSize: '24px', color: '#fff' }}>{inventory.wood}</strong>
        </div>
        <div style={{ padding: '15px', backgroundColor: '#2d2d2d', borderRadius: '8px', textAlign: 'center' }}>
          <span style={{ color: '#888', display: 'block', marginBottom: '5px', fontSize: '14px' }}>Plastik</span>
          <strong style={{ fontSize: '24px', color: '#fff' }}>{inventory.plastic}</strong>
        </div>
        <div style={{ padding: '15px', backgroundColor: '#2d2d2d', borderRadius: '8px', textAlign: 'center' }}>
          <span style={{ color: '#888', display: 'block', marginBottom: '5px', fontSize: '14px' }}>Yaprak</span>
          <strong style={{ fontSize: '24px', color: '#1dd1a1' }}>{inventory.leaf}</strong>
        </div>
        <div style={{ padding: '15px', backgroundColor: '#2d2d2d', borderRadius: '8px', textAlign: 'center' }}>
          <span style={{ color: '#888', display: 'block', marginBottom: '5px', fontSize: '14px' }}>Metal</span>
          <strong style={{ fontSize: '24px', color: '#feca57' }}>{inventory.metal}</strong>
        </div>
      </div>

      {/* 2.5 Yapılar ve Otomasyon */}
      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#2d2d2d', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '15px' }}>

        {/* Ağ Kurulumu */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ color: '#888', display: 'block', marginBottom: '5px', fontSize: '14px' }}>Toplama Ağları</span>
            <strong style={{ fontSize: '18px', color: '#2ed573' }}>{buildings.collectionNet} Adet</strong>
          </div>
          <button onClick={() => dispatch(buildNet())}
            style={{ padding: '10px 15px', backgroundColor: '#9b59b6', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }} >
            <Grid size={16} /> Ağ Kur (3 Tahta, 3 Plastik)
          </button>
        </div>

        {/* Su Arıtıcı */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #444', paddingTop: '15px' }}>
          <div>
            <span style={{ color: '#888', display: 'block', marginBottom: '5px', fontSize: '14px' }}>Su Arıtıcı</span>
            <strong style={{ fontSize: '16px', color: buildings.waterPurifier ? '#1e90ff' : '#555' }}>
              {buildings.waterPurifier ? "Aktif (Bedava Su)" : "Yok"}
            </strong>
          </div>
          <button onClick={() => dispatch(buildPurifier())} disabled={buildings.waterPurifier}
            style={{ padding: '10px 15px', backgroundColor: buildings.waterPurifier ? '#555' : '#1e90ff', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', cursor: buildings.waterPurifier ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }} >
            <Droplets size={16} /> Arıtıcı Kur (6 Plastik, 2 Metal)
          </button>
        </div>

        {/* Izgara */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #444', paddingTop: '15px' }}>
          <div>
            <span style={{ color: '#888', display: 'block', marginBottom: '5px', fontSize: '14px' }}>Pişirme Izgarası</span>
            <strong style={{ fontSize: '16px', color: buildings.grill ? '#ffa502' : '#555' }}>
              {buildings.grill ? "Aktif (Bedava Ateş)" : "Yok"}
            </strong>
          </div>
          <button onClick={() => dispatch(buildGrill())} disabled={buildings.grill}
            style={{ padding: '10px 15px', backgroundColor: buildings.grill ? '#555' : '#ffa502', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', cursor: buildings.grill ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }} >
            <Flame size={16} /> Izgara Kur (5 Tahta, 2 Metal)
          </button>
        </div>
      </div>

      {/* 2.5.1 Silah ve Savunma - YENİ hasSpear MANTIĞI */}
      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#301b1b', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #ff4757' }}>
        <div>
          <span style={{ color: '#888', display: 'block', marginBottom: '5px', fontSize: '14px' }}>Savunma</span>
          <strong style={{ fontSize: '20px', color: hasSpear ? '#2ed573' : '#ff4757' }}>
            {hasSpear ? "Mızrak Kuşanıldı" : "Savunmasız!"}
          </strong>
        </div>

        <button
          onClick={() => dispatch(craftSpear())}
          disabled={hasSpear}
          style={{ padding: '10px 15px', backgroundColor: hasSpear ? '#555' : '#ff4757', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', cursor: hasSpear ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
        >
          <Sword size={16} /> Mızrak Üret (4 Tahta, 1 Metal)
        </button>
      </div>

      {/* 2.5.2 Seyahat ve Keşif - YENİ hasOar MANTIĞI */}
      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#1e272e', borderRadius: '8px', border: '1px solid #0fbcf9' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <div>
            <span style={{ color: '#888', display: 'block', marginBottom: '5px', fontSize: '14px' }}>Seyahat Durumu</span>
            <strong style={{ fontSize: '20px', color: hasOar ? '#0fbcf9' : '#888' }}>
              {hasOar ? "Kürek Hazır" : "Sürükleniyor..."}
            </strong>
          </div>
          <button
            onClick={() => dispatch(craftOar())}
            disabled={hasOar}
            style={{ padding: '10px 15px', backgroundColor: hasOar ? '#555' : '#0fbcf9', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', cursor: hasOar ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
          >
            <Compass size={16} /> Kürek Üret (5 Tahta, 5 Plastik)
          </button>
        </div>
        <button
          onClick={() => dispatch(exploreIsland())}
          disabled={!hasOar}
          style={{ width: '100%', padding: '12px', backgroundColor: hasOar ? '#05c46b' : '#333', color: hasOar ? '#000' : '#555', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: hasOar ? 'pointer' : 'not-allowed', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', transition: '0.2s' }}
        >
          <Map size={20} /> Adayı Keşfet (-25 Açlık ve Susuzluk)
        </button>
      </div>

      {/* 3. Hikaye ve Log Ekranı */}
      <div style={{ height: '220px', overflowY: 'auto', backgroundColor: '#0a0a0a', padding: '15px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #333' }}>
        {logs.map((log, index) => (
          <p key={index} style={{ margin: '0 0 12px 0', color: index === 0 ? '#fff' : '#555', fontSize: '15px', lineHeight: '1.4' }}>
            <span style={{ color: '#2ed573', marginRight: '8px' }}>{">"}</span> {log}
          </p>
        ))}
      </div>

      {/* 4. Alt Kısım: Aksiyon Butonları */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

        {/* Kanca Butonu ve Üretim Alanı */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => dispatch(throwHook())}
            disabled={!hasHook}
            style={{ flex: hasHook ? '1' : '0.4', padding: '18px', backgroundColor: hasHook ? '#2ed573' : '#333', color: hasHook ? '#000' : '#555', border: 'none', borderRadius: '8px', fontSize: '18px', fontWeight: 'bold', cursor: hasHook ? 'pointer' : 'not-allowed', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}
          >
            <Anchor size={24} /> {hasHook ? "Kancayı Fırlat" : "Kancan Kırıldı!"}
          </button>

          {/* Kanca kırıldığında ortaya çıkacak Acil Durum ve Üretim Butonları */}
          {!hasHook && (
            <>
              <button
                onClick={() => dispatch(gatherByHand())}
                style={{ flex: '0.3', padding: '15px', backgroundColor: '#ffa502', color: '#000', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}
              >
                Denize Uzan<br />(-10 Açlık)
              </button>
              <button
                onClick={() => dispatch(craftHook())}
                style={{ flex: '0.3', padding: '15px', backgroundColor: '#0fbcf9', color: '#000', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}
              >
                Kanca Üret<br />(2T, 2P)
              </button>
            </>
          )}
        </div>

        {/* Hayatta Kalma Butonları (Yan Yana 3'lü) */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => dispatch(craftBandage())}
            style={{ flex: 1, padding: '15px', backgroundColor: '#ff4757', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px' }}
          >
            <Plus size={18} /> Bandaj (3 Yaprak)
          </button>

          <button
            onClick={() => dispatch(boilWater())}
            style={{ flex: 1, padding: '15px', backgroundColor: '#1e90ff', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px', textAlign: 'center' }}
          >
            <Droplets size={18} /> {buildings.waterPurifier ? "Su İç\n(Bedava)" : "Su Kaynat\n(1 Tahta)"}
          </button>

          <button
            onClick={() => dispatch(cookFish())}
            style={{ flex: 1, padding: '15px', backgroundColor: '#ffa502', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px', textAlign: 'center' }}
          >
            <Fish size={18} /> {buildings.grill ? "Balık Pişir\n(1 Plastik)" : "Balık Pişir\n(1T, 1P)"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;