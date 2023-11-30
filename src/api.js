const Hapi = require('@hapi/hapi');
const Hoek = require('@hapi/hoek');
const Joi = require('joi');
const Context = require('../db/strategies/base/contextStrategy');
const MongoDb = require('../db/strategies/mongodb/mongodb');
const HeroiSchema = require('../db/strategies/mongodb/schemas/heroisSchema');
const HeroRoute = require('./routes/heroRoutes');
const HapiPino = require('hapi-pino');
//const pinoPretty = require('pino-pretty');

async function main() {
    try {
        const connection = await MongoDb.MongoDB.connect();
        const context = new Context(new MongoDb.MongoDB(connection, HeroiSchema));

        Hoek.assert(Joi, 'Joi not found');
        const server = new Hapi.Server({
            port: 8030
        });

        // Configurar o pino-pretty separadamente

        await server.register({
            plugin: HapiPino,
        });

        function mapRoutes(instance, methods) {
            return methods.map(method => {
                const route = instance[method]();
                return route;
            });
        }

        const routes = mapRoutes(new HeroRoute(context), HeroRoute.methods());
        console.log('Rotas mapeadas', routes)
        server.route([
            ...routes,
        ]);
        

        await server.start();

        console.log('Servidor iniciado na porta', server.info.port);
        return server;
    } catch (error) {
        console.error('Erro ao iniciar o servidor:', error);
        throw error;
    }
}

async function start() {
    try {
        await main();
    } catch (error) {
        // process.exit(1);
    }
}

const app = undefined;
start();
