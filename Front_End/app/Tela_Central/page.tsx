"use client"
import React, { useEffect, useState } from 'react';
import Header from './elements/header';
import Main from './elements/main';
import Footer from './elements/footer';
import { io } from 'socket.io-client';

// Conectando ao WebSocket de vibração e FFT
const socket = io('http://localhost:3002');

function TELA_CENTRAL() {
    const [sensorData, setSensorData] = useState<number[]>([]);
    const [fftData, setFftData] = useState(null);
    const [failurefrequencyData, setFailureFrequencyData] = useState(null);
    const [graphType, setGraphType] = useState('vibration');
    const [timeRange, setTimeRange] = useState(20);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    useEffect(() => {
        const fetchData = () => {
            if (!isAnalyzing) {
                socket.emit('request_data');
            }
        };

        fetchData();
        const intervalId = setInterval(fetchData, 60000); // Atualiza os dados a cada minuto

        return () => {
            clearInterval(intervalId);
        };
    }, [isAnalyzing]);

    useEffect(() => {
        socket.on('requested_data', (data) => {
            if (!isAnalyzing) {
                setSensorData(data.map(Number));
            }
        });

        return () => {
            socket.off('requested_data');
        };
    }, [isAnalyzing]);

    useEffect(() => {
        if (sensorData.length > 0 && !isAnalyzing) {
            setIsAnalyzing(true);
            fetch('http://localhost:5000/analyze-envelope', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ sensorData }),
            })
                .then((response) => response.json())
                .then((data) => {
                    setFftData(data.fft);
                    setFailureFrequencyData(data.bear_freq);
                    setIsAnalyzing(false);
                })
                .catch((error) => {
                    console.error('Erro ao obter análise de envelope:', error);
                    setIsAnalyzing(false);
                });
        }
    }, [sensorData, isAnalyzing]);

    const handleGraphTypeChange = (event, newGraphType) => {
        setGraphType(newGraphType);
    };

    const handleTimeRangeChange = (event, newValue) => {
        setTimeRange(newValue);
    };

    return (
        <>
            <Header />
            <Main
                sensorData={sensorData}
                fftData={fftData}
                failurefrequencyData={failurefrequencyData}
                graphType={graphType}
                handleGraphTypeChange={handleGraphTypeChange}
                timeRange={timeRange}
                handleTimeRangeChange={handleTimeRangeChange}
            />
            <Footer />
        </>
    );
}

export default TELA_CENTRAL;