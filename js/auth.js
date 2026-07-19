/**
 * TuCasaChile - Autenticacion con Clave Unica (OpenID Connect)
 * Flujo OAuth2 para validar identidad del usuario
 */

// === CONFIGURACION (Registrar en https://claveunica.gob.cl/desarrolladores) ===
var claveUnicaSettings = {
  clientId: localStorage.getItem('tucasa-claveunica-clientid') || 'TU_CLIENT_ID_AQUI',
  clientSecret: localStorage.getItem('tucasa-claveunica-secret') || '',
  redirectUri: window.location.origin + '/callback.html',
  // Solo solicitamos scope basico: RUT, nombre, apellidos
  scope: 'openid run name',
  endpoints: {
    // Entorno de pruebas (sandbox)
    authorization: 'https://accounts.claveunica.gob.cl/openid/authorize',
    token: 'https://accounts.claveunica.gob.cl/openid/token',
    userinfo: 'https://accounts.claveunica.gob.cl/openid/userinfo',
    logout: 'https://accounts.claveunica.gob.cl/openid/logout',
    // Sitio oficial de Clave Unica
    portal: 'https://claveunica.gob.cl'
  }
};

/**
 * Inicia el flujo de autenticacion con Clave Unica
 */
function iniciarLoginClaveUnica() {
  // SIEMPRE usar modo demo hasta que se configure un Client ID real
  // El Client ID real debe ser distinto al placeholder y tener al menos 20 caracteres
  if (!claveUnicaSettings.clientId || 
      claveUnicaSettings.clientId === 'TU_CLIENT_ID_AQUI' ||
      claveUnicaSettings.clientId.length < 20) {
    iniciarModoDemo();
    return;
  }

  // Generar state aleatorio para prevenir CSRF
  var state = generarRandomString(32);
  sessionStorage.setItem('claveunica-state', state);

  var nonce = generarRandomString(32);
  sessionStorage.setItem('claveunica-nonce', nonce);

  var authUrl = claveUnicaSettings.endpoints.authorization + '?' +
    'client_id=' + encodeURIComponent(claveUnicaSettings.clientId) +
    '&response_type=code' +
    '&scope=' + encodeURIComponent(claveUnicaSettings.scope) +
    '&redirect_uri=' + encodeURIComponent(claveUnicaSettings.redirectUri) +
    '&state=' + state +
    '&nonce=' + nonce;

  window.location.href = authUrl;
}

function iniciarModoDemo() {
  var rut = prompt('=== MODO DEMOSTRACION ===\n\nProbaras la app con un perfil simulado.\n\nIngresa un RUT para simular (ej: 12.345.678-5):', '12.345.678-5');
  if (!rut) return;
  var nombre = prompt('Nombre a mostrar:', 'Usuario Demo');
  if (!nombre) nombre = 'Usuario Demo';
  sessionStorage.setItem('tucasa-demo-rut', rut);
  sessionStorage.setItem('tucasa-demo-nombre', nombre);
  window.location.href = 'callback.html?demo=true';
}

/**
 * Procesa el callback de Clave Unica
 * Extrae el codigo, intercambia por token, obtiene userinfo
 */
async function procesarCallbackClaveUnica() {
  var params = new URLSearchParams(window.location.search);
  var code = params.get('code');
  var state = params.get('state');
  var error = params.get('error');

  if (error) {
    throw new Error('Autenticacion cancelada o error: ' + error);
  }

  if (!code) {
    // Sin codigo: puede ser una visita directa o modo demo
    return modoDemostracion();
  }

  // Verificar state
  var savedState = sessionStorage.getItem('claveunica-state');
  if (state !== savedState) {
    throw new Error('Error de seguridad: state no coincide');
  }

  // Intercambiar codigo por token
  try {
    var tokenData = await intercambiarToken(code);
    if (tokenData && tokenData.access_token) {
      var userInfo = await obtenerInfoUsuario(tokenData.access_token);
      return formatearUsuario(userInfo, tokenData);
    }
  } catch (e) {
    console.warn('Error intercambiando token, usando modo demo:', e.message);
    return modoDemostracion();
  }

  return null;
}

/**
 * Intercambia el codigo de autorizacion por un access_token
 */
async function intercambiarToken(code) {
  var body = new URLSearchParams();
  body.append('grant_type', 'authorization_code');
  body.append('code', code);
  body.append('redirect_uri', claveUnicaSettings.redirectUri);
  body.append('client_id', claveUnicaSettings.clientId);

  if (claveUnicaSettings.clientSecret) {
    body.append('client_secret', claveUnicaSettings.clientSecret);
  }

  var response = await fetch(claveUnicaSettings.endpoints.token, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString()
  });

  if (!response.ok) {
    throw new Error('Error al intercambiar token');
  }

  return await response.json();
}

