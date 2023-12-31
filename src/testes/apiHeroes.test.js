const assert = require('assert');
const app = require('../api')
const http = require('http');
const Joi = require('joi');

const MOCK_HEROI_INICIAL = {
  nome: 'MACACO QUE BATE PRATO',
  poder: 'SEGURANCA'
}

const options =  {
  hostname: 'localhost',
  port: 8030,
  path: '/herois',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
};

const optionsParaGET = {
    hostname: 'localhost',
    port: 8030,
    path: '/herois',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
}


const optionsParaBeforeAll = {
  hostname: 'localhost',
  port: 8030,
  path: '/herois?limit=10000',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
}


let MOCK_ID =  ''

describe('Suite de testes da API heroes',  function () {
    
  this.beforeAll(async () => {
    const promise = new Promise((resolvePromise, reject) => {
      const req = http.request(optionsParaBeforeAll, (res) => {
        let data = '';
  
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          const statusCode = res.statusCode;
          const dataJSON = JSON.parse(data)
          const ultimoCadastro = dataJSON[dataJSON.length - 1]
          const _id = ultimoCadastro._id
          MOCK_ID = _id; 
          resolvePromise();
        });
      });
      
      req.on('error', (error) => {
        console.error('Erro na requisição:', error);
  
        reject(error);
      });
  
      req.end();
    });
  
    await promise;
  });
  

    it('Deve retornar uma lista de 3 herois', (done) => {
        http.get('http://localhost:8030/herois?skip=0&limit=3', (res) => {
          let data = '';
          res.on('data', (chunk) => {
            data += chunk;
          });
          res.on('end', () => {
            const responseBody = JSON.parse(data);
            assert.equal(responseBody.length, 3)
            done();
          });
        });
      });



      it('deve retornar um erro com limit incorreto', (done) => {
        http.get('http://localhost:8030/herois?skip=0&limit=sd', (res) => {
          let data = '';
          res.on('data', (chunk) => {
            data += chunk;
          });
    
          res.on('end', () => {
            const responseBody = JSON.parse(data);
            assert.equal(responseBody.statusCode, 400)
            done();
          });
        });
      });


      it('deve retornar um erro com skip incorreto', (done) => {
        http.get('http://localhost:8030/herois?skip=ERROR&limit=1000', (res) => {
          let data = '';
          res.on('data', (chunk) => {
            data += chunk;
          });
    
          res.on('end', () => {
            const responseBody = JSON.parse(data);
            assert.equal(responseBody.statusCode, 400)
            done();
          });
        });
      });


      it('Deve filtrar um item', (done) => {
        var NAME = 'Pernalonga'
        http.get(`http://localhost:8030/herois?skip=0&limit=1000&nome=${NAME}`, (res) => {
          let data = '';
          res.on('data', (chunk) => {
            data += chunk;
          });
    
          res.on('end', () => {
            const responseBody = JSON.parse(data);
             for(i = 0; i < responseBody.length; i++) {
               assert.equal(responseBody[i].nome, NAME)
             }
            done();
          });
        });
      });


      it('Verificar sem o skip', (done) => {
        http.get('http://localhost:8030/herois?limit=3', (res) => {
          let data = '';
          res.on('data', (chunk) => {
            data += chunk;
          });
    
          res.on('end', () => {
            const responseBody = JSON.parse(data);
            assert.ok(responseBody.length > 1, 'O valor atual nao foi maior que um!')
            done();
          });
        });
      });



      it('Verificar sem o limit', (done) => {
        http.get('http://localhost:8030/herois?skip=0', (res) => {
          let data = '';
          res.on('data', (chunk) => {
            data += chunk;
          });
    
          res.on('end', () => {
            const responseBody = JSON.parse(data);
            assert.ok(responseBody.length > 1, 'O valor atual nao foi maior que um!')
            done();
          });
        });
      });


      it('Verificar se nome existe', (done) => {
        http.get('http://localhost:8030/herois?skip=0&limit=3', (res) => {
          let data = '';
          res.on('data', (chunk) => {
            data += chunk;
          });
    
          res.on('end', () => {
            const responseBody = JSON.parse(data);
            const NomeResponseBody = responseBody[0].nome
            assert.ok(NomeResponseBody != undefined)
            done();
          });
        });
      });


      
      it('Verificar se poder existe', (done) => {
        http.get('http://localhost:8030/herois?skip=0&limit=3', (res) => {
          let data = '';
          res.on('data', (chunk) => {
            data += chunk;
          });
    
          res.on('end', () => {
            const responseBody = JSON.parse(data);
            const NomeResponseBody = responseBody[0].poder
            assert.ok(NomeResponseBody != undefined)
            done();
          });
        });
      });



