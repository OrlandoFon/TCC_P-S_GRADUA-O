const express = require('express');
const { exec } = require('child_process');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());  // Permite requests do frontend
app.use(bodyParser.json());  // Para processar o JSON recebido do frontend

// Rota que executa o script Python e retorna o resultado da análise de envelope
app.post('/analyze-envelope', (req, res) => {
    const sensorData = req.body.sensorData;

    if (!sensorData || !sensorData.length) {
        return res.status(400).json({ error: 'Dados de vibração inválidos' });
    }

    // Converte os dados de vibração para uma string JSON para passar ao script Python
    const input = JSON.stringify({ sensorData });

    // Executa o script Python e passa os dados como entrada
    const process = exec('python3 /home/orlandofonsecad/Documents/Yule_Walker_Method_Aplicado_ao_Problema.py', (error, stdout, stderr) => {
        if (error) {
            console.error(`Erro ao executar o script Python: ${error.message}`);
            return res.status(500).send('Erro ao executar a análise');
        }
        if (stderr) {
            console.error(`Erro do script Python: ${stderr}`);
            return res.status(500).send('Erro do script Python');
        }

        // Retorna a saída (stdout) como resposta JSON
        try {
            const result = JSON.parse(stdout);  // Converte a string JSON de volta ao objeto
            res.json(result);  // Envia o resultado para o frontend
        } catch (parseError) {
            console.error(`Erro ao converter para JSON: ${parseError}`);
            res.status(500).send('Erro ao processar resultado da análise');
        }
    });

    // Passa os dados de vibração via stdin para o script Python
    process.stdin.write(input);
    process.stdin.end();  // Finaliza o envio dos dados
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
