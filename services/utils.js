// Gera atrasos aleatórios
function randomDelay(min = 500, max = 3000) {
    const delay = Math.floor(Math.random() * (max - min + 1)) + min;
    return new Promise(resolve => setTimeout(resolve, delay));
}

// Simula variações humanas de digitação
async function humanTypingVariation() {
    const variations = [
        () => randomDelay(100, 300),
        () => randomDelay(400, 700),
        () => randomDelay(800, 1200)
    ];
    await variations[Math.floor(Math.random() * variations.length)]();
}

module.exports = { randomDelay, humanTypingVariation };