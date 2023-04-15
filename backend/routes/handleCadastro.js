const express = require('express');
const bcrypt = require('bcrypt');
const mysql2 = require('mysql2');

const db = mysql2.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'painelcrud',
});

function handleCadastro(req, res) {
    // Recebe os dados do formulário de cadastro
    const { nome, email, senha } = req.body;
  
    // Verifica se todos os campos foram preenchidos
    if (!nome || !email || !senha) {
      res.status(400).send('Por favor, preencha todos os campos.');
      return;
    }
  
    // Cria o hash da senha
    bcrypt.hash(senha, 10, (err, hash) => {
      if (err) {
        console.log(err);
        res.status(500).send('Erro ao criar hash da senha.');
        return;
      }
  
      // Insere os dados no banco de dados
      db.query('INSERT INTO cadastro_usuario (nome, email, senha) VALUES (?, ?, ?)', [nome, email, hash], (err, result) => {
        if (err) {
          console.log(err);
          res.status(500).send('Email ja cadastrado, por favor insira um diferente.');
          return;
        }
  
        res.status(200).send('Cadastro realizado com sucesso!');
      });
    });
}

// Exporta a função handleCadastro
module.exports = handleCadastro;
  