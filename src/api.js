const Hapi = require('@hapi/hapi');
const Hoek = require('@hapi/hoek');
const Joi = require('joi');
const Context = require('../db/strategies/base/contextStrategy');
const MongoDb = require('../db/strategies/mongodb/mongodb');
const HeroiSchema = require('../db/strategies/mongodb/schemas/heroisSchema');
const HeroRoute = require('./routes/heroRoutes');
const HapiPino = require('hapi-pino');

async function main() {
    try {
        const connection = await MongoDb.MongoDB.connect();
        const context = new Context(new MongoDb.MongoDB(connection, HeroiSchema));

        Hoek.assert(Joi, 'Joi not found');
        const server = new Hapi.Server({
            port: 8030
            //se estiver retornando um erro de porta já em uso é pq vc ja rodou o codigo e a porta ja está sendo usada
        });

        await server.register(HapiPino);

        function mapRoutes(instance, methods) {
            return methods.map(method => {
                const route = instance[method]();
                return route;
            });
        }
//ALERTANDO ERROR
        server.route([
            ...mapRoutes(new HeroRoute(context), HeroRoute.methods()),
        ]);

        await server.start();

        console.log('Servidor iniciado na porta', server.info.port);
        return server; // Retorna a instância do servidor Hapi
    } catch (error) {
        console.error('Erro ao iniciar o servidor:', error);
        throw error; // Permite que o processo continue, mas propaga o erro para que você possa ver os detalhes no console
    }
}

// Restante do código...

async function start() {
    try {
        await main();
    } catch (error) {
        // Se você deseja encerrar o processo com um código de erro, você pode descomentar a linha abaixo
        // process.exit(1);
    }
}

// Verificar se o arquivo está sendo executado diretamente (node api.js)
const app = undefined;
// if (require.main === module) {
//     start();
// }
start();
// module.exports = app;
