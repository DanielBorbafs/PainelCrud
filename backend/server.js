const express = require('express')
const mysql2 = require('mysql2')
const app = express();
const port = 3000;
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const handleLogin = require('./routes/handleLogin');
const handleCadastro = require('./routes/handleCadastro')

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

// Rota principal - Pagina inicial 
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
})

app.post('/login', (req, res) => {
    handleLogin(req, res, app, db);
});
app.post('/cadastro', handleCadastro);

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
