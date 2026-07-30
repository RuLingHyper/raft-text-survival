import React from "react";

const InventoryDisplay = ({ inventory }) => {
    return (
        <div style={{ marginBottom: '20px', display: 'flex', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            <div style={{ padding: '15px', backgroundColor: '#2d2d2d', borderRadius: '8px', textAlign: 'center', flex: 1 }}>
                <span style={{ color: '#888', display: 'block', marginBottom: '5px', fontSize: '14px' }}>Tahta</span>
                <strong style={{ fontSize: '24px', color: '#fff' }}>{inventory.wood}</strong>
            </div>
            <div style={{ padding: '15px', backgroundColor: '#2d2d2d', borderRadius: '8px', textAlign: 'center', flex: 1 }}>
                <span style={{ color: '#888', display: 'block', marginBottom: '5px', fontSize: '14px' }}>Plastik</span>
                <strong style={{ fontSize: '24px', color: '#fff' }}>{inventory.plastic}</strong>
            </div>
            <div style={{ padding: '15px', backgroundColor: '#2d2d2d', borderRadius: '8px', textAlign: 'center', flex: 1 }}>
                <span style={{ color: '#888', display: 'block', marginBottom: '5px', fontSize: '14px' }}>Yaprak</span>
                <strong style={{ fontSize: '24px', color: '#1dd1a1' }}>{inventory.leaf}</strong>
            </div>
            <div style={{ padding: '15px', backgroundColor: '#2d2d2d', borderRadius: '8px', textAlign: 'center', flex: 1 }}>
                <span style={{ color: '#888', display: 'block', marginBottom: '5px', fontSize: '14px' }}>Metal</span>
                <strong style={{ fontSize: '24px', color: '#feca57' }}>{inventory.metal}</strong>
            </div>
        </div>
    );
};

export default InventoryDisplay;