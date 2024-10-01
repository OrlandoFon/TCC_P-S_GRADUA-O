import numpy as np
import scipy.io
from scipy.signal import lfilter, butter, hilbert, hann
from scipy.fftpack import fft
from statsmodels.regression.linear_model import yule_walker
from statsmodels.tsa.ar_model import AutoReg
import scipy.stats
import matplotlib.pyplot as plt

# =============== PROBLEM DEFINITION ===========================
# Carregar dados da simulação
raw_data = scipy.io.loadmat('/media/ubuntu_storage/Projeto_Aplicado_XP/Dados/diagnostics101_data/bearing270.mat')
samp_rate = 12e3  # Taxa de amostragem (Hz)
rpm = 1796  # Velocidade de rotação do eixo (RPM)
freq = [3.053, 4.947, 0.382, 1.994]
bear_freq = [i * (rpm / 60) for i in freq]  # Frequências características dos rolamentos
max_p = 82  # Ordem máxima do modelo AR
wind_leng = [2**4, 2**5, 2**6]  # Comprimento da janela para STFT

# =============== Discrete signal separation (AR model) ==================
x = raw_data['vib'].flatten()
N = len(x)
temp_kurt = []

# Estimação do modelo AR e cálculo da kurtosis residual
for p in range(1, max_p + 1):
    if p % 50 == 0:
        print(f'p = {p}')
    rho, sigma = yule_walker(x, order=p)
    
    # Constructing the AR model output with correct dimensions
    X = np.zeros((N, p))
    for i in range(1, p + 1):
        X[i:, i - 1] = x[:N - i]
    
    # Ensure rho[1:] matches dimensions of X
    if len(rho[1:]) == p:
        xp = -X @ rho[1:]  # AR model prediction (rho[1:] skips the intercept term)
        e = x - xp  # Error
        temp_kurt.append(kurtosis(e[p:], fisher=False))  # Computing kurtosis
    else:
        temp_kurt.append(np.nan)  # Append NaN if dimensions don't match

# Seleção da ordem ótima do modelo AR com base na kurtosis máxima
opt_p = np.argmax(temp_kurt) + 1
print(opt_p)
rho, sigma = yule_walker(x, order=opt_p)
b = np.concatenate(([0], -rho[1:]))
xp = lfilter(b, [1], x)
e = x[opt_p:] - xp[opt_p:]

# ============ Demodulation band selection (STFT & SK) =================
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
        # Calcula a FFT da janela atual multiplicada pela função de janela
        stft = fft(e[n] * wind_func, 2 * (num_freq - 1))  
        # Normaliza a STFT com base na média da janela para um ajuste mais preciso
        stft = np.abs(stft[:num_freq]) / wind_len / np.sqrt(np.mean(wind_func**2)) * 2  
        STFT[t, :] = stft  # Armazena o STFT na matriz
        n += wind_len - int(num_overlap)  # Move a janela para frente

    # Cálculo da kurtosis espectral para cada frequência
    for j in range(num_freq):
        # Ajuste na fórmula para maior precisão, garantindo alinhamento com a descrição do artigo
        spec_kurt[i, j] = np.mean(np.abs(STFT[:, j])**4) / (np.mean(np.abs(STFT[:, j])**2)**2) - 2

    # Armazenar a legenda correspondente ao tamanho da janela
    lgd.append(f'window size = {wind_len}')

# Plotagem dos resultados de kurtosis espectral
plt.figure(1)
freq = np.arange(0, num_freq) / (2 * (num_freq - 1)) * samp_rate
plt.plot(freq, spec_kurt.T)
plt.xlabel('Frequency [Hz]')
plt.ylabel('Spectral kurtosis')
plt.xlim([0, samp_rate / 2])
plt.legend(lgd, loc='best')
plt.show()

# Input para seleção da banda de passagem - ajustado conforme figura
freq_rang = [5.3e3, 5.9e3]  # Banda ajustada conforme exemplo do artigo
normalized_freq_rang = [freq / (samp_rate / 2) for freq in freq_rang]  # Normaliza as frequências para o filtro
b, a = butter(2, normalized_freq_rang, btype='bandpass')
X = lfilter(b, a, e)

# ======================= Envelope analysis ============================
aX = hilbert(X)
envel = np.abs(aX) - np.mean(np.abs(aX))
fft_envel = np.abs(fft(envel)) / Ne * 2
fft_envel = fft_envel[:int(np.ceil(N / 2))]

# Plotagem do espectro do envelope
plt.figure(2)
freq = np.arange(0, Ne) / Ne * samp_rate
freq = freq[:int(np.ceil(N / 2))]
plt.stem(freq, fft_envel, linefmt='-', markerfmt='o', basefmt=' ')
plt.xlabel('Frequency [Hz]')
plt.ylabel('Amplitude [g]')
plt.xlim([0, max(bear_freq) * 1.8])
plt.grid(True)

# Plotagem das frequências características dos rolamentos
for bf in bear_freq:
    plt.axvline(x=bf, linestyle='--', color='r')
plt.legend(['Envelope spectrum', 'BPFO', 'BPFI', 'FTF', 'BSF'])
plt.show()