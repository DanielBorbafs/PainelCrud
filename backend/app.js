const cadastrar = async () => {
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    const response = await fetch('http://localhost:3000/cadastro', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nome, email, senha })
    });

    if (response.ok) {
        console.log('Cadastro realizado com sucesso');
        // Redirecionar para a página principal após o cadastro
        window.location.href = 'http://localhost:3000/principal';
    } else {
        console.error('Erro ao cadastrar');
    }
};