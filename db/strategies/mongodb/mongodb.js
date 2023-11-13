const Icrud = require("./../interface/Icrud");
const Mongoose = require("mongoose");

const STATUS = {
    0: 'Disconectado',
    1: 'Conectado',
    2: 'Conectando',
    3: 'Disconectando'
}

const connection = Mongoose.connection;

class MongoDB extends Icrud {
  constructor(connection, schema) {
    super();
    this._schema = schema
    this._connection = connection
  }

  async isConected() {
    const state = STATUS[this._connection.readyState]
    if(state === 'Conectado') return state;
    if(state !== 'Conectando') return state
    await new Promise(resolve => setTimeout(resolve, 1000))

    return STATUS[this._connection.readyState]
    
  }
  
  static connect() {
    Mongoose.connect(
      "mongodb://admin:senhaadmin@localhost:27017/herois?authSource=admin",
      { useNewUrlParser: true }
    ).catch((error) => {
      if (!error) return;
      console.log("Falha na conexão!", error);
    });
    const connection = Mongoose.connection
    connection.once('open', () => console.log('Database rodando'))
    return connection
  }

  create(item) {
    return this._schema.create(item)
  }
  //o skip ira pular os 10 ou mais primeiros resultados do banco de dados
  read(item, skip=3, limit=3){
    return this._schema.find(item).skip(skip).limit(limit)
  }

  update(id, item) {
    return this._schema.updateOne({ _id: id}, {$set: item })
  }

  delete(id) {
    return this._schema.deleteOne({ _id: id})
  }

}

module.exports = {
  MongoDB, // Export a class
  isConnected: MongoDB.isConnected, // Export the isConnected function
  connect: MongoDB.connect, // Export the connect function
};