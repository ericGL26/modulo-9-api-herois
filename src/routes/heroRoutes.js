const BaseRoute = require('./base/baseRoute')
const Joi = require('joi')

class HeroRoutes extends BaseRoute {
    constructor(db){
        super()
        this.db = db
    }
    list() {
        return {
            path: '/herois',
            method: 'GET',
            config: {
                validate: {
                    //serve para monstrar especificadamente onde está localizado e erro
                    failAction: (request, headers, erro) => {
                    },
                    query: Joi.object({
                        skip: Joi.number().integer().default(0),
                        limit: Joi.number().integer().default(10),
                        nome: Joi.string().min(3).max(100)
                    })
                }
            },
            handler: (request, headers) => {
                try {

                    const {skip, limit, nome} = request.query 
                    let query = {}
                    if(nome) {
                        query.nome = nome
                    }
                
                    if(isNaN(skip)){
                        throw Error('O tipo do skip é incorreto')
                    }              
                    if(isNaN(limit)) {
                        throw Error('O tipo do limit é incorreto')
                    }

                    return this.db.read(query, parseInt(skip), parseInt(limit))
                    //return [{heroi: "homem arara"}]

                } catch(error) {
                    console.error('algo deu errado heroroutes linha 16', error)
                    return "Error interno no servidor"
                }
            }
        }
    }
}

module.exports = HeroRoutes