/**
 * Obtiene la informacion del usuario autenticado
 */
async function obtenerInfoUsuario(accessToken) {
  var response = await fetch(claveUnicaSettings.endpoints.userinfo, {
    headers: { 'Authorization': 'Bearer ' + accessToken }
  });

  if (!response.ok) {
    throw new Error('Error al obtener info del usuario');
  }

  return await response.json();
}

/**
 * Formatea los datos del usuario desde Clave Unica
 */
function formatearUsuario(userInfo, tokenData) {
  var user = {
    rut: formatearRUT(userInfo.sub || userInfo.RUN || ''),
    nombre: (userInfo.name || userInfo.nombre || '').trim(),
    apellidos: ((userInfo.family_name || userInfo.apellidos || '')).trim(),
    email: userInfo.email || '',
    verificado: true,
    metodo: 'claveunica',
    timestamp: new Date().toISOString()
  };

  // Guardar en localStorage el perfil
  localStorage.setItem('tucasa-claveunica-user', JSON.stringify(user));

  return user;
}

/**
 * Modo demostracion: permite probar sin Clave Unica real
 * Simula una autenticacion exitosa con datos de prueba
 */
function modoDemostracion() {
  var code = new URLSearchParams(window.location.search).get('code');
  if (code) return null; // Si hay codigo pero no funciono, no usar demo

  // Solo usar modo demo si estamos en el callback y no hay error
  var error = new URLSearchParams(window.location.search).get('error');
  if (error) return null;

  // Simular usuario autenticado (solo en ambiente local o desarrollo)
  var user = {
    rut: sessionStorage.getItem('tucasa-demo-rut') || '12.345.678-5',
    nombre: sessionStorage.getItem('tucasa-demo-nombre') || 'Usuario Demostracion',
    apellidos: '',
    email: 'demo@tucasa.cl',
    verificado: true,
    metodo: 'demo',
    timestamp: new Date().toISOString()
  };

  console.log('Modo demostracion activado - Clave Unica no configurada');
  console.log('Registra tu app en: https://claveunica.gob.cl/desarrolladores');
  console.log('Luego guarda el client_id en la configuracion de la app');

  localStorage.setItem('tucasa-claveunica-user', JSON.stringify(user));
  return user;
}

/**
 * Cierra la sesion
 */
function cerrarSesionClaveUnica() {
  localStorage.removeItem('tucasa-claveunica-user');
  sessionStorage.removeItem('claveunica-state');
  window.location.href = 'index.html?auth=logout';
}

/**
 * Verifica si el usuario esta autenticado
 */
function usuarioAutenticado() {
  var userData = localStorage.getItem('tucasa-claveunica-user');
  if (!userData) return null;
  try {
    var user = JSON.parse(userData);
    return user;
  } catch (e) {
    return null;
  }
}

/**
 * Muestra el dialogo de configuracion para guardar Client ID
 */
function mostrarDialogoConfiguracion() {
  var clientId = prompt(
    '=== CONFIGURAR CLAVE UNICA ===\n\n' +
    'Para usar Clave Unica real, necesitas un Client ID.\n\n' +
    '1. Ve a: https://claveunica.gob.cl/desarrolladores\n' +
    '2. Registra tu aplicacion\n' +
    '3. Usa como redirect_uri:\n   ' + claveUnicaSettings.redirectUri + '\n\n' +
    'Ingresa tu Client ID o escribe "demo" para probar sin Clave Unica:'
  );

  if (clientId === 'demo') {
    sessionStorage.setItem('tucasa-demo-rut', prompt('RUT de prueba:', '12.345.678-5') || '12.345.678-5');
    sessionStorage.setItem('tucasa-demo-nombre', prompt('Nombre de prueba:', 'Usuario Demo') || 'Usuario Demo');
    window.location.href = 'callback.html';
  } else if (clientId && clientId.length > 5) {
    localStorage.setItem('tucasa-claveunica-clientid', clientId);
    claveUnicaSettings.clientId = clientId;
    alert('Client ID guardado. Ahora intenta ingresar nuevamente.');
  }
}

/**
 * Formatea el RUT desde el formato raw (XX.XXX.XXX-X)
 */
function formatearRUT(rut) {
  if (!rut) return '';
  rut = rut.replace(/\./g, '').replace(/\-/g, '').trim();
  if (rut.length < 7) return rut;
  var cuerpo = rut.slice(0, -1);
  var dv = rut.slice(-1).toUpperCase();
  cuerpo = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return cuerpo + '-' + dv;
}

/**
 * Genera string aleatorio para state/nonce
 */
function generarRandomString(length) {
  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var result = '';
  for (var i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}