const fs = require('fs');
const path = require('path');

function logMessage(user, text) {
    const date = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const dir = path.join(__dirname, '..', 'logs', date);

    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const logPath = path.join(dir, `${user}.log`);
    const logEntry = `[${new Date().toISOString()}] ${text}\n`;

    fs.appendFileSync(logPath, logEntry);
}

module.exports = { logMessage };
