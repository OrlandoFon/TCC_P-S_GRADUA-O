import React, { useState } from 'react';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import Graphs from './graphs';
import Sidebar from './sidebar';
import Calendar from './calendar'; // Importa o componente Calendar

function Main({ 
    sensorData, fftData, failurefrequencyData, graphType, handleGraphTypeChange, timeRange, handleTimeRangeChange 
}) {
    const [isOpen, setIsOpen] = useState(false); // Estado para controlar se o sidebar está aberto ou fechado
    const [showCalendar, setShowCalendar] = useState(false); // Estado para alternar entre gráfico e calendário
    const [fade, setFade] = useState('fade-in'); // Estado para controlar a transição de fade

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    // Alterna entre mostrar o calendário e o gráfico
    const toggleContent = () => {
        setFade('fade-out'); // Inicia o fade out

        setTimeout(() => {
            setShowCalendar(!showCalendar); // Alterna entre calendário e gráfico
            setFade('fade-in'); // Inicia o fade in após 0.5s
        }, 500); // Tempo de transição de 500ms
    };

    return (
        <main style={{ display: "flex", justifyContent: "center", alignItems: "flex-start", textAlign: "center", minHeight: "90vh", backgroundColor: "#f6f8fb" }}>
            <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} /> {/* Usa o componente Sidebar */}

            {/* Botão de alternância de conteúdo no meio do lado direito */}
            <div
                onClick={toggleContent}
                style={{
                    position: 'absolute',
                    top: '50%', // Coloca o botão no meio verticalmente
                    right: '15px', // Posiciona o botão à direita
                    transform: 'translateY(-50%)', // Centraliza verticalmente
                    width: '50px',
                    height: '50px',
                    backgroundColor: '#7269ef',
                    borderRadius: '50%', // Faz o botão ser um círculo
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'pointer',
                    boxShadow: '0px 2px 8px rgba(0,0,0,0.15)'
                }}
            >
                <span style={{
                    fontSize: '24px',
                    color: 'white',
                    transform: showCalendar ? 'rotate(180deg)' : 'none', // Alterna a direção da seta
                    transition: 'transform 0.3s ease' // Animação suave para rotação
                }}>
                    →
                </span>
            </div>

            {/* Texto abaixo da seta, mostrando se é "Calendário" ou "Gráfico" */}
            <div
                style={{
                    position: 'absolute',
                    top: 'calc(50% + 30px)', // Posição logo abaixo da seta
                    right: '5px', // Certifica que o texto não ultrapasse os limites à direita
                    maxWidth: '120px', // Define um limite máximo de largura para o texto
                    textAlign: 'center', // Centraliza o texto
                    color: '#333',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    whiteSpace: 'nowrap', // Evita que o texto quebre em várias linhas
                    overflow: 'hidden', // Garante que o texto não ultrapasse os limites
                    textOverflow: 'ellipsis', // Adiciona reticências caso o texto seja muito longo
                }}
            >
                {showCalendar ? 'Gráfico' : 'Calendário'}
            </div>

            {/* Conteúdo principal com transição de fade */}
            <div
                style={{
                    flex: 1,
                    marginRight: "100px",
                    marginLeft: "50px",
                    marginTop:"50px",
                    padding: '30px',
                    borderRadius: "16px",
                    backgroundColor: "white",
                    boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.1)",
                    opacity: fade === 'fade-in' ? 1 : 0,
                    transition: 'opacity 0.5s ease', // Transição suave para fade in/out
                }}
            >
                {showCalendar ? (
                    <Calendar /> // Mostra o calendário quando showCalendar é verdadeiro
                ) : (
                    <>
                        <ToggleButtonGroup
                            value={graphType}
                            exclusive
                            onChange={handleGraphTypeChange}
                            aria-label="Graph Type"
                            style={{ marginBottom: '20px', marginTop: "20px" }}
                        >
                            <ToggleButton value="vibration" aria-label="Vibration Graph">
                                Vibração
                            </ToggleButton>
                            <ToggleButton value="fft" aria-label="FFT Graph">
                                FFT
                            </ToggleButton>
                        </ToggleButtonGroup>

                        <Graphs
                            graphType={graphType}
                            sensorData={sensorData}
                            fftData={fftData}
                            failurefrequencyData={failurefrequencyData}
                            timeRange={timeRange}
                            handleTimeRangeChange={handleTimeRangeChange}
                        />
                    </>
                )}
            </div>
        </main>
    );
}

export default Main;