import React from "react";
import { ChevronRight } from "lucide-react";

const LogDisplay = ({ logs }) => (
    <div style={{
        backgroundColor: '#2e1c14',
        border: '2px solid #5c3a21',
        borderRadius: '8px',
        padding: '10px 12px',
        flex: 1,
        minHeight: 0,
        overflowY: 'auto',
        boxShadow: 'inset 0 0 15px rgba(0,0,0,0.8)'
    }}>
        {logs.map((log, index) => (
            <div key={index} style={{
                color: index === 0 ? '#fff' : '#d2b48c',
                marginBottom: '8px', fontSize: '13px', lineHeight: '1.4',
                display: 'flex', gap: '6px', opacity: index === 0 ? 1 : 0.6
            }}>
                <ChevronRight size={15} style={{ minWidth: '15px', marginTop: '2px', color: '#8b5a2b' }} />
                <span>{log}</span>
            </div>
        ))}
    </div>
);

export default LogDisplay;