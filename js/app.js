/**
 * TuCasaChile - Logica Principal de la Aplicacion
 * Calculo de capacidad de endeudamiento, comparador de creditos y buscador de propiedades
 */

(function() {
  'use strict';

  // ===== STATE =====
  let resultadosActuales = null;
  let usandoML = false; // flag para saber si estamos usando datos de MercadoLibre

  // ===== THEME (Modo Oscuro/Claro) =====
  function initTheme() {
    const toggleBtn = $('#themeToggle');
    if (!toggleBtn) return;

    // Cargar tema guardado
    const savedTheme = localStorage.getItem('tucasa-theme') || 'light';
    aplicarTema(savedTheme);

    toggleBtn.addEventListener('click', function() {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      const nuevo = current === 'light' ? 'dark' : 'light';
      aplicarTema(nuevo);
      localStorage.setItem('tucasa-theme', nuevo);
    });
  }

  function aplicarTema(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const icon = $('#themeIcon');
    const text = $('#themeText');
    if (icon && text) {
      if (theme === 'dark') {
        icon.className = 'fa-solid fa-sun';
        text.textContent = 'Claro';
      } else {
        icon.className = 'fa-solid fa-moon';
        text.textContent = 'Oscuro';
      }
    }
  }

  // ===== UTILS =====
  function $(sel) { return document.querySelector(sel); }
  function $$(sel) { return document.querySelectorAll(sel); }
  function formatCLP(num) {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(num);
  }
  function formatUF(num) {
    return 'UF ' + new Intl.NumberFormat('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(num);
  }
  function formatPorcentaje(num) {
    return num.toFixed(2).replace('.', ',') + '%';
  }
  function scrollTo(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  function showToast(msg) {
    const toast = $('#toast');
    $('#toastMsg').textContent = msg;
    toast.classList.add('show');
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(function() { toast.classList.remove('show'); }, 3000);
  }

  // ===== REGION & COMUNA DYNAMIC =====
  function initRegionComuna() {
    var regionSelect = $('#regionBusqueda');
    if (!regionSelect) return;

    // Llenar regiones desde el objeto regionesChile
    regionSelect.innerHTML = '<option value="">Todas las regiones</option>';
    Object.keys(regionesChile).forEach(function(key) {
      var region = regionesChile[key];
      var option = document.createElement('option');
      option.value = key;
      option.textContent = region.nombre;
      if (key === 'metropolitana') option.selected = true;
      regionSelect.appendChild(option);
    });

    // Evento change para cargar comunas
    regionSelect.addEventListener('change', function() {
      actualizarComunas(this.value);
    });

    // Cargar comunas iniciales (Metropolitana)
    actualizarComunas('metropolitana');
  }

  function actualizarComunas(regionKey) {
    var comunaSelect = $('#comunaBusqueda');
    var comunaHint = $('#comunaHint');
    if (!comunaSelect) return;

    comunaSelect.innerHTML = '<option value="">Todas las comunas</option>';

    if (regionKey && regionesChile[regionKey]) {
      var comunas = regionesChile[regionKey].comunas;
      comunas.forEach(function(comuna) {
        var option = document.createElement('option');
        option.value = comuna;
        option.textContent = comuna;
        comunaSelect.appendChild(option);
      });
      if (comunaHint) comunaHint.textContent = comunas.length + ' comunas disponibles';
    } else {
      if (comunaHint) comunaHint.textContent = 'Selecciona una region primero';
    }
  }

  // ===== NAVIGATION =====
  function initNav() {
    const toggle = $('.nav-toggle');
    const nav = $('.nav');
    toggle.addEventListener('click', function() {
      nav.classList.toggle('open');
    });

    const navLinks = $$('.nav-link');
    navLinks.forEach(function(link) {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        const target = this.getAttribute('href').substring(1);
        scrollTo(target);
        nav.classList.remove('open');
      });
    });

    // Highlight active nav on scroll
    window.addEventListener('scroll', function() {
      let current = '';
      const sections = document.querySelectorAll('section[id]');
      sections.forEach(function(section) {
        const top = section.offsetTop - 100;
        if (window.scrollY >= top) {
          current = section.getAttribute('id');
        }
      });
      navLinks.forEach(function(link) {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
          link.classList.add('active');
        }
      });
    });
  }

  // ===== ESTADO CIVIL =====
  function initEstadoCivil() {
    var radios = document.getElementsByName('estadoCivil');
    radios.forEach(function(radio) {
      radio.addEventListener('change', function() {
        var conyugeGroup = $('#ingresoConyugeGroup');
        if (this.value === 'casado') {
          conyugeGroup.style.display = 'block';
        } else {
          conyugeGroup.style.display = 'none';
          $('#ingresoConyuge').value = '';
        }
      });
    });
  }

  // ===== CALCULOS FINANCIEROS =====
  function calcularCapacidadEndeudamiento() {
    const ingresoTitular = parseInt($('#ingresoTitular').value) || 0;
    const ingresoConyuge = parseInt($('#ingresoConyuge').value) || 0;
    const deudasMensuales = parseInt($('#deudasMensuales').value) || 0;
    const ahorrosPie = parseInt($('#ahorrosPie').value) || 0;
    const plazoAnos = parseInt($('#plazoCredito').value) || 20;
    const tipoVivienda = document.querySelector('input[name="tipoVivienda"]:checked').value;

    if (ingresoTitular <= 0) {
      showToast('Por favor ingresa un ingreso mensual valido');
      return null;
    }

    const ingresoTotal = ingresoTitular + ingresoConyuge;
    const ingresoDisponible = ingresoTotal - deudasMensuales;

    // 25% del ingreso disponible (norma bancaria chilena: relacion cuota/ingreso)
    const capacidadPagoBruta = Math.round(ingresoDisponible * 0.25);

    if (capacidadPagoBruta <= 0) {
      showToast('Tu capacidad de pago es insuficiente. Reduce tus deudas o aumenta tus ingresos.');
      return null;
    }

    // === RESTRICCION 1: LIMITE POR PIE (10%-25% segun banco) ===
    // Los bancos en Chile financian entre 75% y 90% del valor de la propiedad
    // BCI, Santander, Chile: 90% (pie 10% para primera vivienda)
    // Usamos 10% como referencia optimista (mejor condicion del mercado)
    const propiedadMaxPorPie = Math.round(ahorrosPie / 0.10);
    const creditoMaxPorPie = Math.round(propiedadMaxPorPie * 0.90);

    const porcentajeFinanciamiento = 0.90; // 90% financiamiento (pie 10%)
    const porcentajePie = 0.10;

    // === RESTRICCION 2: LIMITE POR DIVIDENDO (25% del ingreso) ===
    const plazoMeses = plazoAnos * 12;
    const tasaRefAnual = tipoVivienda === 'primera' ? 0.045 : 0.049;
    const tasaRefMensual = tasaRefAnual / 12;

    // Estimar seguros
    const seguroEstimadoMensual = 80000;
    const dividendoNetoDisponible = capacidadPagoBruta - seguroEstimadoMensual;

    let montoMaxCredito = 0;
    if (tasaRefMensual > 0 && plazoMeses > 0 && dividendoNetoDisponible > 0) {
      montoMaxCredito = dividendoNetoDisponible *
        (1 - Math.pow(1 + tasaRefMensual, -plazoMeses)) /
        tasaRefMensual;
    } else if (dividendoNetoDisponible > 0) {
      montoMaxCredito = dividendoNetoDisponible * plazoMeses;
    }
    montoMaxCredito = Math.round(montoMaxCredito);

    // Propiedad maxima = credito / porcentajeFinanciamiento (ej: 90%)
    const propiedadMaxPorDividendo = Math.round(montoMaxCredito / porcentajeFinanciamiento);
    const pieRequeridoPorDividendo = Math.round(propiedadMaxPorDividendo * porcentajePie);

    // === RESTRICCION FINAL: La que sea menor ===
    const propiedadMaximaEstimada = Math.min(propiedadMaxPorPie, propiedadMaxPorDividendo);
    const creditoMaximoReal = Math.round(propiedadMaximaEstimada * porcentajeFinanciamiento);
    const pieRequeridoReal = Math.round(propiedadMaximaEstimada * porcentajePie);

    return {
      ingresoTitular: ingresoTitular,
      ingresoConyuge: ingresoConyuge,
      ingresoTotal: ingresoTotal,
      ingresoDisponible: ingresoDisponible,
      deudasMensuales: deudasMensuales,
      ahorrosPie: ahorrosPie,
      capacidadPagoBruta: capacidadPagoBruta,
      dividendoNetoDisponible: Math.round(dividendoNetoDisponible),
      seguroEstimadoMensual: seguroEstimadoMensual,
      propiedadMaxPorPie: propiedadMaxPorPie,
      creditoMaxPorPie: creditoMaxPorPie,
      propiedadMaxPorDividendo: propiedadMaxPorDividendo,
      pieRequeridoPorDividendo: pieRequeridoPorDividendo,
      propiedadMaximaEstimada: propiedadMaximaEstimada,
      creditoMaximoReal: creditoMaximoReal,
      pieRequeridoReal: pieRequeridoReal,
      montoMaxCredito: montoMaxCredito,
      plazoMeses: plazoMeses,
      plazoAnos: plazoAnos,
      tipoVivienda: tipoVivienda,
      tasaRefAnual: tasaRefAnual
    };
  }

  function calcularCredito(banco, montoCredito, plazoMeses, tipoVivienda) {
    const tasaAnual = tipoVivienda === 'primera' ? banco.tasaPrimeraVivienda : banco.tasaSegundaVivienda;
    const tasaMensual = (tasaAnual / 100) / 12;

    // Calculo del dividendo (formula de anualidad vencida)
    let dividendoMensual = 0;
    if (tasaMensual > 0) {
      dividendoMensual = montoCredito * (tasaMensual * Math.pow(1 + tasaMensual, plazoMeses)) / (Math.pow(1 + tasaMensual, plazoMeses) - 1);
    } else {
      dividendoMensual = montoCredito / plazoMeses;
    }

    // Seguros en CLP (aproximados)
    const montoUF = montoCredito / valorUF;
    const seguroIncendioMensual = Math.round(montoUF * banco.seguroIncendioUF * valorUF / 12);
    const seguroDesgravamenMensual = Math.round(montoUF * banco.seguroDesgravamenUF * valorUF / 12);
    const totalSeguros = seguroIncendioMensual + seguroDesgravamenMensual;

    // Dividendo total con seguros
    const dividendoTotal = Math.round(dividendoMensual + totalSeguros);

    // Costo total del credito
    const costoTotal = Math.round(dividendoTotal * plazoMeses);
    const costoIntereses = Math.round(costoTotal - montoCredito);

    // CAE simplificado (incluye tasa + seguros + gastos operacionales)
    const gastosOp = montoCredito * (banco.gastosOperacionales / 100);
    const montoTotalConGastos = montoCredito + gastosOp;
    let caeEfectivo = tasaAnual;
    if (totalSeguros > 0) {
      const tasaEfectivaMensual = Math.pow((montoTotalConGastos + costoIntereses) / montoCredito, 1 / plazoMeses) - 1;
      caeEfectivo = (Math.pow(1 + tasaEfectivaMensual, 12) - 1) * 100;
    } else {
      caeEfectivo = banco.caeBase;
    }

    return {
      banco: banco,
      tasaAnual: tasaAnual,
      dividendoMensual: Math.round(dividendoMensual),
      dividendoTotal: dividendoTotal,
      seguroIncendioMensual: seguroIncendioMensual,
      seguroDesgravamenMensual: seguroDesgravamenMensual,
      costoTotal: costoTotal,
      costoIntereses: costoIntereses,
      cae: caeEfectivo,
      montoCredito: montoCredito,
      pieRequerido: Math.round(montoCredito / (banco.financiamientoMax / 100) - montoCredito),
      cumpleCapacidad: false
    };
  }

  function evaluarCreditos(capacidad) {
    if (!capacidad) return [];

    const tipoVivienda = capacidad.tipoVivienda;
    const montoCredito = capacidad.propiedadMaximaEstimada - capacidad.ahorrosPie;
    const montoCreditoEfectivo = montoCredito > 0 ? montoCredito : capacidad.propiedadMaximaEstimada * 0.8;

    const resultados = bancosChile.map(function(banco) {
      const pieReq = Math.round(capacidad.propiedadMaximaEstimada * (banco.pieMinimo / 100));
      const creditoMax = capacidad.propiedadMaximaEstimada - pieReq;
      const credito = calcularCredito(banco, creditoMax, capacidad.plazoMeses, tipoVivienda);
      const tienePie = capacidad.ahorrosPie >= pieReq;
      credito.cumpleCapacidad = tienePie && credito.dividendoTotal <= capacidad.capacidadPagoBruta;
      credito.pieRequerido = pieReq;
      credito.creditoOtorgable = creditoMax;
      return credito;
    });

    return resultados;
  }

  // ===== RENDER: RESUMEN =====
  function renderResumen(capacidad) {
    $('#resumenPlaceholder').style.display = 'none';
    $('#resumenContent').style.display = 'block';

    $('#resIngresoTotal').textContent = formatCLP(capacidad.ingresoTotal);
    $('#resCapacidadPago').textContent = formatCLP(capacidad.capacidadPagoBruta);
    $('#resCreditoMax').textContent = formatCLP(capacidad.montoMaxCredito);
    $('#resPropMaxPie').textContent = formatCLP(capacidad.propiedadMaxPorPie);
    $('#resPropMaxDiv').textContent = formatCLP(capacidad.propiedadMaxPorDividendo);
    $('#resPropiedadMax').textContent = formatCLP(capacidad.propiedadMaximaEstimada);
    $('#resPieRequerido').textContent = formatCLP(Math.round(capacidad.propiedadMaximaEstimada * 0.20));

    // Destacar cual es la restriccion activa
    if (capacidad.propiedadMaxPorPie <= capacidad.propiedadMaxPorDividendo) {
      $('#resPropMaxPie').style.color = '#ef4444';
      $('#resPropMaxDiv').style.color = '';
      $('#resPropMaxPie').title = 'Tu ahorro para el pie es la restriccion que limita tu compra';
    } else {
      $('#resPropMaxDiv').style.color = '#ef4444';
      $('#resPropMaxPie').style.color = '';
      $('#resPropMaxDiv').title = 'Tu capacidad de pago mensual es la restriccion que limita tu compra';
    }

    // Scroll to resumen
    $('#resumenCard').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // ===== RENDER: CREDITOS =====
  function renderCreditos(creditos, capacidad) {
    const container = $('#creditosContainer');
    const ordenKey = $('#ordenarCreditos').value;

    // Ordenar
    let sorted = creditos.slice();
    if (ordenKey === 'tasa') {
      sorted.sort(function(a, b) { return a.tasaAnual - b.tasaAnual; });
    } else if (ordenKey === 'cae') {
      sorted.sort(function(a, b) { return a.cae - b.cae; });
    } else if (ordenKey === 'dividendo') {
      sorted.sort(function(a, b) { return a.dividendoTotal - b.dividendoTotal; });
    } else {
      sorted.sort(function(a, b) { return a.costoTotal - b.costoTotal; });
    }

    // Actualizar filtro de dividendo
    $('#filtroDividendoLabel').textContent = formatCLP(capacidad.capacidadPagoBruta) + ' / mes';

    // Separar los que cumplen vs no cumplen
    const cumplen = sorted.filter(function(c) { return c.cumpleCapacidad; });
    const noCumplen = sorted.filter(function(c) { return !c.cumpleCapacidad; });

    let html = '';

    if (cumplen.length === 0 && noCumplen.length === 0) {
      html = '<div class="no-results"><div class="no-results-icon"><i class="fa-solid fa-circle-exclamation"></i></div><h4>Sin resultados</h4><p>No se encontraron creditos disponibles con los datos ingresados.</p></div>';
    } else {
      // Mostrar los que cumplen primero
      cumplen.forEach(function(credito, idx) {
        html += renderCreditoCard(credito, idx === 0);
      });

      // Separador si hay de ambos tipos
      if (cumplen.length > 0 && noCumplen.length > 0) {
        html += '<div class="no-results" style="padding:20px"><p style="color:#f59e0b;font-weight:600"><i class="fa-solid fa-triangle-exclamation"></i> Los siguientes creditos exceden tu capacidad de pago (' + formatCLP(capacidad.capacidadPagoBruta) + '/mes):</p></div>';
      }

      noCumplen.forEach(function(credito) {
        html += renderCreditoCard(credito, false);
      });
    }

    container.innerHTML = html;

    // Actualizar tabla
    renderTablaCreditos(sorted, capacidad);

    // Scroll a creditos
    scrollTo('creditos');
  }

  function renderCreditoCard(credito, isBest) {
    const banco = credito.banco;
    const cumple = credito.cumpleCapacidad;
    let cardClass = 'credito-card';
    if (isBest && cumple) cardClass += ' best';
    if (!cumple) cardClass += ' caution-card';

    return '<div class="' + cardClass + '" style="' + (!cumple ? 'opacity:0.7;border-left:3px solid #ef4444;' : '') + '">' +
      '<div class="credito-card-header">' +
        '<div class="credito-bank-icon" style="background:' + banco.iconBg + ';color:' + banco.color + '">' + banco.nombre.charAt(0) + '</div>' +
        '<div>' +
          '<div class="credito-bank-name">' + banco.nombre + '</div>' +
          '<div class="credito-tasa-label">Tasa ' + (cumple ? 'preferencial' : 'referencial') + '</div>' +
        '</div>' +
      '</div>' +
      '<div class="credito-tasa">' + formatPorcentaje(credito.tasaAnual) + '</div>' +
      '<div class="credito-tasa-label">Tasa Anual</div>' +
      '<div class="credito-details">' +
        '<div class="credito-detail-item">' +
          '<span class="credito-detail-label">Dividendo</span>' +
          '<span class="credito-detail-value ' + (!cumple ? 'caution' : '') + '">' + formatCLP(credito.dividendoTotal) + '/mes</span>' +
        '</div>' +
        '<div class="credito-detail-item">' +
          '<span class="credito-detail-label">CAE</span>' +
          '<span class="credito-detail-value">' + formatPorcentaje(credito.cae) + '</span>' +
        '</div>' +
        '<div class="credito-detail-item">' +
          '<span class="credito-detail-label">Costo Total</span>' +
          '<span class="credito-detail-value">' + formatCLP(credito.costoTotal) + '</span>' +
        '</div>' +
        '<div class="credito-detail-item">' +
          '<span class="credito-detail-label">Pie Requerido</span>' +
          '<span class="credito-detail-value">' + formatCLP(credito.pieRequerido) + '</span>' +
        '</div>' +
        '<div class="credito-detail-item">' +
          '<span class="credito-detail-label">Credito</span>' +
          '<span class="credito-detail-value">' + formatCLP(credito.creditoOtorgable) + '</span>' +
        '</div>' +
        '<div class="credito-detail-item">' +
          '<span class="credito-detail-label">Seguros aprox.</span>' +
          '<span class="credito-detail-value">' + formatCLP(credito.seguroIncendioMensual + credito.seguroDesgravamenMensual) + '/mes</span>' +
        '</div>' +
      '</div>' +
      '<div style="margin-top:12px;padding:8px 10px;background:#f8fafc;border-radius:6px;font-size:0.8rem">' +
        '<strong style="color:#1e40af">Comparativa:</strong> ' +
        (banco.tasaFijaPrimera ? 
          'Tasa fija ' + formatPorcentaje(banco.tasaFijaPrimera) + ' vs variable ' + formatPorcentaje(credito.tasaAnual) + 
          '. <span style="color:' + (banco.tasaFijaPrimera < credito.tasaAnual ? '#10b981' : '#ef4444') + ';font-weight:700">' +
          (banco.tasaFijaPrimera < credito.tasaAnual ? 'Conviene fija' : 'Conviene variable') + '</span>' : 
          'Este banco solo ofrece tasa variable'
        ) +
      '</div>' +
      '<div style="font-size:0.78rem;color:#64748b;margin-top:8px;">' + banco.requisitos + '</div>' +
    '</div>';
  }

  function renderTablaCreditos(creditos, capacidad) {
    const tbody = document.querySelector('#creditosTabla tbody');
    tbody.innerHTML = '';

    creditos.forEach(function(credito) {
      const cumple = credito.cumpleCapacidad;
      const row = document.createElement('tr');
      row.style.cssText = cumple ? '' : 'opacity:0.6;background:#fff5f5;';

      row.innerHTML =
        '<td><strong>' + credito.banco.nombre + '</strong></td>' +
        '<td class="col-tasa">' + formatPorcentaje(credito.tasaAnual) + '</td>' +
        '<td style="' + (!cumple ? 'color:#ef4444;font-weight:700' : '') + '">' + formatCLP(credito.dividendoTotal) + '/mes</td>' +
        '<td>' + formatPorcentaje(credito.cae) + '</td>' +
        '<td>' + formatCLP(credito.costoTotal) + '</td>' +
        '<td>' + formatCLP(credito.seguroIncendioMensual) + '/mes</td>' +
        '<td>' + formatCLP(credito.seguroDesgravamenMensual) + '/mes</td>' +
        '<td>' + formatCLP(credito.pieRequerido) + '</td>';

      tbody.appendChild(row);
    });

    $('#creditosTablaContainer').style.display = 'block';
  }

  // ===== RENDER: PROPIEDADES =====
  function filtrarPropiedadesLocales(capacidad) {
    const regionSeleccionada = $('#regionBusqueda').value;
    const comunaSeleccionada = $('#comunaBusqueda').value;
    const tiposSeleccionados = [];
    document.querySelectorAll('input[name="tipoPropiedad"]:checked').forEach(function(cb) {
      tiposSeleccionados.push(cb.value);
    });

    let filtradas = propiedadesChile.filter(function(p) {
      const cumpleRegion = !regionSeleccionada || p.region === regionSeleccionada;
      const cumpleComuna = !comunaSeleccionada || p.comuna === comunaSeleccionada;
      const cumpleTipo = tiposSeleccionados.indexOf(p.tipo) !== -1;
      const cumplePrecio = p.precio <= capacidad.propiedadMaximaEstimada;
      return cumpleRegion && cumpleComuna && cumpleTipo && cumplePrecio;
    });

    filtradas.sort(function(a, b) { return a.precio - b.precio; });
    return filtradas;
  }

  let mlIntentos = 0;
  let mlExitoso = false;

  async function obtenerPropiedadesReales(capacidad) {
    const regionSeleccionada = $('#regionBusqueda').value;
    const comunaSeleccionada = $('#comunaBusqueda').value;
    const tiposSeleccionados = [];
    document.querySelectorAll('input[name="tipoPropiedad"]:checked').forEach(function(cb) {
      tiposSeleccionados.push(cb.value);
    });

    mlIntentos++;
    let todas = [];
    // Buscar cada tipo seleccionado en MercadoLibre con comuna
    for (var i = 0; i < tiposSeleccionados.length; i++) {
      var tipo = tiposSeleccionados[i];
      var resultados = await obtenerPropiedadesML(tipo, regionSeleccionada || null, capacidad.propiedadMaximaEstimada, comunaSeleccionada || null);
      todas = todas.concat(resultados);
    }

    // Filtrar por comuna si ML no lo hizo exacto
    if (comunaSeleccionada) {
      var comunaLower = comunaSeleccionada.toLowerCase();
      todas = todas.filter(function(p) {
        return p.comuna && p.comuna.toLowerCase().indexOf(comunaLower) !== -1;
      });
    }

    // Ordenar por precio
    todas.sort(function(a, b) { return a.precio - b.precio; });

    if (todas.length > 0) mlExitoso = true;
    return todas;
  }

  function simularDFL2(capacidad) {
    var dfl2 = subsidiosChile.dfl2;
    var viviendaMaxCLP = Math.round(dfl2.viviendaMaximaUF * valorUF);
    var pieMin = Math.round(viviendaMaxCLP * (dfl2.pieMinimo / 100));
    var creditoMax = Math.round(viviendaMaxCLP * (dfl2.financiamientoMax / 100));
    var plazo = capacidad.plazoMeses;
    var tasaM = (dfl2.tasaAnual / 100) / 12;
    var dividendo = 0;
    if (tasaM > 0 && plazo > 0) {
      dividendo = creditoMax * (tasaM * Math.pow(1 + tasaM, plazo)) / (Math.pow(1 + tasaM, plazo) - 1);
    }
    dividendo = Math.round(dividendo);
    var puedeAcceder = capacidad.capacidadPagoBruta >= dividendo && capacidad.ahorrosPie >= pieMin;
    var resultElem = document.getElementById('dfl2SimResult');
    if (resultElem) {
      if (puedeAcceder) {
        resultElem.innerHTML = '<i class="fa-solid fa-circle-check" style="color:#10b981"></i> <strong>¡Calificas para DFL2!</strong> Vivienda: UF ' +
          dfl2.viviendaMaximaUF.toLocaleString('es-CL') + ' (~' + formatCLP(viviendaMaxCLP) +
          '). Pie: ' + formatCLP(pieMin) + '. Div. est. tasa 3%: <strong>' + formatCLP(dividendo) + '/mes</strong>';
        resultElem.style.color = '#065f46'; resultElem.style.background = '#d1fae5';
      } else {
        var razon = capacidad.capacidadPagoBruta < dividendo ?
          'tu dividendo excede tu capacidad (' + formatCLP(dividendo) + '/mes > ' + formatCLP(capacidad.capacidadPagoBruta) + '/mes)' :
          'necesitas pie minimo de ' + formatCLP(pieMin) + ' (tienes ' + formatCLP(capacidad.ahorrosPie) + ')';
        resultElem.innerHTML = '<i class="fa-solid fa-circle-info"></i> DFL2 no disponible: ' + razon;
        resultElem.style.color = '#92400e'; resultElem.style.background = '#fef3c7';
      }
    }
  }

  function actualizarBadgeML() {
    var badge = $('#mlStatusBadge');
    if (!badge) return;
    if (mlExitoso) {
      badge.innerHTML = '<i class="fa-solid fa-circle-check"></i> MercadoLibre conectado (' + new Date().toLocaleTimeString('es-CL') + ')';
      badge.className = 'ml-badge ml-success';
    } else {
      badge.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Datos locales (' + mlIntentos + ' intento' + (mlIntentos !== 1 ? 's' : '') + ' sin conexion a ML)';
      badge.className = 'ml-badge ml-warn';
    }
  }

  function generarLinksPortales(capacidad) {
    var comuna = $('#comunaBusqueda').value || '';
    var regionKey = $('#regionBusqueda').value;
    var regionName = regionKey && regionesChile[regionKey] ? regionesChile[regionKey].nombre : '';
    var precioMax = capacidad.propiedadMaximaEstimada;
    var tipos = [];
    document.querySelectorAll('input[name="tipoPropiedad"]:checked').forEach(function(cb) {
      tipos.push(cb.value);
    });

    var q = comuna || regionName || 'Chile';
    var tipoQ = tipos.length === 1 ? tipos[0] : 'propiedad';
    var ufMax = Math.round(precioMax / valorUF);

    return {
      mercadolibre: 'https://www.inmuebles.mercadolibre.cl/' + tipoQ + 's' +
        '?q=' + encodeURIComponent(q) +
        '&price=0-' + precioMax +
        '&sort=price_asc',
      portalinmobiliario: 'https://www.portalinmobiliario.com/venta/' + tipoQ +
        '/' + encodeURIComponent(q.toLowerCase().replace(/ /g, '-')) +
        '?_hasta=' + ufMax + '+UF',
      yapo: 'https://www.yapo.cl/region-metropolitana/inmuebles/venta' +
        '?q=' + encodeURIComponent(comuna || q) +
        '&prM=' + precioMax +
        '&orden=precio-ascendente',
      toctoc: 'https://www.toctoc.com/venta/' + tipoQ +
        '?region=' + encodeURIComponent(regionName || 'metropolitana') +
        '&comuna=' + encodeURIComponent(comuna || 'todas') +
        '&precio_max=' + ufMax
    };
  }

  function renderPropiedades(propiedades, capacidad) {
    const container = $('#propiedadesContainer');

    // Actualizar filtros visuales
    const regionSel = $('#regionBusqueda').value;
    if (regionSel && regionesChile[regionSel]) {
      $('#filtroRegionLabel').textContent = regionesChile[regionSel].nombre;
    } else {
      $('#filtroRegionLabel').textContent = 'Todas las regiones';
    }

    const tipos = [];
    document.querySelectorAll('input[name="tipoPropiedad"]:checked').forEach(function(cb) {
      tipos.push(cb.value.charAt(0).toUpperCase() + cb.value.slice(1));
    });
    $('#filtroTipoLabel').textContent = tipos.length > 0 ? tipos.join(' · ') : 'Todos';

    $('#filtroPrecioLabel').textContent = 'Hasta: ' + formatCLP(capacidad.propiedadMaximaEstimada);

    // Generar links a portales inmobiliarios reales
    var portales = generarLinksPortales(capacidad);
    var seccionPortales = '<div class="portales-section">' +
      '<h4><i class="fa-solid fa-globe"></i> Buscar propiedades REALES en:</h4>' +
      '<div class="portales-grid">' +
        '<a href="' + portales.mercadolibre + '" target="_blank" rel="noopener" class="portal-btn">' +
          '<i class="fa-solid fa-shop"></i> MercadoLibre' +
        '</a>' +
        '<a href="' + portales.portalinmobiliario + '" target="_blank" rel="noopener" class="portal-btn">' +
          '<i class="fa-solid fa-building"></i> Portal Inmobiliario' +
        '</a>' +
        '<a href="' + portales.yapo + '" target="_blank" rel="noopener" class="portal-btn">' +
          '<i class="fa-solid fa-tag"></i> Yapo.cl' +
        '</a>' +
        '<a href="' + portales.toctoc + '" target="_blank" rel="noopener" class="portal-btn">' +
          '<i class="fa-solid fa-house-circle-check"></i> Toctoc.com' +
        '</a>' +
      '</div>' +
    '</div>';

    if (propiedades.length === 0) {
      container.innerHTML = '<div class="no-results"><div class="no-results-icon"><i class="fa-solid fa-house-circle-xmark"></i></div><h4>No se encontraron propiedades en los datos locales</h4><p>Busca directamente en los principales portales inmobiliarios de Chile con tus filtros:</p>' + seccionPortales + '</div>';
    } else {
      var esReal = usandoML;
      var avisoML = '';
      if (!esReal) {
        avisoML = '<div class="ml-aviso"><i class="fa-solid fa-circle-info"></i> Estos son datos de ejemplo. Abajo puedes buscar propiedades REALES en 4 portales chilenos.</div>';
      }
      let html = avisoML;
      propiedades.forEach(function(prop) {
        html += renderPropiedadCard(prop, capacidad);
      });
      html += seccionPortales;
      container.innerHTML = html;
    }

    $('#propiedadesResumen').style.display = 'flex';
    $('#propiedadesEncontradas').textContent = propiedades.length + ' propiedades a tu alcance';

    // Scroll a propiedades
    scrollTo('propiedades');
  }

  function renderPropiedadCard(prop, capacidad) {
    const iconMap = {
      departamento: 'fa-building',
      casa: 'fa-house',
      terreno: 'fa-mountain-sun',
      parcela: 'fa-tree'
    };
    const icon = iconMap[prop.tipo] || 'fa-home';

    // Calcular dividendo aproximado con la mejor tasa disponible
    const bancoRef = bancosChile.reduce(function(mejor, b) {
      const tasa = capacidad.tipoVivienda === 'primera' ? b.tasaPrimeraVivienda : b.tasaSegundaVivienda;
      const mejorTasa = capacidad.tipoVivienda === 'primera' ? mejor.tasaPrimeraVivienda : mejor.tasaSegundaVivienda;
      return tasa < mejorTasa ? b : mejor;
    });
    const pieNecesario = Math.round(prop.precio * 0.20);
    const creditoNecesario = prop.precio - pieNecesario;
    const creditoSim = calcularCredito(bancoRef, creditoNecesario, capacidad.plazoMeses, capacidad.tipoVivienda);
    const puedeComprar = capacidad.ahorrosPie >= pieNecesario && creditoSim.dividendoTotal <= capacidad.capacidadPagoBruta;
    const dividendoEstimado = creditoSim.dividendoTotal;

    return '<div class="propiedad-card"' + (puedeComprar ? ' style="box-shadow:0 0 0 2px #10b981,0 4px 6px rgba(0,0,0,0.07);"' : '') + '>' +
      '<div class="propiedad-image ' + prop.tipo + '">' +
        '<i class="fa-solid ' + icon + '"></i>' +
        '<span class="propiedad-tipo-badge">' + prop.tipo.charAt(0).toUpperCase() + prop.tipo.slice(1) + '</span>' +
        '<span class="propiedad-precio-badge">' + formatUF(prop.uf) + '</span>' +
      '</div>' +
      '<div class="propiedad-body">' +
        '<div class="propiedad-title">' + prop.titulo + '</div>' +
        '<div class="propiedad-ubicacion"><i class="fa-solid fa-location-dot"></i> ' + prop.comuna + ', ' + (regionesChile[prop.region] ? regionesChile[prop.region].nombre : prop.region) + '</div>' +
        '<div class="propiedad-specs">' +
          (prop.dormitorios > 0 ? '<span class="propiedad-spec"><i class="fa-solid fa-bed"></i> ' + prop.dormitorios + ' dorm.</span>' : '') +
          (prop.banos > 0 ? '<span class="propiedad-spec"><i class="fa-solid fa-bath"></i> ' + prop.banos + ' ban.</span>' : '') +
          '<span class="propiedad-spec"><i class="fa-solid fa-ruler-combined"></i> ' + prop.m2.toLocaleString('es-CL') + ' m2</span>' +
          '<span class="propiedad-spec"><i class="fa-solid fa-dollar-sign"></i> ' + formatCLP(prop.precio) + '</span>' +
        '</div>' +
        '<div class="propiedad-asequible" style="' + (puedeComprar ? '' : 'background:#fef2f2;color:#dc2626;') + '">' +
          '<span class="asequible-icon">' + (puedeComprar ? '<i class="fa-solid fa-circle-check"></i>' : '<i class="fa-solid fa-circle-xmark"></i>') + '</span>' +
          (puedeComprar ? '¡A tu alcance! Dividendo estimado: ' : 'Dividendo estimado: ') +
          '<span class="dividendo-estimado">' + formatCLP(dividendoEstimado) + '/mes</span>' +
          '<span class="pie-requerido"> · Pie requerido: ' + formatCLP(pieNecesario) + '</span>' +
        '</div>' +
        '<p style="font-size:0.82rem;color:#64748b;margin-top:8px;">' + prop.descripcion + '</p>' +
        (prop.urlML ? '<a href="' + prop.urlML + '" target="_blank" rel="noopener" class="site-link"><i class="fa-solid fa-arrow-up-right-from-square"></i> Ver en MercadoLibre</a>' : '') +
      '</div>' +
    '</div>';
  }

  function exportarResultados() {
    if (!resultadosActuales) {
      showToast('Primero debes realizar una simulacion');
      return;
    }

    const capacidad = resultadosActuales.capacidad;
    const creditos = resultadosActuales.creditos;
    const propiedades = resultadosActuales.propiedades;

    let texto = '=== TUCASACHILE - REPORTE DE SIMULACION ===\n\n';
    texto += 'PERFIL FINANCIERO:\n';
    texto += '- Ingreso Total: ' + formatCLP(capacidad.ingresoTotal) + '\n';
    texto += '- Deudas Mensuales: ' + formatCLP(capacidad.deudasMensuales) + '\n';
    texto += '- Capacidad de Pago (25%): ' + formatCLP(capacidad.capacidadPagoBruta) + '/mes\n';
    texto += '- Ahorros (Pie): ' + formatCLP(capacidad.ahorrosPie) + '\n';
    texto += '- Propiedad Maxima: ' + formatCLP(capacidad.propiedadMaximaEstimada) + '\n';
    texto += '- Plazo: ' + capacidad.plazoAnos + ' años\n';
    texto += '- Tipo Vivienda: ' + (capacidad.tipoVivienda === 'primera' ? 'Primera' : 'Segunda') + '\n\n';

    texto += 'MEJORES CREDITOS:\n';
    creditos.filter(function(c) { return c.cumpleCapacidad; }).slice(0, 5).forEach(function(c, i) {
      texto += (i + 1) + '. ' + c.banco.nombre + ' - Tasa: ' + formatPorcentaje(c.tasaAnual) + ' - Dividendo: ' + formatCLP(c.dividendoTotal) + '/mes - CAE: ' + formatPorcentaje(c.cae) + '\n';
    });

    texto += '\nPROPIEDADES A TU ALCANCE (' + propiedades.length + '):\n';
    propiedades.slice(0, 10).forEach(function(p, i) {
      texto += (i + 1) + '. ' + p.titulo + ' - ' + formatCLP(p.precio) + ' (' + formatUF(p.uf) + ')\n';
    });

    $('#exportContent').textContent = texto;
    $('#exportModal').classList.add('active');
  }

  // ===== MAIN: SIMULAR =====
  async function ejecutarSimulacion(e) {
    e.preventDefault();

    const capacidad = calcularCapacidadEndeudamiento();
    if (!capacidad) return;

    const creditos = evaluarCreditos(capacidad);

    // Mostrar resumen y creditos inmediatamente
    renderResumen(capacidad);
    renderCreditos(creditos, capacidad);

    // Intentar obtener propiedades reales de MercadoLibre
    var container = $('#propiedadesContainer');
    container.innerHTML = '<div class="creditos-placeholder"><i class="fa-solid fa-spinner fa-spin placeholder-big"></i><p>Buscando propiedades en <strong>MercadoLibre Chile</strong>...</p></div>';
    $('#propiedadesResumen').style.display = 'none';

    var propiedades = [];

    try {
      propiedades = await obtenerPropiedadesReales(capacidad);
    } catch (err) {
      console.warn("Error con ML, usando datos locales:", err.message);
    }

    // Si ML no devolvio resultados, mostrar solo portales reales
    if (propiedades.length === 0) {
      usandoML = false;
    } else {
      usandoML = true;
    }

    // Guardar resultados
    resultadosActuales = {
      capacidad: capacidad,
      creditos: creditos,
      propiedades: propiedades
    };

    renderPropiedades(propiedades, capacidad);

    var fuente = usandoML ? ' (datos de MercadoLibre Chile)' : '';
    showToast('¡Simulacion completada! ' + propiedades.length + ' propiedades encontradas a tu alcance' + fuente);
    actualizarBadgeML();
    simularDFL2(capacidad);
  }

  function resetFormulario() {
    document.getElementById('financialForm').reset();
    $('#ingresoConyugeGroup').style.display = 'none';
    $('#resumenPlaceholder').style.display = 'block';
    $('#resumenContent').style.display = 'none';
    $('#creditosContainer').innerHTML = '<div class="creditos-placeholder"><i class="fa-solid fa-building-columns placeholder-big"></i><p>Completa tu perfil en el <strong>Paso 1</strong> para ver las mejores opciones de credito.</p></div>';
    $('#creditosTablaContainer').style.display = 'none';
    $('#propiedadesContainer').innerHTML = '<div class="propiedades-placeholder"><i class="fa-solid fa-building placeholder-big"></i><p>Completa tu perfil y haz clic en <strong>"Calcular y Buscar"</strong> para ver propiedades.</p></div>';
    $('#propiedadesResumen').style.display = 'none';
    $('#filtroDividendoLabel').textContent = '-';
    resultadosActuales = null;
    showToast('Formulario reiniciado');
  }

  // ===== MODAL =====
  function initModal() {
    $('#exportarBtn').addEventListener('click', exportarResultados);
    $('#closeModal').addEventListener('click', function() {
      $('#exportModal').classList.remove('active');
    });
    $('#exportModal').addEventListener('click', function(e) {
      if (e.target === this) $('#exportModal').classList.remove('active');
    });
    $('#copyBtn').addEventListener('click', function() {
      const content = $('#exportContent').textContent;
      navigator.clipboard.writeText(content).then(function() {
        showToast('Resultados copiados al portapapeles');
      }).catch(function() {
        showToast('No se pudo copiar. Intenta manualmente.');
      });
    });
    $('#printBtn').addEventListener('click', function() {
      const content = $('#exportContent').textContent;
      const printWin = window.open('', '_blank');
      printWin.document.write('<pre style="font-family:monospace;font-size:14px;padding:20px;">' + content + '</pre>');
      printWin.document.close();
      printWin.print();
    });
  }

  // ===== EVENT LISTENERS =====
  function initEventListeners() {
    $('#financialForm').addEventListener('submit', ejecutarSimulacion);
    $('#resetBtn').addEventListener('click', resetFormulario);
    $('#ordenarCreditos').addEventListener('change', function() {
      if (resultadosActuales) {
        renderCreditos(resultadosActuales.creditos, resultadosActuales.capacidad);
      }
    });

    // Re-filtrar al cambiar select de region, comuna o checkboxes
    $('#regionBusqueda').addEventListener('change', function() {
      if (resultadosActuales) {
        var props = filtrarPropiedadesLocales(resultadosActuales.capacidad);
        resultadosActuales.propiedades = props;
        renderPropiedades(props, resultadosActuales.capacidad);
      }
    });
    $('#comunaBusqueda').addEventListener('change', function() {
      if (resultadosActuales) {
        var props = filtrarPropiedadesLocales(resultadosActuales.capacidad);
        resultadosActuales.propiedades = props;
        renderPropiedades(props, resultadosActuales.capacidad);
      }
    });

    document.querySelectorAll('input[name="tipoPropiedad"]').forEach(function(cb) {
      cb.addEventListener('change', function() {
        if (resultadosActuales) {
          var props = filtrarPropiedadesLocales(resultadosActuales.capacidad);
          resultadosActuales.propiedades = props;
          renderPropiedades(props, resultadosActuales.capacidad);
        }
      });
    });
  }

  // ===== DATA SOURCE DISPLAY =====
  function actualizarDisplayFuentes() {
    var ufValElem = $('#ufValorDisplay');
    var ufFechaElem = $('#ufFechaDisplay');
    var tasaSourceElem = $('#tasaSourceLabel');
    var propSourceElem = $('#propSourceLabel');

    // UF display
    if (ufValElem) {
      ufValElem.textContent = '$' + new Intl.NumberFormat('es-CL').format(Math.round(valorUF));
    }
    if (ufFechaElem && window._fechaUF) {
      ufFechaElem.textContent = 'UF al ' + window._fechaUF;
      ufFechaElem.style.color = '#10b981';
    } else if (ufFechaElem) {
      ufFechaElem.textContent = 'UF valor referencial';
      ufFechaElem.style.color = '#f59e0b';
    }

    // Tasa source
    if (tasaSourceElem) {
      if (window._tasasAjustadas && window._fechaTasaCMF) {
        tasaSourceElem.innerHTML = 'Tasas ajustadas con CMF (promedio sistema) al ' +
          new Date(window._fechaTasaCMF).toLocaleDateString('es-CL', { month: 'long', year: 'numeric' });
        tasaSourceElem.className = 'info-bar-item fuente-real';
      } else {
        tasaSourceElem.innerHTML = 'Tasas referenciales (' + fechaActualizacionTasas + ') · Verifica con cada banco';
        tasaSourceElem.className = 'info-bar-item fuente-ref';
      }
    }

    // Prop source
    if (propSourceElem) {
      propSourceElem.innerHTML = 'Propiedades: MercadoLibre Chile (tiempo real) · Datos locales como respaldo';
      propSourceElem.className = 'info-bar-item fuente-real';
    }
  }

  function actualizarDisplayUF() {
    actualizarDisplayFuentes();
  }

  // ===== INIT =====
  async function init() {
    initTheme();
    initNav();
    initEstadoCivil();
    initRegionComuna();
    initEventListeners();
    initModal();

    // Cargar UF desde mindicador.cl (REAL)
    try {
      await obtenerValorUF();
    } catch (e) {
      console.warn("UF fallo, usando valor por defecto:", e.message);
    }

    // Intentar ajustar tasas con CMF/SBIF (REAL)
    try {
      var tasaReal = await obtenerTasaReal();
      if (tasaReal && tasaReal > 0) {
        ajustarTasasConCMF(tasaReal);
      }
    } catch (e) {
      console.warn("No se pudo obtener tasa real, usando tasas referenciales");
    }

    actualizarDisplayFuentes();
    actualizarBadgeML();
    initUI_Auth();

    console.log("✅ TuCasaChile inicializado correctamente");
    console.log("💡 UF:", valorUF ? "$" + Math.round(valorUF) : "pendiente");
    console.log("💡 Tasas:", window._tasasAjustadas ? "CMF conectado" : "referenciales");
    console.log("💡 Clave Unica:", usuarioAutenticado() ? "autenticado" : "no autenticado - click para probar");
  }

  // ===== INTERFAZ CLAVE UNICA =====
  function initUI_ClaveUnica() {
    var user = usuarioAutenticado();
    var btnLogin = document.getElementById('btnClaveUnica');
    var btnLogout = document.getElementById('btnCerrarSesion');
    var userNameDisplay = document.getElementById('userNameDisplay');

    if (user && user.verificado) {
      // Usuario autenticado
      if (btnLogin) btnLogin.style.display = 'none';
      if (btnLogout) {
        btnLogout.style.display = 'inline-flex';
        if (userNameDisplay) {
          userNameDisplay.textContent = (user.nombre || 'Usuario') + ' (RUT: ' + (user.rut || '') + ')';
        }
      }
    } else {
      // Usuario no autenticado
      if (btnLogin) btnLogin.style.display = 'inline-flex';
      if (btnLogout) btnLogout.style.display = 'none';
    }

    // Verificar parametro auth en URL
    var urlParams = new URLSearchParams(window.location.search);
    var authStatus = urlParams.get('auth');
    if (authStatus === 'success') {
      showToast('Identidad verificada exitosamente con Clave Unica');
      window.history.replaceState({}, document.title, window.location.pathname);
      initUI_ClaveUnica();
    } else if (authStatus === 'logout') {
      showToast('Sesion cerrada correctamente');
      window.history.replaceState({}, document.title, window.location.pathname);
      initUI_ClaveUnica();
    } else if (authStatus === 'error') {
      showToast('No se pudo completar la autenticacion');
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }

  // Iniciar cuando el DOM este listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();