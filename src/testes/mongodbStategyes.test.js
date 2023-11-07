const assert = require('assert');
const { MongoDB, isConected } = require('../../db/strategies/mongodb/mongodb');
const HeroisSchema = require('../../db/strategies/mongodb/schemas/heroisSchema')
const Context = require('../../db/strategies/base/contextStrategy');
const MOCK_HEROI_CADASTRAR = {
    nome: 'Mulher maravilha',
    poder: 'Laço'
}

var MOCK_HEROI_DEFAULT = {
    nome: `Mulher maravilha`,
    poder: 'Laço'
}

var MOCK_HEROI_ATUALIZAR = {
    nome: `Patolino`,
    poder: 'Velocidade'
}

let MOCK_HEROI_ID = ''

let context = {}

describe('MongoDB suite de testes', function () {
    this.beforeAll(async () => {
        const connection = MongoDB.connect()
        context = new Context(new MongoDB(connection, HeroisSchema))
        const result = await context.create(MOCK_HEROI_DEFAULT)
        MOCK_HEROI_ID = result._id;
    })
    it('Verificar conexão', async () => { // Alterado para ser assíncrono
        const result = await context.isConected(); // Corrigido o nome da função
        console.log('Result', result)
        const expected = 'Conectado'; // Espera que o resultado seja verdadeiro, pois a conexão é bem-sucedida
        assert.equal(result, expected);
    });
    it('Cadastrar', async () => {
        const { nome, poder } = await context.create(MOCK_HEROI_CADASTRAR)
        assert.deepEqual({ nome, poder }, MOCK_HEROI_CADASTRAR)
    })
    it('listar', async () => {
        const leitura = await context.read()
        console.log('LEITURA', leitura)
        //Desse objeto vai extrair somente a primeira possicao e pegar os valores nome e poder dela
        const [{nome, poder}] = await context.read( {nome: MOCK_HEROI_DEFAULT.nome} )
        const result = {
            nome, poder
        }
    })
    it('atualizar', async () => {
        const result = await context.update(MOCK_HEROI_ID, {
            nome: 'Pernalonga'
        })
        console.log('Resultado', result)
    })
    it('remover', async () => {
        const result = await context.delete(MOCK_HEROI_ID)
    })
});
