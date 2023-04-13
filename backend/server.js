const express = require('express')
const mysql2 = require('mysql2')
const app = express();
const port = 3000;
const bodyParser = require('body-parser')

const db = mysql2.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'painelcrud'
});


// Testa a conexão com o banco de dados
db.connect((err) => {
    if (err) throw err;
    console.log('Conectado ao banco de dados!');
});

// Configura o Express para reconhecer o corpo da solicitação como JSON
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Cria a rota de cadastro
app.post('/cadastro', (req, res) => {
    // Recebe os dados do formulário de cadastro
    const { nome, email, senha } = req.body;

    // Verifica se todos os campos foram preenchidos
    if (!nome || !email || !senha) {
        res.status(400).send('Por favor, preencha todos os campos.');
        return;
    }

    // Insere os dados no banco de dados
    db.query('INSERT INTO cadastro_usuario (nome, email, senha) VALUES (?, ?, ?)', [nome, email, senha], (err, result) => {
        if (err) {
            console.log(err); // imprime o erro no console
            res.status(500).send('Erro ao inserir os dados no banco de dados.');
            return;
        }
    
        res.status(200).send('Cadastro realizado com sucesso!');
    });
});


app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
