const Hapi = require('hapi');
const Hoek = require('@hapi/hoek');
const Joi = require('joi');
const Context = require('../db/strategies/base/contextStrategy');
const MongoDb = require('../db/strategies/mongodb/mongodb');
const HeroiSchema = require('../db/strategies/mongodb/schemas/heroisSchema');
const HeroRoute = require('./routes/heroRoutes');

const HapiPino = require('hapi-pino');

async function main() {
    const connection = await MongoDb.MongoDB.connect();
    const context = new Context(new MongoDb.MongoDB(connection, HeroiSchema));

    Hoek.assert(Joi, 'Joi not found');
    const server = new Hapi.Server({
        port: 8030
    });

    const logger = HapiPino({
        prettyPrint: {
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname',
            errorLikeObjectKeys: ['err', 'error'],
            messageKey: 'msg',
            customPrettifiers: {
                response: {
                    key: 'res',
                    response: true
                },
                request: {
                    key: 'req',
                    properties: ['method', 'url', 'headers', 'payload']
                }
            }
        },
        logEvents: ['response', 'onPostStart']
    });

    await server.register({
        plugin: logger
    });

    server.route([
        ...mapRoutes(new HeroRoute(context), HeroRoute.methods())
    ]);

    await server.start();
    console.log('Servidor rodando na porta', server.info.port);

    return server;
}

// Restante do código...



async function start() {
    try {
        await main();
    } catch (error) {
        console.error('Erro ao iniciar o servidor:', error);
        process.exit(1); // Encerrar o processo com código de erro
    }
}

// Verificar se o arquivo está sendo executado diretamente (node api.js)
if (require.main === module) {
    start();
}

module.exports = start;
