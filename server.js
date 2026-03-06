require('dotenv').config();
const express = require('express');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const port = process.env.PORT || 3000;

// Configuração do Supabase no Backend (opcional, caso precises de rotas protegidas)
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Middleware para entender JSON e servir arquivos estáticos
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ROTA PRINCIPAL: Entrega o Login
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// EXEMPLO DE ROTA DE API: Listar alunos via Node (opcional)
app.get('/api/alunos', async (req, res) => {
    const { data, error } = await supabase
        .from('alunos')
        .select('*')
        .order('nome_completo', { ascending: true });

    if (error) return res.status(400).json(error);
    res.json(data);
});

// ROTA PARA TRATAR ERROS 404
app.use((req, res) => {
    res.status(404).send('Página não encontrada no Carômetro SENAI.');
});

app.listen(port, () => {
    console.log(`
    --------------------------------------------------
    🚀 Servidor do Carômetro Digital SENAI Ativo!
    📍 Local: http://localhost:${port}
    --------------------------------------------------
    `);
});