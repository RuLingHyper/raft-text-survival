import React from "react";
import { useDispatch } from "react-redux";
import { pauseGame } from "../../store/gameSlice";
import { Pause } from "lucide-react";

const GameHeader = () => {
    const dispatch = useDispatch();
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ color: '#0fbcf9', margin: 0, letterSpacing: '2px' }}>KAYIP SAL</h2>
            <button
                onClick={() => dispatch(pauseGame())}
                style={{ padding: '8px 15px', backgroundColor: '#333', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
            >
                <Pause size={18} /> Durdur
            </button>
        </div>
    );
};
export default GameHeader;