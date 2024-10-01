import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Typography, Slider } from '@mui/material';
import ReactLoading from 'react-loading';

// Componente Filho responsável por exibir os gráficos
const Graphs = ({ graphType, sensorData, fftData, failurefrequencyData, timeRange, handleTimeRangeChange }) => {
    
    // Função para filtrar os dados e manter apenas os últimos 'timeRange' minutos
    const getLastMinutesData = (rangeInMinutes) => {
        const totalData = sensorData.length;
        const dataPerMinute = 60;  // Assumindo uma medição por segundo
        const lastMinutesData = sensorData.slice(Math.max(totalData - dataPerMinute * rangeInMinutes, 0));
        return lastMinutesData.map((data, index) => ({
            time: index + 1,
            vibration: data
        }));
    };

    // Gráfico de Vibração x Tempo
    const renderVibrationGraph = () => {
        if (!sensorData || sensorData.length === 0) {
            return (
                <div style={{display: "flex", flexDirection: "column", alignContent: "center", justifyContent: "center", alignItems: "center", justifyItems: "center"}}>
                    <p>Aguardando dados do sensor de vibração...</p>
                    <ReactLoading type={"bars"} color={"black"} height={200} width={200} />
                </div>
            );
        }

        return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={getLastMinutesData(timeRange)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" label={{ value: 'Time (s)', position: 'insideBottomRight', offset: 0 }} />
                <YAxis label={{ value: 'Vibration', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="vibration" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
        </ResponsiveContainer>
        );
     };

    // Gráfico da FFT com as linhas de amplitude e limitação de eixo X
    const renderFFTGraph = () => {
        if (!fftData) {
            return (
                <div style={{display: "flex", flexDirection: "column", alignContent: "center", justifyContent: "center", alignItems: "center", justifyItems: "center"}}>
                    <p>Aguardando dados da FFT...</p>
                    <ReactLoading type={"bars"} color={"black"} height={200} width={200} />
                </div>
            );
        }

        // Limita os dados do FFT aos primeiros 2000 pontos
        const fftGraphData = fftData.frequencies.slice(0, 2000).map((freq, index) => ({
            frequency: freq,
            amplitude: fftData.amplitudes[index],
        }));

        // Frequências e amplitudes das falhas (BPFO, BPFI, FTF, BSF)
        const failureFrequencies = [
            { label: 'BPFO', amplitude: failurefrequencyData[0], strokeColor: "#ff7300" },
            { label: 'BPFI', amplitude: failurefrequencyData[1], strokeColor: "#387908" },
            { label: 'FTF', amplitude: failurefrequencyData[2], strokeColor: "#8884d8" },
            { label: 'BSF', amplitude: failurefrequencyData[3], strokeColor: "#82ca9d" }
        ];

        return (
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={fftGraphData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="frequency"
                        label={{ value: 'Frequency (Hz)', position: 'insideBottomRight', offset: 0 }}
                    />
                    <YAxis label={{ value: 'Amplitude', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    {/* Gráfico FFT */}
                    <Line type="stepAfter" dataKey="amplitude" name="FFT" stroke="#8884d8" activeDot={{ r: 8 }} />

                    {/* Linhas verticais para BPFO, BPFI, FTF, BSF */}
                    {failureFrequencies.map(failure => (
                        <ReferenceLine
                            key={failure.label}
                            x={failure.amplitude}
                            stroke={failure.strokeColor}
                            label={{ value: failure.label, position: 'top', fill: '#666' }}
                            strokeWidth={2}
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        );
    };

    // Renderiza o gráfico selecionado (Vibração ou FFT com amplitudes)
    return (
        <>
            {/* Slider para selecionar o intervalo de tempo */}
            {graphType === 'vibration' && sensorData && sensorData.length > 0 && (
                <div style={{ marginBottom: '20px', width: '80%', margin: '0 auto' }}>
                    <Typography gutterBottom>Intervalo de tempo (minutos): {timeRange}</Typography>
                    <Slider
                        value={timeRange}
                        onChange={handleTimeRangeChange}
                        aria-labelledby="time-range-slider"
                        step={1}
                        marks
                        min={1}
                        max={20}
                    />
                </div>
            )}

            {/* Gráfico de vibração ou FFT */}
            <div style={{ width: '80%', height: '400px', maxWidth: '1200px', margin: '0 auto' }}>
                {graphType === 'vibration' && renderVibrationGraph()}
                {graphType === 'fft' && renderFFTGraph()}
            </div>
        </>
    );
};

export default Graphs;
