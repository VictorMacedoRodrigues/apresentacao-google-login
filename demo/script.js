'use strict';
// Client ID público preservado do projeto original. Nunca coloque Client Secret aqui.
const CLIENT_ID = '94457593553-5bet35ekjces255rl0kaesu289ev8h9h.apps.googleusercontent.com';
const $ = id => document.getElementById(id);
let sdkPromise = null;
let initialized = false;
let profileVisible = false;
let photoVersion = 0;

// snippet:load:start
function loadGoogleSDK() {
  if (window.google?.accounts?.id) return Promise.resolve();
  if (sdkPromise) return sdkPromise;
  sdkPromise = new Promise((resolve, reject) => {
    const sdk = document.createElement('script');
    sdk.src = 'https://accounts.google.com/gsi/client?hl=pt-BR';
    sdk.async = true;
    const timer = setTimeout(() => finish(false), 15000);
    let settled = false;
    function finish(ok) {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      sdk.onload = sdk.onerror = null;
      if (ok) resolve();
      else { sdk.remove(); reject(new Error('Não foi possível carregar o Google.')); }
    }
    sdk.onload = () => finish(Boolean(window.google?.accounts?.id));
    sdk.onerror = () => finish(false);
    document.head.append(sdk);
  }).catch(error => { sdkPromise = null; throw error; });
  return sdkPromise;
}
// snippet:load:end

// snippet:initialize:start
function renderGoogleButton() {
  if (!initialized) {
    google.accounts.id.initialize({
      client_id: CLIENT_ID,
      callback: receiveCredential,
      auto_select: false,
      ux_mode: 'popup'
    });
    initialized = true;
  }
  $('googleButton').replaceChildren();
  google.accounts.id.renderButton($('googleButton'), {
    theme: 'outline', size: 'large', width: 240, locale: 'pt-BR'
  });
}
// snippet:initialize:end

// Apenas lê o payload para a apresentação; NÃO verifica a assinatura do token.
function decodeProfile(token) {
  if (typeof token !== 'string' || token.length > 40000) throw Error('Token inválido');
  const parts = token.split('.');
  if (parts.length !== 3) throw Error('Formato inválido');
  const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
  const bytes = Uint8Array.from(atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, '=')), c => c.charCodeAt(0));
  const data = JSON.parse(new TextDecoder().decode(bytes));
  if (!data || data.aud !== CLIENT_ID ||
      !['accounts.google.com', 'https://accounts.google.com'].includes(data.iss) ||
      typeof data.exp !== 'number' || data.exp * 1000 <= Date.now() ||
      typeof data.sub !== 'string' || !data.sub) throw Error('Credencial inconsistente');
  return {
    name: typeof data.name === 'string' ? data.name.slice(0, 160) : 'Estudante',
    email: typeof data.email === 'string' ? data.email.slice(0, 260) : 'Não informado',
    picture: typeof data.picture === 'string' ? data.picture : ''
  };
}

// snippet:callback:start
function receiveCredential(response) {
  try {
    const profile = decodeProfile(response.credential);
    showProfile(profile, 'google');
  } catch {
    $('loginStatus').textContent = 'Não foi possível ler a credencial. Tente novamente.';
  }
}
// snippet:callback:end

function setPhoto(picture, mode) {
  const image = $('profilePhoto');
  const version = ++photoVersion;
  image.hidden = true;
  image.removeAttribute('src');
  $('profileInitials').hidden = false;
  let url = '';
  if (mode === 'demo') url = 'avatar.svg';
  else {
    try {
      const parsed = new URL(picture);
      if (parsed.protocol === 'https:' && ['googleusercontent.com', 'ggpht.com'].some(host =>
          parsed.hostname === host || parsed.hostname.endsWith('.' + host))) url = parsed.href;
    } catch { /* Sem foto válida: exibir iniciais. */ }
  }
  image.onload = () => {
    if (version !== photoVersion || !profileVisible) return;
    image.hidden = false;
    $('profileInitials').hidden = true;
  };
  image.onerror = () => {
    if (version !== photoVersion) return;
    image.hidden = true;
    $('profileInitials').hidden = false;
  };
  if (url) image.src = url;
}

// snippet:profile:start
function showProfile(profile, mode) {
  profileVisible = true;
  $('profileName').textContent = profile.name;
  $('profileEmail').textContent = profile.email;
  $('profileInitials').textContent = profile.name.trim().split(/\s+/)
    .slice(0, 2).map(part => Array.from(part)[0] || '').join('');
  $('modeBadge').textContent = mode === 'demo'
    ? 'Simulação • perfil fictício'
    : 'Google • perfil recebido, sem validação no servidor';
  setPhoto(profile.picture, mode);
  $('loginView').hidden = true;
  $('dashboard').hidden = false;
  $('dashboardTitle').focus();
}
// snippet:profile:end

// snippet:demo:start
$('demoLogin').addEventListener('click', () => {
  showProfile({
    name: 'Ana Exemplo', email: 'ana@example.com', picture: 'avatar.svg'
  }, 'demo');
});
// snippet:demo:end

$('loadGoogle').addEventListener('click', async () => {
  if (location.protocol === 'file:') {
    $('loginStatus').textContent = 'Para o Google, abra por localhost ou HTTPS. A simulação funciona neste arquivo.';
    return;
  }
  $('loadGoogle').disabled = true;
  $('loginStatus').textContent = 'Carregando o componente oficial…';
  try {
    await loadGoogleSDK();
    renderGoogleButton();
    $('loadGoogle').hidden = true;
    $('loginStatus').textContent = 'Selecione sua conta no botão oficial. Erro de origem? Consulte o README para autorizar este endereço.';
  } catch {
    $('loginStatus').textContent = 'O Google não carregou. Verifique a conexão e tente novamente, ou use a simulação.';
  } finally { $('loadGoogle').disabled = false; }
});

// snippet:logout:start
$('logout').addEventListener('click', () => {
  profileVisible = false;
  photoVersion++;
  $('profilePhoto').onload = $('profilePhoto').onerror = null;
  $('profilePhoto').removeAttribute('src');
  $('profileName').textContent = $('profileEmail').textContent = '';
  $('profileInitials').textContent = $('modeBadge').textContent = '';
  $('dashboard').hidden = true;
  $('loginView').hidden = false;
  window.google?.accounts?.id?.disableAutoSelect();
  $('loginStatus').textContent = 'Perfil removido desta página. Sua conta Google continua conectada ao Google.';
  $('demoLogin').focus();
});
// snippet:logout:end
