const Icrud = require('./../interface/Icrud');
const Sequelize = require('sequelize')

class Postgres extends Icrud {
    constructor(connection, schema) {
        super()
        this._connection = connection
        this._schema = schema
    }
    async isConected() {
        try{
            await this._connection.authenticate()
            return true
        }
        catch(error){
            console.error('Deu ruim tente novamente: ', error)
            return false
        }
    }
    static async defineModel(connection, schema) {
        const model = connection.define(
          schema.name, schema.schema, schema.options
        );
        await model.sync();
        return model;
      }
      
    async create(item) {
        const {dataValues} = await this._schema.create(item)
        return dataValues
    }

    async update(id, item){
        const resultado = await  this._herois.update(item, {where: {id : id}})
    }

    async delete(id){
        const query = id ? { id } : {} 
        console.log('UOUOUOUOUOUOUOUO', query)
        return this._herois.destroy({where: query})
    }

    async read(item = {}){
        return this._herois.findAll({where: item, raw: true})
    }

    static async connect() {
         const connection = new Sequelize(
            'heroes',
            'ericgomes',
            '12345',
            {
                host: 'localhost',
                dialect: 'postgres',
                quoteIdentifiers: false,
            }
        )
        await connection
        return connection
    }

}

module.exports = Postgres
