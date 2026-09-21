import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { gameTick } from "./store/gameSlice";
import { X, Backpack, Hammer, Map } from "lucide-react";

import MainMenu from "./components/menu/MainMenu";
import PauseMenu from "./components/menu/PauseMenu";
import GameOver from "./components/menu/GameOver";
import VictoryScreen from "./components/menu/VictoryScreen";

import GameHeader from "./components/game/GameHeader";
import InventoryDisplay from "./components/game/InventoryDisplay";
import BuildingPanel from "./components/game/BuildingPanel";
import DefenseExplorationPanel from "./components/game/DefenseExplorationPanel";
import LogDisplay from "./components/game/LogDisplay";
import ActionPanel from "./components/game/ActionPanel";
import MerchantEvent from "./components/game/MerchantEvent";
import FishingMiniGame from './components/game/FishingMiniGame';

function App() {
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      dispatch(gameTick());
    }, 3000);
    return () => clearInterval(timer);
  }, [dispatch]);

  const { vitals, inventory, logs, isGameStarted, isGameOver, isGameWon, buildings, equipment, isGamePaused, isFishingMode, weather, time } = useSelector((state) => state.game);

  const safeEquipment = Array.isArray(equipment) ? equipment : [];
  const hasSpear = safeEquipment.some(item => item.itemId === 'spear');
  const hasOar = safeEquipment.some(item => item.itemId === 'oar');
  const hasHook = safeEquipment.some(item => item.itemId === 'hook');

  const isNight = time >= 20 || time < 6;
  const isStormy = weather === 'stormy';
  const isRainy = weather === 'rainy';

  const getAtmosphereBg = () => {
    if (isNight) {
      if (isStormy) return 'linear-gradient(180deg, #090c14 0%, #030408 100%)';
      if (isRainy) return 'linear-gradient(180deg, #0c1018 0%, #05080f 100%)';
      return 'linear-gradient(180deg, #0f1422 0%, #080a12 100%)';
    } else {
      if (isStormy) return 'linear-gradient(180deg, #161b24 0%, #0d1117 100%)';
      if (isRainy) return 'linear-gradient(180deg, #18232c 0%, #0e151b 100%)';
      return 'linear-gradient(180deg, #1a2932 0%, #111b21 100%)';
    }
  };

  if (!isGameStarted) return <MainMenu />;
  if (isGameOver) return <GameOver />;
  if (isGameWon) return <VictoryScreen />;

  return (
    <div style={{
      width: '100%',
      maxWidth: '460px',
      height: '100dvh',
      maxHeight: '100dvh',
      margin: '0 auto',
      padding: '10px',
      background: getAtmosphereBg(),
      transition: 'background 1.5s ease',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Atmosfer Katmanları */}
      {isNight ? <div className="night-ambiance" /> : <div className="day-ambiance" />}
      {isRainy && <div className="rain-layer" />}
      {isStormy && (
        <>
          <div className="rain-layer storm" />
          <div className="lightning-layer" />
        </>
      )}

      {/* Sal & Ana Oyun Alanı (Okyanus Salınımı) */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        flex: 1,
        minHeight: 0,
        animation: isStormy ? 'oceanSwayStorm 3.5s ease-in-out infinite' : 'oceanSwayCalm 7s ease-in-out infinite',
        transformOrigin: 'center center',
        zIndex: 3
      }}>
        <GameHeader vitals={vitals} />

        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => setOpenModal(openModal === 'inventory' ? null : 'inventory')} style={{ flex: 1, padding: '10px', backgroundColor: '#8b5a2b', color: '#fff', border: '2px solid #5c3a21', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', fontSize: '14px' }}>
            <Backpack size={16} /> Çanta
          </button>
          <button onClick={() => setOpenModal(openModal === 'building' ? null : 'building')} style={{ flex: 1, padding: '10px', backgroundColor: '#8b5a2b', color: '#fff', border: '2px solid #5c3a21', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', fontSize: '14px' }}>
            <Hammer size={16} /> Üretim
          </button>
          <button onClick={() => setOpenModal(openModal === 'exploration' ? null : 'exploration')} style={{ flex: 1, padding: '10px', backgroundColor: '#8b5a2b', color: '#fff', border: '2px solid #5c3a21', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', fontSize: '14px' }}>
            <Map size={16} /> Keşif
          </button>
        </div>

        <MerchantEvent />
        <LogDisplay logs={logs} />
        <ActionPanel hasHook={hasHook} buildings={buildings} />
      </div>

      {/* SABİT, MERKEZİ VE MOBİL UYUMLU PENCERE SİSTEMİ */}
      {openModal !== null && (
        <div
          onClick={() => setOpenModal(null)}
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            zIndex: 100,
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            padding: '20px'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#2d2d2d',
              borderRadius: '8px',
              width: '100%',
              maxWidth: '450px',
              border: '2px solid #5c3a21',
              boxShadow: '0 10px 40px rgba(0,0,0,0.9)',
              display: 'flex', flexDirection: 'column',
              maxHeight: '85vh',
              height: openModal === 'building' ? '510px' : undefined,
              overflow: 'hidden'
            }}
          >

            {/* SABİT BAŞLIK KISMI */}
            <div style={{
              backgroundColor: '#3e2723', padding: '15px',
              borderTopLeftRadius: '6px', borderTopRightRadius: '6px',
              borderBottom: '2px solid #5c3a21',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              flexShrink: 0
            }}
            >
              <span style={{ color: '#d2b48c', fontWeight: 'bold', fontSize: '15px', letterSpacing: '1px' }}>
                {openModal === 'inventory' ? '🎒 ENVANTER' : openModal === 'building' ? '🔨 ÜRETİM' : '🗺️ KEŞİF'}
              </span>
              <button
                onClick={() => setOpenModal(null)}
                style={{ background: 'none', border: 'none', color: '#ff4757', cursor: 'pointer', padding: 0, display: 'flex' }}
              >
                <X size={24} />
              </button>
            </div>

            {/* PENCERE İÇERİĞİ */}
            <div style={{
              padding: openModal === 'building' ? '15px 10px 15px 15px' : '15px',
              overflowY: openModal === 'building' ? 'hidden' : 'auto',
              flex: 1,
              minHeight: 0,
              display: 'flex',
              flexDirection: 'column'
            }}>
              {openModal === 'inventory' && <InventoryDisplay inventory={inventory} />}
              {openModal === 'building' && <BuildingPanel buildings={buildings} />}
              {openModal === 'exploration' && <DefenseExplorationPanel hasOar={hasOar} hasSpear={hasSpear} />}
            </div>

          </div>
        </div>
      )}

      {isFishingMode && <FishingMiniGame />}
      {isGamePaused && <PauseMenu />}
    </div>
  );
}

export default App;