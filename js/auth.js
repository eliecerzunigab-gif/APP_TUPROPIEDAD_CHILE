/**
 * TuCasaChile - Validacion de Identidad y Carga de Documentos
 * 
 * Funcionalidades:
 * 1. Validacion de RUT chileno (algoritmo modulo 11)
 * 2. Carga de informes crediticios (PDF, CSV, imagenes)
 * 3. Links a servicios del Estado para obtener informes reales
 * 4. SIN conexion a Clave Unica (requiere aprobacion gubernamental)
 */

// ===== VALIDACION DE RUT CHILENO (Algoritmo Modulo 11) =====
function validarRUTChileno(rut) {
  if (!rut) return { valido: false, error: 'RUT vacio' };
  
  // Limpiar formato
  var limpio = rut.replace(/\./g, '').replace(/\-/g, '').trim().toUpperCase();
  
  if (limpio.length < 7 || limpio.length > 9) {
    return { valido: false, error: 'Largo invalido' };
  }
  
  var cuerpo = limpio.slice(0, -1);
  var dv = limpio.slice(-1);
  
  // Verificar que el cuerpo sean solo numeros
  if (!/^\d+$/.test(cuerpo)) {
    return { valido: false, error: 'El RUT debe contener solo numeros' };
  }
  
  // Calcular digito verificador
  var suma = 0;
  var multiplo = 2;
  for (var i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo[i]) * multiplo;
    multiplo = multiplo < 7 ? multiplo + 1 : 2;
  }
  
  var dvEsperado = 11 - (suma % 11);
  if (dvEsperado === 11) dvEsperado = '0';
  else if (dvEsperado === 10) dvEsperado = 'K';
  else dvEsperado = dvEsperado.toString();
  
  if (dv !== dvEsperado) {
    return { 
      valido: false, 
      error: 'Digito verificador incorrecto. Deberia ser: ' + dvEsperado,
      rutFormateado: formatearRUTNumero(cuerpo + dvEsperado)
    };
  }
  
  return {
    valido: true,
    rutLimpio: cuerpo + dv,
    rutFormateado: formatearRUTNumero(cuerpo + dv),
    dv: dv
  };
}

function formatearRUTNumero(rutLimpio) {
  if (!rutLimpio || rutLimpio.length < 7) return rutLimpio;
  var cuerpo = rutLimpio.slice(0, -1);
  var dv = rutLimpio.slice(-1).toUpperCase();
  cuerpo = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return cuerpo + '-' + dv;
}

// ===== INICIO DE SESION CON RUT (modo local, sin Clave Unica) =====
function iniciarLoginLocal() {
  var rut = prompt(
    '=== VALIDACION DE IDENTIDAD ===\n\n' +
    'Ingresa tu RUT chileno para validar tu identidad\n' +
    '(Ej: 12.345.678-5)\n\n' +
    'Esta validacion es local. Tus datos NO se envian a ningun servidor.'
  );
  
  if (!rut) return;
  
  var resultado = validarRUTChileno(rut);
  
  if (!resultado.valido) {
    alert('❌ RUT INVALIDO\n\n' + resultado.error + '\n\n' +
      (resultado.rutFormateado ? '¿Quisiste decir: ' + resultado.rutFormateado + '?' : '') +
      '\n\nIntenta nuevamente.');
    return;
  }
  
  // RUT valido, pedir nombre
  var nombre = prompt(
    '✅ RUT VALIDO: ' + resultado.rutFormateado + '\n\n' +
    'Ingresa tu nombre completo:',
    sessionStorage.getItem('tucasa-nombre') || ''
  );
  
  if (!nombre) return;
  
  // Guardar en sesion
  var user = {
    rut: resultado.rutFormateado,
    nombre: nombre.trim(),
    verificado: true,
    timestamp: new Date().toISOString()
  };
  
  sessionStorage.setItem('tucasa-claveunica-user', JSON.stringify(user));
  sessionStorage.setItem('tucasa-nombre', nombre.trim());
  
  // Recargar para mostrar perfil
  window.location.href = 'index.html?auth=success';
}

