const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql2 = require('mysql2');

const db = mysql2.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'painelcrud',
});



function handleLogin(req, res) {
  // Recebe os dados do formulário de login
  const { email, senha } = req.body;
// Verifica se todos os campos foram preenchidos
if (!email || !senha) {
  res.status(400).send('Por favor, preencha todos os campos.');
  return;
}
// Chave secreta para assinatura do token
const secretKey = 'minhaChaveSecreta123';

// Busca o usuário no banco de dados pelo email
db.query('SELECT * FROM cadastro_usuario WHERE email = ?', [email], (err, result) => {
  if (err) {
    console.log(err);
    res.status(500).send('Erro ao buscar usuário.');
    return;
  }

  if (result.length === 0) {
    res.status(401).send('Usuário não encontrado.');
    return;
  }

  const usuario = result[0];

  // Verifica se a senha está correta
  bcrypt.compare(senha, usuario.senha, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send('Erro ao comparar senhas.');
      return;
    }

    if (!result) {
      res.status(401).send('Senha incorreta.');
      return;
    }

    // Gera um token para o usuário
    const token = jwt.sign({ id: usuario.id }, secretKey, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true, secure: false });
    res.redirect('../pages/PageAdmin.html');
  });
});
};


module.exports = handleLogin;
