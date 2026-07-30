import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { gameTick } from "./store/gameSlice";

import MainMenu from "./components/menu/MainMenu";
import PauseMenu from "./components/menu/PauseMenu";
import GameOver from "./components/menu/GameOver";
import GameHeader from "./components/game/GameHeader";
import VitalsBar from "./components/game/VitalsBar";
import InventoryDisplay from "./components/game/InventoryDisplay";
import BuildingPanel from "./components/game/BuildingPanel";
import DefenseExplorationPanel from "./components/game/DefenseExplorationPanel";
import LogDisplay from "./components/game/LogDisplay";
import ActionPanel from "./components/game/ActionPanel";


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

  // ANA MENÜ
  if (!isGameStarted) {
    return <MainMenu />;
  }

  // PAUSE MENÜ
  if (isGamePaused) {
    return <PauseMenu />;
  }

  // GAME OVER MENÜ
  if (isGameOver) {
    return <GameOver />;
  }

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px', backgroundColor: '#1e1e1e', borderRadius: '10px' }}>

      <GameHeader />

      <VitalsBar vitals={vitals} />

      <InventoryDisplay inventory={inventory} />

      <BuildingPanel buildings={buildings} />

      <DefenseExplorationPanel hasOar={hasOar} hasSpear={hasSpear} />

      <LogDisplay logs={logs} />

      <ActionPanel hasHook={hasHook} buildings={buildings} />

    </div>
  );
}

export default App;