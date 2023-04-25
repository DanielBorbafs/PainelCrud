const express = require('express');
const mysql2 = require('mysql2');
const jwt = require('jsonwebtoken');


const app = express();
const secretKey = 'minhaChaveSecreta123';

const db = mysql2.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'painelcrud',
  });

app.use(express.urlencoded({ extended: true }));

function handleCompra(req, res) {
    const token = req.cookies.token;
    const { produto, quantidade, preco } = req.body;
  
    // Verifica se todos os campos foram preenchidos
    if (!produto || !quantidade || !preco) {
      res.status(400).send('Por favor, preencha todos os campos.');
      return;
    }
  
    // Decodifica o token para obter o ID e o nome do usuário
    console.log('Token:', token);
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        console.log(err);
        res.status(500).send('Erro ao verificar token.');
        return;
      }
  
      const cliente_id = decoded.id;
  
      // Consulta o nome do usuário a partir do ID
      db.query('SELECT nome FROM cadastro_usuario WHERE id = ?', [cliente_id], (err, result) => {
        if (err) {
          console.log(err);
          res.status(500).send('Erro ao obter nome do usuário.');
          return;
        }
  
        const cliente_nome = result[0].nome;
  
        // Insere os dados na tabela de compras
        db.query('INSERT INTO compras_usuario (cliente_id, cliente_nome, produto, quantidade, preco, data_compra) VALUES (?, ?, ?, ?, ?, NOW())', [cliente_id, cliente_nome, produto, quantidade, preco], (err, result) => {
          if (err) {
            console.log(err);
            res.status(500).send('Erro ao inserir compra.');
            return;
          }
  
          res.status(200).send('Compra inserida com sucesso.');
        });
      });
    });
  };
  
  module.exports = handleCompra;
  


