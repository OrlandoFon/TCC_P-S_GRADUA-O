var serialport = require('serialport');

//Cria o web-socket em uma porta local e habilita cors
const io = require('socket.io')(3002, {
    cors: {
        origin: '*'
    }
});
//Define variavel SerialPort
var SerialPort = serialport.SerialPort;
//Realiza a abertura da porta serial virtual
var port = new SerialPort({
    path:"/dev/pts/12",
    baudRate: 9600,
});

//Realiza a leitura dos dados vindos da porta serial virtual
const parser = port.pipe(new serialport.ReadlineParser({ delimiter: '\r\n' }))

//Cria uma lista e armazena nesta os dados vindos da porta serial virtual
let bearing_data = []
parser.on("data", function(data){
    bearing_data.push(data)
})

//Estabelece uma conexão bidimensional com o cliente e envia os dados coletados do rolamento
io.on('connection', (socket) => {
console.log('A user connected!');
socket.on('request_data', msg => {
io.emit('requested_data', bearing_data); 
});})

