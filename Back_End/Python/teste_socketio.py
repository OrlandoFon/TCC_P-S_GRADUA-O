import socketio

# Cria um cliente Socket.IO
sio_client = socketio.Client()

# Evento que será chamado ao conectar com o servidor
@sio_client.event
def connect():
    print("Conectado ao servidor Socket.IO (porta 4000)")
    # Solicita a análise de envelope
    sio_client.emit('request_envelope_data')
    print("Solicitação de análise de envelope enviada.")

# Evento que será chamado ao receber os dados da análise de envelope
@sio_client.on('envelope_response')
def on_envelope_response(data):
    print("Dados da análise de envelope recebidos:")
    print(data)
    # Desconecta após receber os dados
    sio_client.disconnect()

# Evento que será chamado ao desconectar do servidor
@sio_client.event
def disconnect():
    print("Desconectado do servidor")

# Evento para lidar com falhas de conexão
@sio_client.event
def connect_error():
    print("Falha na conexão com o servidor Socket.IO")

# Evento para receber qualquer erro
@sio_client.event
def error(err):
    print(f"Erro recebido do servidor: {err}")

# Conecta ao servidor Socket.IO na porta 4000
try:
    sio_client.connect('http://localhost:4000')
    print("Conexão estabelecida. Aguardando resposta...")
    sio_client.wait()  # Aguarda indefinidamente até que a resposta seja recebida
except Exception as e:
    print(f"Erro ao conectar ao servidor: {e}")
