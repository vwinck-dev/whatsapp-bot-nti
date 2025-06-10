const rateLimits = {};
const WINDOW_SIZE = 60000; // 1 min
const LIMIT = 20;

function isAllowed(userId) {
  const now = Date.now();

  if (!rateLimits[userId]) {
    rateLimits[userId] = [];
  }

  // Remove timestamps fora da janela (1 minuto)
  rateLimits[userId] = rateLimits[userId].filter(ts => now - ts < WINDOW_SIZE);

  if (rateLimits[userId].length >= LIMIT) {
    console.log(`Usuário ${userId} passou do limite de mensagens.`);
    return false;
  }

  rateLimits[userId].push(now);
  return true;
}

// Opcional: limpar usuários que não enviam nada há mais de 2 minutos pra não acumular
function cleanRateLimits() {
  const now = Date.now();
  for (const userId in rateLimits) {
    rateLimits[userId] = rateLimits[userId].filter(ts => now - ts < WINDOW_SIZE);
    if (rateLimits[userId].length === 0) {
      delete rateLimits[userId];
    }
  }
}

setInterval(cleanRateLimits, 120000); // limpa a cada 2 minutos

module.exports = { rateLimiter: { isAllowed } };
