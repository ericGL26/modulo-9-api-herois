const assert = require('assert');
const app = require('../api')
const http = require('http');
const MOCK_HEROI_CADASTRAR = {
  nome: 'Chapolin Corolado',
  poder: 'Marreta Bionica'
}

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

let MOCK_ID =  ''

describe('Suite de testes da API heroes', function () {
    
  this.beforeAll(async () => {
    // Criar uma Promise para aguardar a conclusão da requisição
    const promise = new Promise((resolve, reject) => {
      const req = http.request(optionsParaGET, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
          console.log('CHUNCK', chunk.toString('utf8'))
        });
        //O erro está na variavel chunk que está retornando internal server error
        res.on('end', () => {
          const statusCode = res.statusCode;
          const { message, _id } = JSON.parse(data);
          MOCK_ID = _id;
          // Resolver a Promise após a conclusão da requisição
          resolve();
        });
      });

      req.on('error', (error) => {
        console.error('Erro na requisição:', error);
        
        // Rejeitar a Promise em caso de erro
        reject(error);
      });

      req.end();
    });

    // Aguardar a conclusão da Promise antes de prosseguir
    await promise;
  });


    it('Deve retornar uma lista de 3 herois', (done) => {
        http.get('http://localhost:8030/herois?skip=0&limit=3', (res) => {
          let data = '';
          res.on('data', (chunk) => {
            data += chunk;
          });
          //req.payload é undefined
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


    const http = require('http');
const assert = require('assert');

// Suponha que MOCK_HEROI_CADASTRAR seja um objeto representando o herói a ser cadastrado


it('Cadastrar POST - /herois', (done) => {

  const req = http.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      const statusCode = res.statusCode;
      const { message, _id } = JSON.parse(data);

      assert.ok(statusCode === 200);
      assert.notDeepStrictEqual(_id, undefined);
      assert.deepEqual(message, 'Herói cadastrado com sucesso!');

      console.log('Teste concluído');
      done();
    });
  });

  req.on('error', (error) => {
    console.error('Erro na requisição:', error);
    done(error);
  });

  req.write(JSON.stringify(MOCK_HEROI_CADASTRAR));
  req.end();
});

it('Atualizar PATCH - /herois/:id', (done) => {
  const _id = MOCK_ID;
  const expected = {
    poder: 'SUPER SEGURANCA'
  }

  const optionsParaPATCH = {
    hostname: 'localhost',
    port: 8030,
    path: `/herois/${_id}`,
    method: 'PATCH', // Corrigir o método para PATCH
    headers: {
      'Content-Type': 'application/json',
    }
  }

  const req = http.request(optionsParaPATCH, (res) => {
    let data = '';
  
    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      const statusCode = res.statusCode;
      const { message, _id } = JSON.parse(data);
      assert.ok(statusCode === 200)
      assert.deepEqual(message, 'Heroi atualizado com sucesso!')
      done(); // Adicionar a chamada done() para indicar que o teste foi concluído
    });
  });

  req.end(JSON.stringify(expected)); // Adicionar os dados para a requisição PATCH
});
  

});