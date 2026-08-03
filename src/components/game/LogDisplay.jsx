import React from "react";
import { ChevronRight } from "lucide-react";

const LogDisplay = ({ logs }) => (
    <div style={{
        backgroundColor: '#2e1c14', // Koyu ahşap/gemi güvertesi
        border: '2px solid #5c3a21',
        borderRadius: '8px', padding: '15px', height: '200px', overflowY: 'auto', marginBottom: '20px',
        boxShadow: 'inset 0 0 15px rgba(0,0,0,0.8)'
    }}>
        {logs.map((log, index) => (
            <div key={index} style={{
                color: index === 0 ? '#fff' : '#d2b48c', // Son olay beyaz, eskiler soluk ahşap sarısı
                marginBottom: '10px', fontSize: '14px', lineHeight: '1.4',
                display: 'flex', gap: '8px', opacity: index === 0 ? 1 : 0.6
            }}>
                <ChevronRight size={16} style={{ minWidth: '16px', marginTop: '2px', color: '#8b5a2b' }} />
                <span>{log}</span>
            </div>
        ))}
    </div>
);

export default LogDisplay;