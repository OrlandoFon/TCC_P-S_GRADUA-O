import React, { useState } from 'react';
import { IconButton } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos, Dashboard, Settings, Person } from '@mui/icons-material'; // Ícones do Material UI

function Sidebar({ isOpen, toggleSidebar }) {
    return (
        <div
            style={{
                width: isOpen ? '250px' : '60px', // Largura da sidebar dependendo do estado
                height: 'calc(100vh - 80px)', // Ajusta a altura da sidebar entre o header e o footer
                backgroundColor: '#7269ef',
                color: 'white',
                transition: 'width 0.3s ease', // Suave transição na largura ao expandir/recolher
                overflow: 'hidden',
                borderRadius: '0 16px 16px 0',
                boxShadow: '2px 0px 5px rgba(0, 0, 0, 0.1)',
                paddingTop: '20px'
            }}
        >
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isOpen ? 'flex-start' : 'center',
                    padding: '10px',
                }}
            >
                <h3 style={{ margin: '20px 0', display: isOpen ? 'block' : 'none' }}>Menu</h3>
                <div style={{ display: 'flex', alignItems: 'center', margin: '10px 0' }}>
                    <Dashboard style={{ marginRight: isOpen ? '10px' : '0' }} />
                    {isOpen && <p>Dashboard</p>}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', margin: '10px 0' }}>
                    <Settings style={{ marginRight: isOpen ? '10px' : '0' }} />
                    {isOpen && <p>Opções</p>}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', margin: '10px 0' }}>
                    <Person style={{ marginRight: isOpen ? '10px' : '0' }} />
                    {isOpen && <p>Perfil</p>}
                </div>
            </div>

            {/* Botão de controle (seta) */}
            <IconButton
                onClick={toggleSidebar}
                style={{
                    position: 'absolute',
                    top: '80px',
                    left: isOpen ? '250px' : '60px', // Ajusta a posição do botão dependendo do estado
                    transition: 'left 0.3s ease',
                    backgroundColor: '#7269ef',
                    color: 'white',
                    boxShadow: '0px 2px 8px rgba(0,0,0,0.15)'
                }}
            >
                {isOpen ? <ArrowBackIos /> : <ArrowForwardIos />}
            </IconButton>
        </div>
    );
}

export default Sidebar;
