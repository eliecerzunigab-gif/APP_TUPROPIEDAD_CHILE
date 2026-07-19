/**
 * TuCasaChile - Autenticacion con Clave Unica (OpenID Connect)
 * Flujo OAuth2 para validar identidad del usuario
 * 
 * SOLO extrae: RUT, nombre, apellidos (scope: openid run name)
 * NO guarda datos bancarios, crediticios ni personales
 * Datos de sesion se eliminan al cerrar el navegador
 */

// === CONFIGURACION ===
// Para usar Clave Unica REAL:
// 1. Registrate en https://claveunica.gob.cl/desarrolladores
// 2. Crea una aplicacion con:
//    - Nombre: TuCasaChile
//    - Redirect URI: https://TU_DOMINIO/callback.html
//    - Scope: openid run name
// 3. Copia el Client ID y Client Secret aqui
var claveUnicaSettings = {
  clientId: localStorage.getItem('tucasa-claveunica-clientid') || '',
  clientSecret: localStorage.getItem('tucasa-claveunica-secret') || '',
  redirectUri: (function() {
    // Construir URL base correcta para cualquier entorno (local, GitHub Pages, etc)
    var base = window.location.origin + window.location.pathname;
    // Quitar index.html si esta presente
    base = base.replace(/index\.html$/, '');
    // Asegurar que termine con /
    if (!base.endsWith('/')) base += '/';
    return base + 'callback.html';
  })(),
  scope: 'openid run name',  // SOLO: identidad + RUT + nombre
  endpoints: {
    authorization: 'https://accounts.claveunica.gob.cl/openid/authorize',
    token: 'https://accounts.claveunica.gob.cl/openid/token',
    userinfo: 'https://accounts.claveunica.gob.cl/openid/userinfo',
    logout: 'https://accounts.claveunica.gob.cl/openid/logout'
  }
};

// =============================================
// CLIENT ID TEMPORAL para GitHub Pages
// Reemplazar con el tuyo tras registro en:
// https://claveunica.gob.cl/desarrolladores
// =============================================
// Si tienes un Client ID real, pegalo aqui:
// var MI_CLIENT_ID = "tu-client-id-de-clave-unica";
// localStorage.setItem('tucasa-claveunica-clientid', MI_CLIENT_ID);

/**
 * Verifica si hay un Client ID valido configurado
 */
function tieneClaveUnicaReal() {
  var id = claveUnicaSettings.clientId;
  return id && id.length >= 20 && id !== 'TU_CLIENT_ID_AQUI';
}

/**
 * Inicia el flujo de autenticacion con Clave Unica real
 */
function iniciarLoginClaveUnica() {
  if (tieneClaveUnicaReal()) {
    iniciarClaveUnicaReal();
  } else {
    mostrarOpcionesClaveUnica();
  }
}

/**
 * Muestra opciones: registrar Client ID o probar en modo demo
 */
function mostrarOpcionesClaveUnica() {
  var opcion = confirm(
    '=== CLAVE UNICA - IDENTIDAD OFICIAL ===\n\n' +
    '¿Deseas ingresar con Clave Unica REAL?\n\n' +
    'Haz clic en Aceptar para configurar tu Client ID\n' +
    '(Necesitas registrar tu app en claveunica.gob.cl)\n\n' +
    'Haz clic en Cancelar para probar en modo demo'
  );

  if (opcion) {
    // Intentar configurar Client ID
    var clientId = prompt(
      '=== CONFIGURAR CLAVE UNICA REAL ===\n\n' +
      'Pasos previos:\n' +
      '1. Ve a: https://claveunica.gob.cl/desarrolladores\n' +
      '2. Inicia sesion con tu Clave Unica\n' +
      '3. Crea una aplicacion nueva\n' +
      '4. Usa como redirect_uri exactamente:\n   ' + claveUnicaSettings.redirectUri + '\n' +
      '5. Copia el Client ID generado\n\n' +
      'Pega aqui tu Client ID:'
    );

    if (clientId && clientId.length >= 20) {
      localStorage.setItem('tucasa-claveunica-clientid', clientId);
      claveUnicaSettings.clientId = clientId;
      alert('✅ Client ID guardado. Ahora intenta ingresar nuevamente.');
      iniciarLoginClaveUnica();
    } else if (clientId) {
      alert('❌ El Client ID ingresado no es valido. Debe tener al menos 20 caracteres.');
    }
  } else {
    // Modo demo: sin Clave Unica, solo simulado
    iniciarModoDemo();
  }
}

/**
 * Flujo REAL de Clave Unica (OAuth2 / OpenID Connect)
 */
function iniciarClaveUnicaReal() {
  var state = generarRandomString(32);
  var nonce = generarRandomString(32);

  // Guardar state y nonce SOLO en sessionStorage (se borra al cerrar)
  sessionStorage.setItem('claveunica-state', state);
  sessionStorage.setItem('claveunica-nonce', nonce);

  var authUrl = claveUnicaSettings.endpoints.authorization + '?' +
    'client_id=' + encodeURIComponent(claveUnicaSettings.clientId) +
    '&response_type=code' +
    '&scope=' + encodeURIComponent(claveUnicaSettings.scope) +
    '&redirect_uri=' + encodeURIComponent(claveUnicaSettings.redirectUri) +
    '&state=' + state +
    '&nonce=' + nonce;

  console.log('🔐 Redirigiendo a Clave Unica...');
  window.location.href = authUrl;
}

