import React from "react";

const LogDisplay = ({ logs }) => {
    return (
        <div style={{ height: '220px', overflowY: 'auto', backgroundColor: '#0a0a0a', padding: '15px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #333' }}>
            {logs.map((log, index) => (
                <p key={index} style={{ margin: '0 0 12px 0', color: index === 0 ? '#fff' : '#555', fontSize: '15px', lineHeight: '1.4' }}>
                    <span style={{ color: '#2ed573', marginRight: '8px' }}>{">"}</span> {log}
                </p>
            ))}
        </div>
    );
};

export default LogDisplay;