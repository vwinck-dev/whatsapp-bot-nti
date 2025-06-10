// services/messageHandler.js
const config = require('../config');
const { getSession, setStep, resetSession } = require('./sessions');
const { randomDelay } = require('./utils');

// Função principal para lidar com mensagens
const handleMessage = async (message) => {
    const text = message.body.trim().toLowerCase();
    const from = message.from;

    try {
        // Obtém sessão com timestamp atualizado
        const session = await getSession(from);
        
        // Comportamento humano: Digitação simulada
        await simulateTyping(message);

        // Verifica comandos de reset
        if (config.resetCommands.includes(text)) {
            await resetAndReply(message, from, "♻️ Voltando ao menu principal...");
            return;
        }

        // Obtém estado atual
        const currentState = config.states[session.step] || config.states.inicio;

        // Processa a resposta do usuário
        if (currentState.options && text in currentState.options) {
            await processOption(message, from, currentState.options[text]);
        } else {
            await handleInvalidOption(message, currentState);
        }

    } catch (error) {
        console.error('Erro no handleMessage:', error);
    }
};

// Processa opções do menu
async function processOption(message, from, option) {
    switch (option.action) {
        case 'sendLink':
            await message.reply(`🔗 Acesse: ${option.value}`);
            await resetSession(from);
            await message.reply("⚠️ Sessão finalizada. Envie 'menu' para reiniciar.");
            break;
            
        case 'nextState':
        default:
            if (option.nextState) {
                await setStep(from, option.nextState);
                const nextState = config.states[option.nextState];
                await message.reply(nextState.text);
            }
            break;
    }
}

// Lida com opções inválidas
async function handleInvalidOption(message, currentState) {
    if (currentState.options) {
        await message.reply(`⚠️ Opção inválida. Tente novamente:\n\n${currentState.text}`);
    } else {
        await message.reply("⚠️ Sessão finalizada. Envie 'menu' para reiniciar.");
        await resetSession(from);
    }
}

// Reset com mensagem
async function resetAndReply(message, from, replyText) {
    await message.reply(replyText);
    await resetSession(from);
    await message.reply(config.states.inicio.text);
}

// Simula digitação (mantido igual)
async function simulateTyping(message) {
    const chat = await message.getChat();
    await chat.sendStateTyping();
    await randomDelay(1000, 3000);
    await chat.clearState();
}

module.exports = { handleMessage };