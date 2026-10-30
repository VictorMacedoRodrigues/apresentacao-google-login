# Campus — um site para mostrar o login com Google na prática

Portal acadêmico com seis aulas ilustrativas, busca, filtros por assunto, leitura de aulas e área de perfil. Não realiza matrículas ou cobranças.

- [Site Campus](https://victormacedorodrigues.github.io/apresentacao-google-login/demo/)
- [Apresentação](https://victormacedorodrigues.github.io/apresentacao-google-login/)

O site usa exclusivamente o botão oficial do Google. Não existe perfil fictício ou entrada offline. Os códigos foram retirados da interface e dos dez slides. A apresentação usa exemplos cotidianos para explicar três motivos diferentes: reduzir etapas do primeiro cadastro, reconhecer uma conta que voltou e delegar a gestão da senha Google.

## Arquivos e execução

`index.html` e `API_autenticacao_google.html` contêm a mesma apresentação. `style.css` e `script.js` cuidam da aparência e navegação. O site tem seus próprios `demo/index.html`, `demo/style.css` e `demo/script.js`.

Não exige instalação de dependências. Abra o endereço publicado ou use `python -m http.server 8000` na pasta do projeto. O login requer internet e uma origem autorizada; não funciona em `file://`.

Nos slides: setas ou botões navegam; Home vai ao início; End vai ao teste; F ativa tela cheia; B pausa. No celular, role o slide verticalmente. A impressão mostra os dez slides.

## Testar o Campus

Explore os seis cursos, use uma categoria e busque por uma palavra. Abra uma aula para ler o conteúdo e o exercício. Clique em **Entrar**, **Minha área** ou no botão de conclusão de uma aula para entrar com Google. O perfil recebido aparece na área pessoal. **Sair** remove o perfil da página e não desconecta a conta Google de outros serviços.

O catálogo e as aulas são públicos. O progresso é salvo apenas neste navegador, sem associação a uma conta remota; não sincroniza entre aparelhos e pode ser visto por outras pessoas que usem o mesmo navegador. Não são salvos nome, e-mail, foto ou token no armazenamento local. Recarregar remove o perfil e exige nova entrada para exibi-lo.

## Configuração do Google

O Client ID público original está na constante `CLIENT_ID`, em `demo/script.js`. O proprietário precisa autorizar a origem `https://victormacedorodrigues.github.io`, sem o nome do repositório ou `/demo/`.

Para outro projeto, configure Google Auth Platform no Google Cloud Console, a tela de consentimento e o público; crie um cliente OAuth para **Aplicativo da Web** e autorize as origens JavaScript utilizadas. Para teste local, inclua `http://localhost:8000` ou a porta escolhida. Adicione usuários de teste quando exigido. Substitua apenas o Client ID público no JavaScript, sem incluir Client Secret.

O fluxo usa popup e callback no navegador. Falhas de origem ou cliente precisam ser corrigidas na configuração do Google; não há uma entrada alternativa que simule autenticação.

## Limite de segurança

O botão usa o serviço real do Google, mas este é um projeto estático no GitHub Pages. O código lê os dados e confere campos de consistência; **não valida a assinatura, não cria sessão no servidor e não protege recursos privados**. A apresentação explica essa diferença com a analogia de conferir um crachá.

Em produção, envie a credencial ao backend por HTTPS, valide assinatura, emissor, audiência e expiração com uma biblioteca adequada, use `sub` para localizar a conta e crie uma sessão segura. Proteja o endpoint conforme o fluxo, inclusive contra CSRF. Quem salva pedidos, cursos e progresso em outros aparelhos é o próprio serviço, não o login Google.

## Publicação

GitHub Pages publica a branch `main`, pasta `/ (root)`. Envie os arquivos mantendo a pasta `demo` e aguarde a publicação.

## Referências oficiais

- [Botão do Google](https://developers.google.com/identity/gsi/web/guides/display-button)
- [Configurar Client ID](https://developers.google.com/identity/gsi/web/guides/get-google-api-clientid)
- [Verificar credencial no servidor](https://developers.google.com/identity/gsi/web/guides/verify-google-id-token)
