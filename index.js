const fs = require('fs');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { handleMessage } = require('./services/messageHandler');
const { logMessage } = require('./services/logger');
const { rateLimiter } = require('./services/rateLimiter');
const { cleanSessions } = require('./services/sessions'); // Importa a limpeza de sessões

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process',
            '--disable-gpu'
        ]
    }
});

// Gera QR Code no terminal
client.on('qr', qr => qrcode.generate(qr, { small: true }));

// Bot está pronto
client.on('ready', () => {
    console.log('Bot conectado!');
    // Inicia a limpeza periódica de sessões inativas
    setInterval(cleanSessions, 3600000); // A cada hora
});

// Evento de mensagem recebida
client.on('message', async message => {
    const { from, body } = message;

    // Verificação melhorada para mensagens de grupo
    if (from.endsWith('@g.us')) {
        return;
    }

    // Verifica rate limiting
    if (!rateLimiter.isAllowed(from)) return;

    // Log da mensagem
    logMessage(from, body);

    // Adiciona atrasos humanos antes do processamento
    await humanLikeDelay();

    // Processa a mensagem
    try {
        await handleMessage(message);
    } catch (error) {
        console.error('Erro ao processar mensagem:', error);
    }
});

// Sai automaticamente de novos grupos (comportamento anti-ban)
client.on('group_join', async (notification) => {
    const { id, recipientIds } = notification;
    
    // Adiciona atraso aleatório antes de sair (2-10 segundos)
    await randomDelay(2000, 10000);
    
    if (recipientIds.includes(client.info.wid._serialized)) {
        console.log(`Saindo do grupo: ${id}`);
        await client.groupLeave(id);
    }
});

// Inicializa o cliente
client.initialize();

// Funções de comportamento humano
async function humanLikeDelay() {
    await randomDelay(1000, 5000); // Atraso base
    if (Math.random() > 0.7) {
        await randomDelay(500, 1500); // Atraso adicional 30% das vezes
    }
}

function randomDelay(min = 500, max = 3000) {
    const delay = Math.floor(Math.random() * (max - min + 1)) + min;
    return new Promise(resolve => setTimeout(resolve, delay));
}