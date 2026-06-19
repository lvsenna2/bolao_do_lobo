# Bolão do Lobo - Firebase gratuito

Esta versão foi adaptada para usar:

- Firebase Hosting
- Firebase Authentication
- Firestore Database

É a melhor opção gratuita para começar, sem servidor Node 24h e funcionando no celular.

## 1. Criar projeto Firebase

Acesse:

https://console.firebase.google.com

Crie um projeto: bolao-do-lobo

## 2. Ativar Authentication

No Firebase:

Authentication > Sign-in method > Email/Password > Enable

## 3. Criar Firestore

Firestore Database > Create database

Use production mode.

## 4. Copiar firebaseConfig

No Firebase:

Project settings > Your apps > Web app

Copie o firebaseConfig.

Cole esse config em dois arquivos:

public/app.js
seed/seed.js

Substitua:

COLE_AQUI

## 5. Criar usuários e jogos

No terminal, dentro da pasta seed:

npm install
npm run seed

Isso cria:
- participantes
- ADM
- jogos
- resultados já lançados

## 6. Instalar Firebase CLI

npm install -g firebase-tools

Depois:

firebase login

## 7. Publicar

Na pasta principal:

firebase init hosting firestore

Escolha:
- Hosting
- Firestore
- Use existing project
- Public directory: public
- Single-page app: yes
- Do not overwrite index.html

Depois:

firebase deploy

## 8. Link público

O Firebase vai gerar um link tipo:

https://bolao-do-lobo.web.app

Esse é o link para enviar aos palpiteiros.

## Acessos

ADM:
admin@bolao.local
admin123

Participantes:
carlao@bolao.local
123456

doutormikto@bolao.local
123456

Todos os outros seguem o mesmo padrão:
usuario@bolao.local
123456
