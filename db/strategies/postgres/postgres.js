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

    async update(id, item) {
        const model = await Postgres.defineModel(this._connection, this._schema);
        const resultado = await model.update(item, { where: { id } });
    }
    

    async delete(id){
        const query = id ? { id } : {} 
        const model = await Postgres.defineModel(this._connection, this._schema);
        return model.destroy({ where: query });
    }

    async read(item = {}) {
        const model = await Postgres.defineModel(this._connection, this._schema);
        return model.findAll({ where: item, raw: true });
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
                logging: false
            }
        )
        await connection
        return connection
    }

}

module.exports = Postgres
