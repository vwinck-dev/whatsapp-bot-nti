// config.js
module.exports = {
    states: {
        inicio: {
            text: "📱 *MENU PRINCIPAL* 📱\n\n1. Ajuda Escolar\n2. Abrir Chamado Técnico\n\nDigite o número da opção desejada:",
            options: {
                '1': { nextState: 'ajuda_escolar' },
                '2': { nextState: 'abrir_chamado' }
            }
        },
        ajuda_escolar: {
            text: "📚 *AJUDA ESCOLAR* 📚\n\n1. Acesso ao Portal\n2. Problemas com Login\n3. Material Didático\n\nDigite o número da opção:",
            options: {
                '1': { action: 'sendLink', value: 'https://educacao.salvador.ba.gov.br' },
                '2': { action: 'sendLink', value: 'https://educacao.salvador.ba.gov.br/login' },
                '3': { action: 'sendLink', value: 'https://educacao.salvador.ba.gov.br' }
            }
        },
        abrir_chamado: {
            text: "🔧 Para abrir um chamado, acesse:\nhttps://chamados-educacao.salvador.ba.gov.br\n\nFaça login com seu e-mail institucional.",
            options: null
        }
    },
    resetCommands: ['sair', 'reset', 'menu']
};