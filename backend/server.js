const express = require('express')
const mysql2 = require('mysql2')
const app = express();
const port = 3000;
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const db = mysql2.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'painelcrud'
});
app.use(express.static('public'));
// Testa a conexão com o banco de dados
db.connect((err) => {
    if (err) throw err;
    console.log('Conectado ao banco de dados!');
});
// Configura o Express para reconhecer o corpo da solicitação como JSON
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Rota principal 
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
})


// Chave secreta para assinatura do token
const secretKey = 'minhaChaveSecreta123';

// Rota de cadastro
app.post('/cadastro', (req, res) => {
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
                res.status(500).send('Email ja cadastrado, favor inserir outro');
                return;
            }

            res.status(200).send('Cadastro realizado com sucesso!');
        });
    });
    console.log(req.body)

});


// Rota de login
app.post('/login', (req, res) => {
  // Recebe os dados do formulário de login
  const { email, senha } = req.body;

  // Verifica se todos os campos foram preenchidos
  if (!email || !senha) {
    res.status(400).send('Por favor, preencha todos os campos.');
    return;
  }

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
      res.redirect('/dashboard.html');
    });
  });
});



app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
