const assert = require('assert');
const app = require('../api')
const http = require('http');
const MOCK_HEROI_CADASTRAR = {
  nome: 'Chapolin Corolado',
  poder: 'Marreta Bionica'
}


describe.only('Suite de testes da API heroes', function () {

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
            assert.equal(responseBody.statusCode, 500)
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
            assert.equal(responseBody.statusCode, 500)
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


    // it('listar /herois - deve retornar um erro com limit incorreto', async () => {
    //     const TAMANHO_LIMITE = 'AEEE';
    //     const result = await app.inject({
    //         method: 'GET',
    //         url: `/herois?skip=0&limit=${TAMANHO_LIMITE}`
    //     });
    //     assert.equal(result.payload, 'Error interno no servidor');
    // });

    // it('listar /herois - deve filtrar um item', async () => {
    //     const NAME = 'Demons';
    //     const result = await app.inject({
    //         method: 'GET',
    //         url: `/herois?skip=0&limit=1000&nome=${NAME}`
    //     });

    //     const dados = JSON.parse(result.payload);
    //     const statusCode = result.statusCode;
    //     assert.equal(statusCode, 200);
    //     assert.strictEqual(dados[0].nome, NAME);
    // });

      it('Cadastrar POST - /herois', async () => {
        console.log('Teste3')
        const result = await app.inject({
          method: 'POST',
          url: `/herois`,
          payload: JSON.stringify(MOCK_HEROI_CADASTRAR)
          });
          console.log('Teste2')
          const statusCode = result.statusCode
          console.log('Teste1')
          const { message } = JSON.parse(result.payload)
          console.log('MENSAGEM', message)
          assert.ok(statusCode === 200)
          assert.deepEqual(message, "Heroi cadastrado com sucesso!")
      })

});