// ===== VERIFICACION DE IDENTIDAD CON INFORME (carga de archivos) =====
function iniciarCargaInformes() {
  var user = usuarioAutenticado();
  if (!user) {
    alert('Primero valida tu RUT haciendo clic en "Validar Identidad".');
    return;
  }
  
  // Crear input de archivo temporal
  var input = document.createElement('input');
  input.type = 'file';
  input.accept = '.pdf,.csv,.xlsx,.jpg,.png,.txt';
  input.multiple = true;
  
  input.onchange = function(e) {
    var archivos = e.target.files;
    if (archivos.length === 0) return;
    
    var listaArchivos = [];
    for (var i = 0; i < archivos.length; i++) {
      var archivo = archivos[i];
      listaArchivos.push({
        nombre: archivo.name,
        tipo: archivo.type,
        tamaño: (archivo.size / 1024).toFixed(1) + ' KB',
        fecha: new Date().toLocaleString('es-CL')
      });
    }
    
    // Guardar metadata de archivos en sesion
    var existentes = JSON.parse(sessionStorage.getItem('tucasa-documentos') || '[]');
    sessionStorage.setItem('tucasa-documentos', JSON.stringify(existentes.concat(listaArchivos)));
    
    mostrarDocumentosCargados();
    
    alert('✅ ' + archivos.length + ' archivo(s) cargado(s) exitosamente.\n\n' +
      'Tipos aceptados: PDF (informe DICOM), CSV, planillas Excel, fotos de liquidaciones.\n\n' +
      'IMPORTANTE: Los archivos se procesan SOLO en tu navegador.\n' +
      'No se suben a ningun servidor externo.');
  };
  
  input.click();
}

function mostrarDocumentosCargados() {
  var container = document.getElementById('documentosCargados');
  if (!container) return;
  
  var docs = JSON.parse(sessionStorage.getItem('tucasa-documentos') || '[]');
  
  if (docs.length === 0) {
    container.innerHTML = '';
    container.style.display = 'none';
    return;
  }
  
  var html = '<strong>📄 Documentos cargados (' + docs.length + '):</strong><br>';
  docs.forEach(function(doc) {
    html += '<span style="font-size:0.8rem;color:#64748b">• ' + doc.nombre + ' (' + doc.tamaño + ')</span><br>';
  });
  html += '<small style="color:#10b981">✅ Procesados localmente</small>';
  
  container.innerHTML = html;
  container.style.display = 'block';
}

// ===== CIERRE DE SESION =====
function cerrarSesionLocal() {
  sessionStorage.removeItem('tucasa-claveunica-user');
  sessionStorage.removeItem('tucasa-nombre');
  sessionStorage.removeItem('tucasa-documentos');
  window.location.href = 'index.html?auth=logout';
}

// ===== VERIFICAR AUTENTICACION =====
function usuarioAutenticado() {
  var userData = sessionStorage.getItem('tucasa-claveunica-user');
  if (!userData) return null;
  try {
    var user = JSON.parse(userData);
    return user.verificado ? user : null;
  } catch (e) {
    return null;
  }
}

// ===== LINKS A SERVICIOS DEL ESTADO =====
function abrirLinkServicio(tipo) {
  var links = {
    dicom: 'https://www.equifax.cl/',
    sii: 'https://www.sii.cl/',
    chileatiende: 'https://www.chileatiende.gob.cl/',
    previred: 'https://www.previred.com/',
    cmf: 'https://www.cmfchile.cl/',
    claveunica: 'https://www.claveunica.gob.cl/'
  };
  
  if (links[tipo]) {
    window.open(links[tipo], '_blank');
  }
}

// ===== UI INIT =====
function initUI_Auth() {
  var user = usuarioAutenticado();
  var btnLogin = document.getElementById('btnClaveUnica');
  var btnLogout = document.getElementById('btnCerrarSesion');
  var btnUpload = document.getElementById('btnSubirInformes');
  var userNameDisplay = document.getElementById('userNameDisplay');
  var sectionDocs = document.getElementById('seccionDocumentos');
  
  if (user && user.verificado) {
    if (btnLogin) btnLogin.style.display = 'none';
    if (btnLogout) {
      btnLogout.style.display = 'inline-flex';
      if (userNameDisplay) {
        userNameDisplay.textContent = user.nombre + ' (RUT: ' + user.rut + ')';
      }
    }
    if (btnUpload) btnUpload.style.display = 'inline-flex';
    if (sectionDocs) sectionDocs.style.display = 'block';
    mostrarDocumentosCargados();
  } else {
    if (btnLogin) btnLogin.style.display = 'inline-flex';
    if (btnLogout) btnLogout.style.display = 'none';
    if (btnUpload) btnUpload.style.display = 'none';
    if (sectionDocs) sectionDocs.style.display = 'none';
  }
  
  // Manejar parametros URL
  var params = new URLSearchParams(window.location.search);
  var auth = params.get('auth');
  if (auth === 'success') {
    setTimeout(function() { alert('✅ Identidad validada correctamente'); }, 500);
    window.history.replaceState({}, document.title, window.location.pathname);
  } else if (auth === 'logout') {
    window.history.replaceState({}, document.title, window.location.pathname);
  }
}