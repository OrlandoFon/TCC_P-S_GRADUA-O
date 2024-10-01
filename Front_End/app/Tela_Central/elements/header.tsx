import React from 'react';

function Header() {
    return (
        <header style={{ position: "relative", top: 0, width: "100%", backgroundColor: "#f6f8fb", padding: '10px 0', boxShadow: '0px 4px 12px rgba(0,0,0,0.1)' }}>
            <div style={{ padding: "5px", margin: "5px", color: '#333', fontWeight: 'bold', fontSize: '18px', textAlign: "center" }}>
                Dashboard de Monitoramento de Rolamentos em Máquinas e Dispositivos Indústriais
            </div>
        </header>
    );
}

export default Header;
