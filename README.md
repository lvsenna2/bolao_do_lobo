# Bolão do Lobo V11 - Login Google corrigido

Correções:
- Botões de login agora usam addEventListener.
- Login Google com popup.
- Se o popup falhar, tenta redirect.
- Mensagem de erro aparece na tela.
- Imports do Firebase organizados no topo do app.js.

Suba esta versão no GitHub substituindo a anterior.

Antes de testar:
1. Firebase Console > Authentication > Sign-in method > Google > Ativado
2. Authentication > Settings > Authorized domains:
   - bolaodolobo-e867e.web.app
   - bolaodolobo-e867e.firebaseapp.com
