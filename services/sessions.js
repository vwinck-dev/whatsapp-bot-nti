const sqlite3 = require('sqlite3').verbose();

// Configura banco de dados SQLite para persistência
const db = new sqlite3.Database('./sessions.sqlite');

// Cria tabela se não existir
db.run(`
    CREATE TABLE IF NOT EXISTS sessions (
        userId TEXT PRIMARY KEY,
        step TEXT NOT NULL DEFAULT 'inicio',
        lastActive INTEGER NOT NULL
    )
`);

// Obtém sessão do usuário
function getSession(userId) {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM sessions WHERE userId = ?', [userId], (err, row) => {
            if (err) return reject(err);

            if (row) {
                // Atualiza timestamp de atividade
                db.run('UPDATE sessions SET lastActive = ? WHERE userId = ?', [Date.now(), userId]);
                resolve(row);
            } else {
                // Cria nova sessão
                const newSession = {
                    userId: userId,
                    step: 'inicio',
                    lastActive: Date.now()
                };
                db.run('INSERT INTO sessions (userId, step, lastActive) VALUES (?, ?, ?)',
                    [userId, 'inicio', newSession.lastActive],
                    (err) => {
                        if (err) return reject(err);
                        resolve(newSession);
                    }
                );
            }
        });
    });
}

// Atualiza etapa da sessão
function setStep(userId, step) {
    return new Promise((resolve, reject) => {
        db.run('UPDATE sessions SET step = ?, lastActive = ? WHERE userId = ?',
            [step, Date.now(), userId],
            function (err) {
                if (err) return reject(err);
                resolve();
            }
        );
    });
}

// Reseta sessão
function resetSession(userId) {
    return new Promise((resolve, reject) => {
        db.run('DELETE FROM sessions WHERE userId = ?', [userId], (err) => {
            if (err) return reject(err);
            resolve();
        });
    });
}

// Limpa sessões inativas (> 30 minutos)
function cleanSessions() {
    const expiryTime = Date.now() - 30 * 60 * 1000; // 30 minutos
    db.run('DELETE FROM sessions WHERE lastActive < ?', [expiryTime], (err) => {
        if (err) console.error('Erro ao limpar sessões:', err);
        else console.log(`Sessões inativas limpas: ${this.changes}`);
    });
}

module.exports = { getSession, setStep, resetSession, cleanSessions };