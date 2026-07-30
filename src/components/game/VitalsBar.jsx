import React from "react";
import { Heart, Utensils, Droplets } from "lucide-react";

const VitalsBar = ({ vitals }) => {
    return (
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
    );
};
export default VitalsBar;