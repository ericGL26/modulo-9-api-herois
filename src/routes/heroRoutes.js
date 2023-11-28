const BaseRoute = require('./base/baseRoute')
const Joi = require('joi')

class HeroRoutes extends BaseRoute {
    constructor(db){
        super()
        this.db = db
    }
//Os erros estao nesses metodos

    list() {
        return {
            path: '/herois',
            method: 'GET',
            config: {
                validate: {
                    query: Joi.object({
                        skip: Joi.number().integer().default(0),
                        limit: Joi.number().integer().default(10),
                        nome: Joi.string().min(3).max(100)
                    }),
                    failAction: (request, h, err) => {
                        throw err;
                    }
                }
            },
            handler: async (request, h) => {
                try {
                    const { skip, limit, nome } = request.query;
                    let query = {};
    
                    if (nome) {
                        query.nome = nome;
                    }
    
                    if (isNaN(skip)) {
                        throw new Error('O tipo do skip é incorreto');
                    }
    
                    if (isNaN(limit)) {
                        throw new Error('O tipo do limit é incorreto');
                    }
    
                    const result = await this.db.read(query, parseInt(skip), parseInt(limit));
                    return result;
                } catch (error) {
                    console.error('Algo deu errado em HeroRoutes - list', error);
                    throw h.response('Erro interno no servidor').code(500);
                }
            }
        };
    }

    create() {
        return {
            path: '/herois',
            method: 'POST',
            config: {
                validate: {
                    payload: Joi.object({
                        skip: Joi.number().integer().default(0),
                        limit: Joi.number().integer().default(10),
                        nome: Joi.string().min(3).max(100)
                    }),
                    failAction: (request, h, err) => {
                        throw err;
                    }
                }
            },
    
            handler: async (request, h) => {
                try {
                    const { nome, poder } = request.payload;
                    console.log('Payload:', request.payload); // Adicione este log para verificar o payload recebido
    
                    const result = await this.db.create({ nome, poder });
                    console.log('result', result);
    
                    return {
                        message: 'Herói cadastrado com sucesso!',
                        _id: result._id
                    };
                } catch (error) {
                    console.error('Erro no método create:', error);
                    return h.response({ error: 'Internal serverr errror' }).code(500);
                }
            }
        };
    }


update() {
    return {
        path: '/herois/{id}',
        method: 'PATCH',
        config: {
            validate: {
                params: Joi.object({
                    id: Joi.string().required()
                }),//.compile(),
                payload: Joi.object({
                    nome: Joi.string().min(3).max(100),
                    poder: Joi.string().min(2).max(100)
                })//.compile(),
            }
        },        
        handler: async (request) => {
            try {
                const { id } = request.params;
                const { payload } = request;

                const dados = {
                    nome: payload.nome,
                    poder: payload.poder
                };

                const result = await this.db.update(id, dados);
                console.log('RESULTADO ATUALIZAR', result);
                return {
                    message: 'Herói atualizado com sucesso!'
                };

            } catch (error) {
                console.error('Deu ruim', error);
                return 'Erro interno em heroRoutes';
            }
        }
    };
}

}



module.exports = HeroRoutes