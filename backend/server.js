const express = require('express')
const mysql2 = require('mysql2')
const app = express();
const port = 3000;
const bodyParser = require('body-parser')
const handleLogin = require('./routes/handleLogin');
const handleCadastro = require('./routes/handleCadastro')
const handleCompra = require('./routes/handleCompra')
const cookieParser = require('cookie-parser');

const db = mysql2.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'painelcrud'
});
app.use(cookieParser());
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
    handleLogin(req, res, db);
});
app.post('/cadastro', handleCadastro);

app.post('/processar_compra', handleCompra);

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