/**
 * Modo demo: prueba sin Clave Unica real
 */
function iniciarModoDemo() {
  var rut = prompt('=== MODO DEMOSTRACION ===\n\nSimulacion de identidad. No usa Clave Unica real.\n\nIngresa un RUT (ej: 12.345.678-5):', '12.345.678-5');
  if (!rut) return;

  var nombre = prompt('Nombre:', 'Usuario Demo');
  if (!nombre) nombre = 'Usuario Demo';

  // Guardar SOLO en sessionStorage (se borra al cerrar)
  sessionStorage.setItem('tucasa-demo-rut', rut);
  sessionStorage.setItem('tucasa-demo-nombre', nombre);
  window.location.href = 'callback.html?demo=true';
}

/**
 * Procesa el callback de Clave Unica
 */
async function procesarCallbackClaveUnica() {
  var params = new URLSearchParams(window.location.search);
  var code = params.get('code');
  var state = params.get('state');
  var error = params.get('error');
  var esDemo = params.get('demo');

  if (error) {
    console.error('❌ Clave Unica error:', error);
    throw new Error('Autenticacion cancelada');
  }

  if (esDemo === 'true') {
    return modoDemostracion();
  }

  if (!code) {
    return modoDemostracion();
  }

  // Verificar state anti-CSRF
  var savedState = sessionStorage.getItem('claveunica-state');
  if (state !== savedState) {
    throw new Error('Error de seguridad: state no coincide');
  }

  // Intercambiar codigo por token
  try {
    console.log('🔄 Intercambiando codigo por token...');
    var tokenData = await intercambiarToken(code);

    if (tokenData && tokenData.access_token) {
      console.log('✅ Token obtenido, consultando datos del usuario...');
      var userInfo = await obtenerInfoUsuario(tokenData.access_token);
      return formatearUsuario(userInfo);
    }
  } catch (e) {
    console.error('❌ Error en autenticacion Clave Unica:', e.message);
    throw new Error('No se pudo completar la autenticacion: ' + e.message);
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
  body.append('client_secret', claveUnicaSettings.clientSecret);

  var response = await fetch(claveUnicaSettings.endpoints.token, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString()
  });

  if (!response.ok) {
    var errorText = await response.text();
    throw new Error('Token exchange failed: ' + errorText);
  }

  return await response.json();
}

/**
 * Obtiene la informacion del usuario autenticado
 * SOLO extrae: RUT, nombre, apellidos (scope openid run name)
 */
async function obtenerInfoUsuario(accessToken) {
  var response = await fetch(claveUnicaSettings.endpoints.userinfo, {
    headers: { 'Authorization': 'Bearer ' + accessToken }
  });

  if (!response.ok) throw new Error('Error al obtener datos del usuario');

  return await response.json();
}

/**
 * Formatea los datos del usuario desde Clave Unica
 * SOLO extrae: RUT y nombre (info publica basica)
 * NO guarda datos sensibles ni crediticios
 */
function formatearUsuario(userInfo) {
  var user = {
    rut: formatearRUT(userInfo.sub || userInfo.RUN || userInfo.RUT || ''),
    nombre: (userInfo.name || userInfo.nombre || userInfo.given_name || 'Usuario').trim(),
    apellidos: (userInfo.family_name || userInfo.apellidos || '').trim(),
    verificado: true,
    metodo: 'claveunica',
    timestamp: new Date().toISOString()
  };

  // Guardar SOLO en sessionStorage (se borra al cerrar el navegador)
  // NO se guardan datos en localStorage para proteger la privacidad
  sessionStorage.setItem('tucasa-claveunica-user', JSON.stringify(user));

  console.log('✅ Usuario autenticado via Clave Unica');
  console.log('📋 RUT:', user.rut);
  console.log('👤 Nombre:', user.nombre);
  console.log('💡 Datos solo en sesion. Se eliminan al cerrar navegador.');

  return user;
}

/**
 * Modo demostracion
 */
function modoDemostracion() {
  var user = {
    rut: sessionStorage.getItem('tucasa-demo-rut') || '12.345.678-5',
    nombre: sessionStorage.getItem('tucasa-demo-nombre') || 'Usuario Demo',
    apellidos: '',
    verificado: true,
    metodo: 'demo',
    timestamp: new Date().toISOString()
  };

  sessionStorage.setItem('tucasa-claveunica-user', JSON.stringify(user));
  return user;
}

/**
 * Cierra la sesion y elimina TODOS los datos
 */
function cerrarSesionClaveUnica() {
  sessionStorage.removeItem('tucasa-claveunica-user');
  sessionStorage.removeItem('claveunica-state');
  sessionStorage.removeItem('tucasa-demo-rut');
  sessionStorage.removeItem('tucasa-demo-nombre');
  window.location.href = 'index.html?auth=logout';
}

/**
 * Verifica si el usuario esta autenticado (sesion activa)
 */
function usuarioAutenticado() {
  var userData = sessionStorage.getItem('tucasa-claveunica-user');
  if (!userData) return null;
  try {
    return JSON.parse(userData);
  } catch (e) {
    return null;
  }
}

/**
 * Formatea el RUT
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

function generarRandomString(length) {
  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var result = '';
  for (var i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}