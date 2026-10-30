# Autenticação com Google — apresentação + Campus

Trabalho educacional em português com 13 slides e um portal de estudos funcional para demonstrar a interface de login.

## Arquivos

- `index.html`: apresentação principal.
- `API_autenticacao_google.html`: mesma apresentação no endereço original, preservado para os links existentes.
- `style.css` e `script.js`: estilos e navegação da apresentação.
- `demo/index.html`, `demo/style.css` e `demo/script.js`: site Campus, com estrutura, aparência e lógica separadas.
- `demo/avatar.svg`: foto ilustrativa do perfil fictício.

Não há instalação de dependências nem etapa de compilação.

## Executar

Na pasta do projeto, com Python instalado:

```sh
python -m http.server 8000
```

Abra `http://localhost:8000` para os slides e `http://localhost:8000/demo/` para o site. Também é possível usar uma extensão de servidor local, como Live Server, autorizando a porta correspondente no Google.

Abrir `index.html` diretamente permite apresentar os slides e testar o perfil fictício. O login Google exige uma origem HTTP em localhost ou HTTPS na publicação; não funciona em `file://`.

Nos slides: setas ou botões avançam e voltam; Home vai ao início; End vai ao teste; F ativa tela cheia; B pausa. No celular, cada slide permite rolagem vertical. O botão do último slide abre o site em outra aba, preservando a apresentação.

## Modos de teste

### Simulação — pronta para usar

1. No último slide, clique em **Abrir site de demonstração**.
2. Clique em **Experimentar com perfil fictício**.
3. Confira o nome Ana Exemplo, e-mail `ana@example.com`, avatar ilustrativo e os cards de estudos.
4. A indicação **Simulação • perfil fictício** permanece visível.
5. Clique em **Sair do exemplo** para limpar o perfil e voltar à entrada.

Esse caminho não chama o Google e não autentica ninguém. Os cursos são conteúdo público ilustrativo, sem recursos protegidos. Não é necessário fornecer senha ou dados pessoais.

### Conta Google — exige configuração do proprietário

O botão **Carregar login com Google** carrega Google Identity Services; o botão oficial aparece em seguida. O Google conduz a escolha da conta e retorna uma credencial ao callback JavaScript. O site exibe os campos do perfil no navegador, com a indicação de ausência de validação no servidor. A senha é tratada pelo Google.

O Client ID público do trabalho original foi preservado em `demo/script.js`, na constante `CLIENT_ID`. Ele identifica a aplicação; não é um Client Secret. Não é possível confirmar ou alterar as origens permitidas apenas com esse identificador.

Para usar seu próprio projeto:

1. Acesse [Google Cloud Console](https://console.cloud.google.com/) e selecione ou crie um projeto.
2. Em **Google Auth Platform**, configure Branding, Audience e os contatos exigidos para a tela de consentimento. Se a aplicação estiver em teste e sua configuração exigir usuários de teste, adicione as contas que participarão.
3. Em **Clients** (ou **APIs e serviços → Credenciais**, conforme a interface), crie um Client ID OAuth do tipo **Aplicativo da Web**.
4. Adicione às **Origens JavaScript autorizadas** os endereços usados, como `http://localhost:8000` e `https://victormacedorodrigues.github.io`. A origem contém protocolo, domínio e porta quando aplicável; não inclui `/demo/` nem o nome do repositório.
5. Substitua somente `CLIENT_ID` em `demo/script.js` pelo identificador terminado em `.apps.googleusercontent.com`.
6. Aguarde a propagação da configuração e teste pelo endereço autorizado.

Este exemplo usa popup e callback no navegador, sem `login_uri`; não configura um fluxo de redirecionamento. Não coloque Client Secret, senha, chave privada ou tokens no repositório.

O Google pode exigir consentimento ou aplicar restrições conforme a conta, a configuração e as políticas do navegador. Se o botão não carregar, confira a rede e bloqueadores. Se houver erro de origem ou Client ID, confira a configuração acima. A simulação permanece disponível.

## O que o código faz

Os seis cards do site contêm trechos reais de `demo/script.js`: carregar a biblioteca, inicializar o botão, receber a credencial, exibir o perfil, simular e sair. Dois slides também mostram as funções principais.

O Google fornece a biblioteca, a escolha da conta e o ID Token. O site carrega essa biblioteca, recebe o retorno e altera sua própria interface. O exemplo usa `textContent` para exibir dados e limita as fotos remotas a domínios de imagem do Google, com iniciais como alternativa. Nome, e-mail e foto ficam na interface enquanto a página estiver aberta; o site não salva tokens em armazenamento local nem os registra no console. Sair remove o perfil da página e não encerra a conta Google nos outros serviços.

`decodeProfile` apenas decodifica o JWT e faz verificações de consistência de audiência, emissor, expiração e identificador. **Isso não valida a assinatura e não constitui uma autenticação de produção.** O exemplo não implementa backend, sessão segura ou controle de acesso.

Em produção, envie a credencial ao servidor por HTTPS, valide assinatura, `iss`, `aud` e `exp` com uma biblioteca adequada, associe `sub` ao usuário local e crie uma sessão segura. Proteja o endpoint contra CSRF conforme o fluxo adotado. O servidor deve verificar permissões a cada recurso protegido. Entrar com Google não concede acesso automático ao Gmail ou ao Drive.

## Publicar no GitHub Pages

1. Envie todos os arquivos, incluindo as pastas e os arquivos CSS e JS, para o repositório.
2. Em **Settings → Pages**, selecione **Deploy from a branch**, branch `main` e pasta `/ (root)`.
3. Salve e aguarde o endereço confirmado pelo GitHub. Para este repositório, o endereço esperado é `https://victormacedorodrigues.github.io/apresentacao-google-login/`.
4. Autorize a origem `https://victormacedorodrigues.github.io` no Client ID que estiver em uso.
5. Abra a apresentação publicada; o botão do teste leva a `demo/index.html` no mesmo projeto.

O endereço acima é o esperado para essa configuração, não uma confirmação de publicação. O GitHub Pages serve arquivos estáticos; ele não substitui um backend para validação de identidade e sessão.

## Checklist para apresentar

- Navegar pelos 13 slides e abrir o site pelo último.
- Entrar pela simulação, conferir o perfil e sair; repetir o ciclo.
- Abrir os seis cards e comparar os trechos com `demo/script.js`.
- Em um endereço autorizado, carregar o botão oficial e escolher uma conta.
- Conferir a indicação de modo Google e a ressalva sobre validação.
- Recarregar a página e verificar que o perfil desaparece.
- Conferir também em uma janela estreita, como a de um celular.

## Referências oficiais

- [Exibir o botão de login](https://developers.google.com/identity/gsi/web/guides/display-button)
- [Configurar o projeto e o Client ID](https://developers.google.com/identity/gsi/web/guides/get-google-api-clientid)
- [Validar o ID Token no servidor](https://developers.google.com/identity/gsi/web/guides/verify-google-id-token)
- [Publicar pelo GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
