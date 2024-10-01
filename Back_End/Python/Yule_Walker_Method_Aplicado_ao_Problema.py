import numpy as np
import socketio
from scipy.signal import lfilter, butter, hilbert, hann
from scipy.fftpack import fft
from statsmodels.regression.linear_model import yule_walker
import scipy.stats
import matplotlib.pyplot as plt

# Inicializa o cliente Socket.IO
sio = socketio.Client()

# Parâmetros do experimento 3
samp_rate = 20e3  # 20 kHz
rpm = 2000  # Velocidade de rotação do eixo (RPM)
freq = [0.1217, 0.1617, 0.0072, 0.0559]  # Valores relativos das frequências características
bear_freq = [i * (rpm / 60) for i in freq]  # Frequências características dos rolamentos
max_p = 390  # Ordem máxima do modelo AR
wind_leng = [2**4, 2**5, 2**6, 2**7, 2**8]  # Comprimento da janela para STFT


# Função para processar os dados de vibração recebidos
def process_vibration_data(vibration_data):
    x = np.array([float(val) for val in vibration_data])  # Converte os dados recebidos para um array NumPy
    N = len(x)
    temp_kurt = []

    # Estimação do modelo AR e cálculo da kurtosis residual
    for p in range(1, max_p + 1):
        if p % 50 == 0:
            print(f'p = {p}')
        rho, sigma = yule_walker(x, order=p)
        X = np.zeros((N, p))
        for i in range(1, p + 1):
            X[i:, i - 1] = x[:N - i]

        if len(rho[1:]) == p:
            xp = -X @ rho[1:]
            e = x - xp  # Erro residual
            temp_kurt.append(scipy.stats.kurtosis(e[p:], fisher=False))
        else:
            temp_kurt.append(np.nan)

    # Seleção da ordem ótima do modelo AR
    opt_p = np.argmax(temp_kurt) + 1
    rho, sigma = yule_walker(x, order=opt_p)
    b = np.concatenate(([0], -rho[1:]))
    xp = lfilter(b, [1], x)
    e = x[opt_p:] - xp[opt_p:]

    # Demodulação da banda selecionada (STFT & SK)
    Ne = len(e)
    num_freq = max(wind_leng) + 1  # Define o número de frequências baseado no comprimento máximo da janela
    spec_kurt = np.zeros((len(wind_leng), num_freq))  # Inicializa spec_kurt como uma matriz de zeros
    lgd = []  # Lista para armazenar as legendas das janelas

    # Loop sobre os diferentes tamanhos de janela definidos em wind_leng
    for i, wind_len in enumerate(wind_leng):
        wind_func = hann(wind_len)  # Função de janela Hanning
        num_overlap = np.fix(wind_len // 2)  # Define o número de sobreposições como metade do tamanho da janela
        num_wind = int(np.fix((Ne - num_overlap) // (wind_len - num_overlap)))  # Converte num_wind para inteiro
        n = np.arange(0, wind_len)  # Define o vetor de índices para a janela atual
        STFT = np.zeros((num_wind, num_freq))  # Inicializa a matriz para armazenar o STFT

        # Loop sobre cada janela para calcular a STFT
        for t in range(num_wind):
            stft = fft(e[n] * wind_func, 2 * (num_freq - 1))  
            stft = np.abs(stft[:num_freq]) / wind_len / np.sqrt(np.mean(wind_func**2)) * 2  
            STFT[t, :] = stft  # Armazena o STFT na matriz
            n += wind_len - int(num_overlap)

        # Cálculo da kurtosis espectral para cada frequência
        for j in range(num_freq):
            spec_kurt[i, j] = np.mean(np.abs(STFT[:, j])**4) / (np.mean(np.abs(STFT[:, j])**2)**2) - 2

        # Armazenar a legenda correspondente ao tamanho da janela
        lgd.append(f'window size = {wind_len}')

    # Salvar o gráfico da kurtosis espectral
    plt.figure(1)
    freq = np.arange(0, num_freq) / (2 * (num_freq - 1)) * samp_rate
    plt.plot(freq, spec_kurt.T)
    plt.xlabel('Frequency [Hz]')
    plt.ylabel('Spectral kurtosis')
    plt.xlim([0, samp_rate / 2])
    plt.legend(lgd, loc='best')
    plt.savefig('spectral_kurtosis.png')  # Salva o gráfico como arquivo de imagem
    plt.close()

    # Análise de envelope
    freq_rang = [2000, 3000]
    normalized_freq_rang = [freq / (samp_rate / 2) for freq in freq_rang]
    b, a = butter(2, normalized_freq_rang, btype='bandpass')
    X = lfilter(b, a, e)

    # Demodulação e FFT do envelope
    aX = hilbert(X)
    envel = np.abs(aX) - np.mean(np.abs(aX))
    fft_envel = np.abs(fft(envel)) / Ne * 2
    fft_envel = fft_envel[:int(np.ceil(N / 2))]

    # Salvar o gráfico do espectro do envelope
    plt.figure(2)
    freq = np.arange(0, Ne) / Ne * samp_rate
    freq = freq[:int(np.ceil(N / 2))]
    plt.stem(freq, fft_envel, linefmt='-', markerfmt='o', basefmt=' ')
    plt.xlabel('Frequency [Hz]')
    plt.ylabel('Amplitude [g]')
    plt.xlim([0, max(bear_freq) * 1.8])
    plt.grid(True)
    for bf in bear_freq:
        plt.axvline(x=bf, linestyle='--', color='r')
    plt.legend(['Envelope spectrum', 'BPFO', 'BPFI', 'FTF', 'BSF'])
    plt.savefig('envelope_spectrum.png')  # Salva o gráfico como arquivo de imagem
    plt.close()

# Define o que acontece ao conectar ao WebSocket
@sio.event
def connect():
    print('Conectado ao WebSocket')

# Define o que acontece quando os dados de vibração são recebidos
@sio.on('requested_data')
def on_message(data):
    # Processa os dados recebidos
    print("Recebendo dados...")
    process_vibration_data(data)
    print("Gráficos salvos como 'spectral_kurtosis.png' e 'envelope_spectrum.png'")

# Conecta ao servidor WebSocket
sio.connect('http://localhost:3002')

# Mantém a conexão aberta
sio.wait()
