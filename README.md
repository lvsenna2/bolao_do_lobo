# Bolão do Lobo - V8 PostgreSQL

Versão com banco PostgreSQL persistente.

## O que mudou

- Saiu o banco JSON.
- Entrou PostgreSQL.
- Dados não somem em reinício/deploy.
- Pronto para hospedar online em Railway, Render, VPS ou outro servidor com PostgreSQL.

## Variáveis obrigatórias

Configure:

DATABASE_URL
SESSION_SECRET

Exemplo local:

set DATABASE_URL=postgresql://usuario:senha@localhost:5432/bolao
set SESSION_SECRET=uma_chave_grande

No Railway, ao adicionar PostgreSQL, ele cria a DATABASE_URL automaticamente.

## Rodar

npm install
npm start

## Acessos

ADM:
admin
admin123

Participantes:
senha inicial 123456

## Deploy recomendado Railway

1. Suba a pasta para o GitHub.
2. No Railway, crie um novo projeto.
3. Deploy from GitHub.
4. Adicione um banco PostgreSQL.
5. Verifique se DATABASE_URL apareceu nas variáveis.
6. Adicione SESSION_SECRET.
7. Deploy.
8. Use o domínio público gerado pelo Railway.
