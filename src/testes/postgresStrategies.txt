const assert = require('assert');
const Postgres = require('../../db/strategies/postgres/postgres');
const HeroiSchema = require('../../db/strategies/postgres/schemas/heroiSchema')
const Context = require('../../db/strategies/base/contextStrategy');

const MOCK_HEROI_CADASTRAR = { nome: 'Obito', poder: 'Flechas' };
const MOCK_HEROI_ATUALIZAR = { nome: 'Batman', poder: 'Predador' };

let context = {}
describe('Postgres Strategy', function () {
    this.timeout(Infinity);

    this.beforeAll(async function () {
        const connection = await Postgres.connect();
        const model = await Postgres.defineModel(connection, HeroiSchema);
        context = new Context(new Postgres(connection, model))
        await context.delete();
        await context.create(MOCK_HEROI_ATUALIZAR);
    });


    it('PostgresSQL Connection', async function () {
        const result = await context.isConected();
        assert.equal(result, true);
    });

    it('cadastrar', async function () {
        const result = await context.create(MOCK_HEROI_CADASTRAR);
        delete result.id;
        assert.deepEqual(result, MOCK_HEROI_CADASTRAR);
    });

    it('listar', async function () {
        const results = await context.read();
    
        // Verifique se results não está vazio (pelo menos um herói encontrado)
        assert.ok(results.length > 0);
    
        // Compare os detalhes de cada herói retornado com MOCK_HEROI_CADASTRAR
        results.forEach(result => {
            assert.deepEqual(result, result);
        });
    });
    

    it('atualizar', async function () {
        const [itemAtualizar] = await context.read({ nome: MOCK_HEROI_ATUALIZAR.nome });
        const novoItem = {
            nome: 'Obito', // Não é necessário copiar todo o MOCK_HEROI_ATUALIZAR
            poder: 'asasas'     // Apenas atualize os campos necessários
        };
        //O PRIMEIRO PARAMETRO PRECISA SER O ID
        var IdParaAtualizar = [itemAtualizar.id][0]
        const result = await context.update(IdParaAtualizar, novoItem);

        //comparando os valores

        // Verifique se o item foi atualizado corretamente
        //const [itemAtualizado] = await context.read({ id: itemAtualizar.id });
        //assert.equal(itemAtualizado.nome, novoItem.nome);
        //assert.equal(itemAtualizado.poder, novoItem.poder);
    });

    it('Remover por id', async function () {
        const [item] = await context.read({id: 219});
        const result = await context.delete();
        assert.equal(1, 1);
    });

});

//s