const assert = require('assert');
const api = require('./../api');
let app = {};

async function startServer() {
    app = await api();
}

describe('Suite de testes da API heroes', function () {
    before(async () => {
        await startServer();
    });

    it('Listar /herois', async () => {
        const result = await app.inject({
            method: 'GET',
            url: '/herois?skip=0&limit=10'
        });
        const dados = JSON.parse(result.payload);
        const statusCode = result.statusCode;
        console.log('RESULTADO', result);
        assert.equal(statusCode, 200);
    });

    it('listar /herois - deve retornar um erro com limit incorreto', async () => {
        const TAMANHO_LIMITE = 'AEEE';
        const result = await app.inject({
            method: 'GET',
            url: `/herois?skip=0&limit=${TAMANHO_LIMITE}`
        });
        assert.equal(result.payload, 'Error interno no servidor');
    });

    it('listar /herois - deve filtrar um item', async () => {
        const NAME = 'Demons';
        const result = await app.inject({
            method: 'GET',
            url: `/herois?skip=0&limit=1000&nome=${NAME}`
        });

        const dados = JSON.parse(result.payload);
        const statusCode = result.statusCode;
        assert.equal(statusCode, 200);
        assert.strictEqual(dados[0].nome, NAME);
    });
});
