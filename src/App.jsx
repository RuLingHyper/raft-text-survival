import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { gameTick } from "./store/gameSlice";
import { X, Backpack, Hammer, Map } from "lucide-react";

import MainMenu from "./components/menu/MainMenu";
import PauseMenu from "./components/menu/PauseMenu";
import GameOver from "./components/menu/GameOver";
import GameHeader from "./components/game/GameHeader";
import InventoryDisplay from "./components/game/InventoryDisplay";
import BuildingPanel from "./components/game/BuildingPanel";
import DefenseExplorationPanel from "./components/game/DefenseExplorationPanel";
import LogDisplay from "./components/game/LogDisplay";
import ActionPanel from "./components/game/ActionPanel";

function App() {
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState(null);

  // YENİ: Modalın ekrandaki konumunu tutuyoruz (Varsayılan: Ortalarda bir yer)
  const [modalPos, setModalPos] = useState({ x: 20, y: 150 });

  useEffect(() => {
    // Ekran boyutuna göre ilk açılışta pencereyi ortalayalım
    setModalPos({ x: window.innerWidth > 600 ? window.innerWidth / 2 - 200 : 20, y: 150 });

    const timer = setInterval(() => {
      dispatch(gameTick());
    }, 3000);
    return () => clearInterval(timer);
  }, [dispatch]);

  const { vitals, inventory, logs, isGameStarted, isGameOver, buildings, equipment, isGamePaused } = useSelector((state) => state.game);

  const safeEquipment = Array.isArray(equipment) ? equipment : [];
  const hasSpear = safeEquipment.some(item => item.itemId === 'spear');
  const hasOar = safeEquipment.some(item => item.itemId === 'oar');
  const hasHook = safeEquipment.some(item => item.itemId === 'hook');

  if (!isGameStarted) return <MainMenu />;
  if (isGameOver) return <GameOver />;

  // YENİ: Pencereyi Sürükleme Mantığı (Drag & Drop)
  const handlePointerDown = (e) => {
    const startX = e.clientX;
    const startY = e.clientY;
    const startPosX = modalPos.x;
    const startPosY = modalPos.y;

    const handlePointerMove = (moveEvent) => {
      setModalPos({
        x: startPosX + (moveEvent.clientX - startX),
        y: startPosY + (moveEvent.clientY - startY)
      });
    };

    const handlePointerUp = () => {
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerup", handlePointerUp);
    };

    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerup", handlePointerUp);
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px', backgroundColor: '#1e1e1e', borderRadius: '10px', position: 'relative' }}>

      <GameHeader vitals={vitals} />

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button onClick={() => setOpenModal(openModal === 'inventory' ? null : 'inventory')} style={{ flex: 1, padding: '12px', backgroundColor: '#8b5a2b', color: '#fff', border: '2px solid #5c3a21', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
          <Backpack size={18} /> Çanta
        </button>
        <button onClick={() => setOpenModal(openModal === 'building' ? null : 'building')} style={{ flex: 1, padding: '12px', backgroundColor: '#8b5a2b', color: '#fff', border: '2px solid #5c3a21', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
          <Hammer size={18} /> Üretim
        </button>
        <button onClick={() => setOpenModal(openModal === 'exploration' ? null : 'exploration')} style={{ flex: 1, padding: '12px', backgroundColor: '#8b5a2b', color: '#fff', border: '2px solid #5c3a21', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
          <Map size={18} /> Keşif
        </button>
      </div>

      <LogDisplay logs={logs} />
      <ActionPanel hasHook={hasHook} buildings={buildings} />

      {/* ========================================================= */}
      {/* SÜRÜKLENEBİLİR OYUN İÇİ PENCERE SİSTEMİ */}
      {/* ========================================================= */}
      {openModal !== null && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          pointerEvents: 'none', // YENİ: Arka plana tıklamayı serbest bırakır (Kanca atabilirsin)
          zIndex: 100
        }}>

          <div style={{
            position: 'absolute',
            left: `${modalPos.x}px`,
            top: `${modalPos.y}px`,
            backgroundColor: '#2d2d2d',
            borderRadius: '8px',
            width: '90%',
            maxWidth: '400px', // Pencere biraz daha küçültüldü
            border: '2px solid #5c3a21',
            boxShadow: '0 10px 30px rgba(0,0,0,0.8)',
            pointerEvents: 'auto', // Modalın kendisine tıklanmasına izin ver
            display: 'flex', flexDirection: 'column'
          }}>

            {/* SÜRÜKLENEBİLİR BAŞLIK KISMI */}
            <div
              onPointerDown={handlePointerDown}
              style={{
                backgroundColor: '#3e2723', padding: '10px 15px',
                borderTopLeftRadius: '6px', borderTopRightRadius: '6px',
                borderBottom: '2px solid #5c3a21',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                cursor: 'grab' // Sürüklenebilir imleci
              }}
            >
              <span style={{ color: '#d2b48c', fontWeight: 'bold', fontSize: '14px', letterSpacing: '1px' }}>
                {openModal === 'inventory' ? '🎒 ENVANTER' : openModal === 'building' ? '🔨 ÜRETİM' : '🗺️ KEŞİF'}
              </span>
              <button
                onClick={() => setOpenModal(null)}
                style={{ background: 'none', border: 'none', color: '#ff4757', cursor: 'pointer', padding: 0, display: 'flex' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* PENCERE İÇERİĞİ */}
            <div style={{ padding: '15px', maxHeight: '60vh', overflowY: 'auto' }}>
              {openModal === 'inventory' && <InventoryDisplay inventory={inventory} />}
              {openModal === 'building' && <BuildingPanel buildings={buildings} />}
              {openModal === 'exploration' && <DefenseExplorationPanel hasOar={hasOar} hasSpear={hasSpear} />}
            </div>

          </div>
        </div>
      )}

      {isGamePaused && <PauseMenu />}
    </div>
  );
}

export default App;