const axios = require('axios');
const assert = require('assert');

const MOCK_HEROI_CADASTRAR = {
  nome: "TESTEDOZE",
  poder: "TESTEDOZEVINTE"
};

it('Cadastrar POST - /herois', async () => {
  try {
    const { error, value: validatedPayload } = Joi.object({
      skip: Joi.number().integer().default(0),
      limit: Joi.number().integer().default(10),
      nome: Joi.string().min(3).max(100),
      poder: Joi.string().min(3).max(100)
    }).validate(MOCK_HEROI_CADASTRAR)

    if(error){
      throw new Error(`Erro na validacao do payload ${error}`)
    }

    const response = await axios.post('http://localhost:8030/herois', validatedPayload);

    const { status, data } = response
    const { message, _id } = data

    assert.strictEqual(status, 200)
    assert.notStrictEqual(_id, undefined)
    assert.strictEqual(message, 'Herói cadastrado com sucesso!')

  } catch (error) {
    console.error('Erro ao processar a resposta:', error);
    throw error;
  }
});


it('Atualizar PATCH - /herois/:id', (done) => {
  const _id = MOCK_ID;
  const expected = {
    poder: 'SUPER SEGURANCA',
  };

  const optionsParaPATCH = {
    hostname: 'localhost',
    port: 8030,
    path: `/herois/${_id}`,
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const req = http.request(optionsParaPATCH, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      const statusCode = res.statusCode;
      const { message, _id } = JSON.parse(data);
      assert.ok(statusCode === 200);
      assert.deepEqual(message, 'Herói atualizado com sucesso!');// quando for corrigir modificar para: Herói atualizado com sucesso!
      done();
    });
  });

  req.end(JSON.stringify(expected));
});



it('Atualizar PATCH - /herois/:id - não deve atualizar com ID incorreto!', (done) => {
  const _id = `5bfdb6e83f66ad3c32939fb1`;
  const expected = {
    poder: 'SUPER SEGURANCA',
  };

  const optionsParaPATCH = {
    hostname: 'localhost',
    port: 8030,
    path: `/herois/${_id}`,
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const req = http.request(optionsParaPATCH, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      const statusCode = res.statusCode;
      const { message, _id } = JSON.parse(data);
      assert.ok(statusCode === 412);
      assert.deepEqual(message, 'Id Não encontrado no banco');
      done();
    });
  });

  req.end(JSON.stringify(expected));
});


it('remover DELETE - /herois/:id', async () => {
  const _id = MOCK_ID;
  try {
    const response = await axios.delete(`http://localhost:8030/herois/${_id}`);
    const { status, data } = response;

    assert.ok(status === 200);
    assert.deepEqual(data.message, 'Herói removido com sucesso');
  } catch (error) {
    throw new Error(error);
  }
});


it('remover DELETE - /herois/:id / nao deve remover', async () => {
  const _id = '5bfdb6e83f66ad3c32939fb1';  // Substitua pelo ID válido que não existe no banco

  try {
    const response = await axios.delete(`http://localhost:8030/herois/${_id}`);
    console.log('RESPONSEAASS', response);

    const { status, data } = response;
    console.log('StatusCOdeNAoDvremover', status);

    // Aqui você pode ajustar as condições de teste conforme necessário
    assert.ok(status === 404);
    assert.deepEqual(data.message, 'Id Não encontrado no banco');
  } catch (error) {
    // Certifique-se de ajustar as condições de erro conforme necessário
    assert.ok(error.response.status === 412);
    assert.deepEqual(error.response.data.message, 'Id Não encontrado no banco');
  }
});



it('remover DELETE - /herois/:id / nao deve remover com id invalido', async () => {
  const _id = 'ID_INVALIDO';

  try {
    const response = await axios.delete(`http://localhost:8030/herois/${_id}`);
    console.log('RESPONSEAASS', response);

    const { status, data } = response;
    console.log('StatusCOdeNAoDvremover', status);

    // Aqui você pode ajustar as condições de teste conforme necessário
    assert.ok(status === 500 || status === 404);
    assert.deepEqual(data.message, 'An internal server error occurred');
  } catch (error) {
    // Certifique-se de ajustar as condições de erro conforme necessário
    assert.ok(error.response.status === 500 || error.response.status === 404);
    assert.deepEqual(error.response.data.message, 'An internal server error occurred');
  }
});

});