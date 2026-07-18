/**
 * TuCasaChile - Datos de Bancos, Regiones y Propiedades
 * Datos referenciales de creditos hipotecarios en Chile
 */

// ===== BANCOS CHILENOS CON TASAS REFERENCIALES =====
const bancosChile = [
  {
    id: "bci",
    nombre: "Banco BCI",
    color: "#003d7c",
    iconBg: "#e0ecf8",
    tasaPrimeraVivienda: 4.35,
    tasaSegundaVivienda: 4.85,
    caeBase: 5.1,
    seguroIncendioUF: 0.015,
    seguroDesgravamenUF: 0.022,
    pieMinimo: 10,
    financiamientoMax: 90,
    gastosOperacionales: 0.8,
    requisitos: "Evaluacion crediticia, antiguedad laboral 1 ano"
  },
  {
    id: "santander",
    nombre: "Banco Santander Chile",
    color: "#ec0000",
    iconBg: "#fce8e8",
    tasaPrimeraVivienda: 4.25,
    tasaSegundaVivienda: 4.75,
    caeBase: 5.0,
    seguroIncendioUF: 0.014,
    seguroDesgravamenUF: 0.021,
    pieMinimo: 10,
    financiamientoMax: 90,
    gastosOperacionales: 0.9,
    requisitos: "Renta minima $400.000, antiguedad 6 meses"
  },
  {
    id: "chile",
    nombre: "Banco de Chile",
    color: "#004b87",
    iconBg: "#dce8f2",
    tasaPrimeraVivienda: 4.40,
    tasaSegundaVivienda: 4.90,
    caeBase: 5.2,
    seguroIncendioUF: 0.016,
    seguroDesgravamenUF: 0.023,
    pieMinimo: 10,
    financiamientoMax: 90,
    gastosOperacionales: 0.85,
    requisitos: "Evaluacion crediticia, cuenta corriente"
  },
  {
    id: "estado",
    nombre: "BancoEstado",
    color: "#003366",
    iconBg: "#dce6f2",
    tasaPrimeraVivienda: 4.20,
    tasaSegundaVivienda: 4.70,
    caeBase: 4.95,
    seguroIncendioUF: 0.013,
    seguroDesgravamenUF: 0.020,
    pieMinimo: 20,
    financiamientoMax: 80,
    gastosOperacionales: 0.75,
    requisitos: "Ser cliente BancoEstado, antiguedad laboral 6 meses"
  },
  {
    id: "scotiabank",
    nombre: "Scotiabank Chile",
    color: "#cc0000",
    iconBg: "#fae8e8",
    tasaPrimeraVivienda: 4.30,
    tasaSegundaVivienda: 4.80,
    caeBase: 5.05,
    seguroIncendioUF: 0.015,
    seguroDesgravamenUF: 0.022,
    pieMinimo: 20,
    financiamientoMax: 80,
    gastosOperacionales: 0.82,
    requisitos: "Renta comprobable, Dicom OK"
  },
  {
    id: "itau",
    nombre: "Banco Itau Chile",
    color: "#ec7000",
    iconBg: "#fef0e0",
    tasaPrimeraVivienda: 4.45,
    tasaSegundaVivienda: 4.95,
    caeBase: 5.25,
    seguroIncendioUF: 0.016,
    seguroDesgravamenUF: 0.024,
    pieMinimo: 20,
    financiamientoMax: 80,
    gastosOperacionales: 0.9,
    requisitos: "Evaluacion crediticia, buen comportamiento bancario"
  },
  {
    id: "security",
    nombre: "Banco Security",
    color: "#0055a5",
    iconBg: "#dde8f6",
    tasaPrimeraVivienda: 4.50,
    tasaSegundaVivienda: 5.00,
    caeBase: 5.3,
    seguroIncendioUF: 0.017,
    seguroDesgravamenUF: 0.025,
    pieMinimo: 25,
    financiamientoMax: 80,
    gastosOperacionales: 0.95,
    requisitos: "Perfil alto patrimonio, renta minima $1.000.000"
  },
  {
    id: "falabella",
    nombre: "Banco Falabella",
    color: "#87c040",
    iconBg: "#eaf6e0",
    tasaPrimeraVivienda: 4.55,
    tasaSegundaVivienda: 5.05,
    caeBase: 5.35,
    seguroIncendioUF: 0.018,
    seguroDesgravamenUF: 0.026,
    pieMinimo: 20,
    financiamientoMax: 80,
    gastosOperacionales: 0.78,
    requisitos: "Cmr abierta, evaluacion crediticia"
  },
  {
    id: "ripley",
    nombre: "Banco Ripley",
    color: "#6d1b6d",
    iconBg: "#f0e0f4",
    tasaPrimeraVivienda: 4.60,
    tasaSegundaVivienda: 5.10,
    caeBase: 5.4,
    seguroIncendioUF: 0.018,
    seguroDesgravamenUF: 0.027,
    pieMinimo: 20,
    financiamientoMax: 80,
    gastosOperacionales: 0.85,
    requisitos: "Tarjeta Ripley, antiguedad laboral 1 ano"
  },
  {
    id: "internacional",
    nombre: "Banco Internacional",
    color: "#002060",
    iconBg: "#dce0f0",
    tasaPrimeraVivienda: 4.70,
    tasaSegundaVivienda: 5.20,
    caeBase: 5.5,
    seguroIncendioUF: 0.019,
    seguroDesgravamenUF: 0.028,
    pieMinimo: 25,
    financiamientoMax: 80,
    gastosOperacionales: 0.92,
    requisitos: "Evaluacion crediticia, renta estable"
  },
  {
    id: "consorcio",
    nombre: "Banco Consorcio",
    color: "#005c8a",
    iconBg: "#daeaf4",
    tasaPrimeraVivienda: 4.65,
    tasaSegundaVivienda: 5.15,
    caeBase: 5.45,
    seguroIncendioUF: 0.017,
    seguroDesgravamenUF: 0.025,
    pieMinimo: 25,
    financiamientoMax: 80,
    gastosOperacionales: 0.88,
    requisitos: "Buen historial crediticio, perfil conservador"
  },
  {
    id: "bice",
    nombre: "Banco BICE",
    color: "#003056",
    iconBg: "#dce4f0",
    tasaPrimeraVivienda: 4.40,
    tasaSegundaVivienda: 4.90,
    caeBase: 5.15,
    seguroIncendioUF: 0.015,
    seguroDesgravamenUF: 0.022,
    pieMinimo: 20,
    financiamientoMax: 80,
    gastosOperacionales: 0.82,
    requisitos: "Renta alta, patrimonio comprobable"
  }
];

// ===== REGIONES Y COMUNAS DE CHILE =====
const regionesChile = {
  "arica": {
    nombre: "Arica y Parinacota",
    comunas: ["Arica", "Putre", "Camarones", "General Lagos"]
  },
  "tarapaca": {
    nombre: "Tarapaca",
    comunas: ["Iquique", "Alto Hospicio", "Pica", "Pozo Almonte", "Huara"]
  },
  "antofagasta": {
    nombre: "Antofagasta",
    comunas: ["Antofagasta", "Calama", "Mejillones", "Tocopilla", "San Pedro de Atacama"]
  },
  "atacama": {
    nombre: "Atacama",
    comunas: ["Copiapo", "Vallenar", "Caldera", "Diego de Almagro", "Huasco"]
  },
  "coquimbo": {
    nombre: "Coquimbo",
    comunas: ["La Serena", "Coquimbo", "Ovalle", "Illapel", "Los Vilos"]
  },
  "valparaiso": {
    nombre: "Valparaiso",
    comunas: ["Valparaiso", "Vina del Mar", "Quilpue", "Villa Alemana", "Concon", "San Antonio", "Quillota", "Los Andes", "San Felipe"]
  },
  "metropolitana": {
    nombre: "Metropolitana (Santiago)",
    comunas: ["Santiago Centro", "Providencia", "Las Condes", "Nunoa", "La Florida", "Maipu", "Vitacura", "Lo Barnechea", "Penalolen", "La Reina", "San Miguel", "Estacion Central", "Quilicura", "Puente Alto", "San Bernardo", "La Cisterna", "Macul", "Huechuraba", "Colina"]
  },
  "ohiggins": {
    nombre: "O'Higgins",
    comunas: ["Rancagua", "San Fernando", "Rengo", "Machali", "Santa Cruz"]
  },
  "maule": {
    nombre: "Maule",
    comunas: ["Talca", "Curico", "Linares", "Constitucion", "Cauquenes"]
  },
  "nuble": {
    nombre: "Nuble",
    comunas: ["Chillan", "San Carlos", "Bulnes", "Quirihue", "Coihueco"]
  },
  "biobio": {
    nombre: "Biobio",
    comunas: ["Concepcion", "Los Angeles", "Talcahuano", "Chiguayante", "San Pedro de la Paz", "Hualpen", "Coronel"]
  },
  "araucania": {
    nombre: "La Araucania",
    comunas: ["Temuco", "Villarrica", "Pucon", "Angol", "Victoria"]
  },
  "losrios": {
    nombre: "Los Rios",
    comunas: ["Valdivia", "La Union", "Panguipulli", "Rio Bueno", "Paillaco"]
  },
  "loslagos": {
    nombre: "Los Lagos",
    comunas: ["Puerto Montt", "Osorno", "Puerto Varas", "Frutillar", "Ancud", "Castro"]
  },
  "aysen": {
    nombre: "Aysen",
    comunas: ["Coyhaique", "Puerto Aysen", "Chile Chico", "Cochrane"]
  },
  "magallanes": {
    nombre: "Magallanes",
    comunas: ["Punta Arenas", "Puerto Natales", "Porvenir"]
  }
};

// ===== PROPIEDADES (exclusivamente desde MercadoLibre en tiempo real) =====
var propiedadesChile = [];
// Las propiedades se obtienen desde api.mercadolibre.com en tiempo real
// No se incluyen datos falsos de ejemplo.
/*
  { id: 1, titulo: "Departamento 2D2B en Providencia", tipo: "departamento", region: "metropolitana", comuna: "Providencia", precio: 89000000, dormitorios: 2, banos: 2, m2: 65, uf: 2400, descripcion: "Excelente departamento cerca de metro Los Leones. Piso 12, vista panoramica, estacionamiento incluido." },
  { id: 2, titulo: "Casa amplia en Maipu", tipo: "casa", region: "metropolitana", comuna: "Maipu", precio: 125000000, dormitorios: 3, banos: 2, m2: 140, uf: 3370, descripcion: "Casa esquina con patio amplio, 3 dormitorios, living comedor, cocina americana. Cerca de colegios y supermercados." },
  { id: 3, titulo: "Departamento Studio en Santiago Centro", tipo: "departamento", region: "metropolitana", comuna: "Santiago Centro", precio: 55000000, dormitorios: 1, banos: 1, m2: 35, uf: 1485, descripcion: "Ideal para inversion o primera vivienda. Cerca de metro Santa Lucia, excelente conectividad." },
  { id: 4, titulo: "Casa en Las Condes", tipo: "casa", region: "metropolitana", comuna: "Las Condes", precio: 280000000, dormitorios: 4, banos: 3, m2: 220, uf: 7560, descripcion: "Casa de lujo con jardin, piscina, quincho. Barrio residencial tranquilo. 2 estacionamientos." },
  { id: 5, titulo: "Departamento en Nunoa", tipo: "departamento", region: "metropolitana", comuna: "Nunoa", precio: 105000000, dormitorios: 2, banos: 2, m2: 72, uf: 2835, descripcion: "Departamento remodelado en el corazon de Nunoa. Terraza, bodega y estacionamiento." },
  { id: 6, titulo: "Casa en La Florida", tipo: "casa", region: "metropolitana", comuna: "La Florida", precio: 98000000, dormitorios: 3, banos: 2, m2: 110, uf: 2646, descripcion: "Casa de dos pisos, sector tranquilo. Cerca de metro y comercio." },
  { id: 7, titulo: "Terreno en Colina", tipo: "terreno", region: "metropolitana", comuna: "Colina", precio: 35000000, dormitorios: 0, banos: 0, m2: 5000, uf: 945, descripcion: "Terreno de 5.000 m2 en sector Chicureo. Ideal para construir casa de campo. Vista a la cordillera." },
  { id: 8, titulo: "Parcela en Lo Barnechea", tipo: "parcela", region: "metropolitana", comuna: "Lo Barnechea", precio: 180000000, dormitorios: 3, banos: 2, m2: 8000, uf: 4860, descripcion: "Parcela de agrado con casa construida. Agua de pozo, luz electrica. Maravillosa vista." },
  { id: 9, titulo: "Departamento en Vitacura", tipo: "departamento", region: "metropolitana", comuna: "Vitacura", precio: 195000000, dormitorios: 3, banos: 2, m2: 110, uf: 5265, descripcion: "Departamento de lujo, primer piso con jardin privado. 3 dormitorios, 2 banos, estacionamiento techado." },

  // VALPARAISO
  { id: 10, titulo: "Departamento frente al mar en Vina del Mar", tipo: "departamento", region: "valparaiso", comuna: "Vina del Mar", precio: 135000000, dormitorios: 3, banos: 2, m2: 95, uf: 3645, descripcion: "Espectacular vista al mar. Piso 18, terraza amplia, amoblado. A pasos del casino." },
  { id: 11, titulo: "Casa en Concon", tipo: "casa", region: "valparaiso", comuna: "Concon", precio: 165000000, dormitorios: 3, banos: 3, m2: 150, uf: 4455, descripcion: "Casa moderna cerca de las dunas. Living amplio, cocina equipada, quincho y piscina." },
  { id: 12, titulo: "Departamento economico en Quilpue", tipo: "departamento", region: "valparaiso", comuna: "Quilpue", precio: 48000000, dormitorios: 2, banos: 1, m2: 55, uf: 1296, descripcion: "Ideal primera vivienda. Cerca de locomocion, colegios y comercio." },

  // BIOBIO
  { id: 13, titulo: "Departamento en Concepcion", tipo: "departamento", region: "biobio", comuna: "Concepcion", precio: 78000000, dormitorios: 2, banos: 2, m2: 68, uf: 2106, descripcion: "Centro de Concepcion, cerca de la Universidad. Excelente conectividad." },
  { id: 14, titulo: "Casa en San Pedro de la Paz", tipo: "casa", region: "biobio", comuna: "San Pedro de la Paz", precio: 95000000, dormitorios: 3, banos: 2, m2: 120, uf: 2565, descripcion: "Casa nueva en condominio cerrado. Areas verdes, seguridad 24/7." },

  // LOS LAGOS
  { id: 15, titulo: "Casa en Puerto Varas", tipo: "casa", region: "loslagos", comuna: "Puerto Varas", precio: 145000000, dormitorios: 4, banos: 2, m2: 160, uf: 3915, descripcion: "Hermosa casa con vista al lago Llanquihue. Jardin amplio, cocina de lujo." },
  { id: 16, titulo: "Terreno en Frutillar", tipo: "terreno", region: "loslagos", comuna: "Frutillar", precio: 28000000, dormitorios: 0, banos: 0, m2: 3000, uf: 756, descripcion: "Terreno con vista al lago. Zona rural, ideal para casa de veraneo." },

  // COQUIMBO
  { id: 17, titulo: "Departamento en La Serena", tipo: "departamento", region: "coquimbo", comuna: "La Serena", precio: 72000000, dormitorios: 2, banos: 2, m2: 70, uf: 1944, descripcion: "A pasos de la playa y el faro. Amoblado y equipado. Ideal para vivir o arrendar." },

  // ANTOFAGASTA
  { id: 18, titulo: "Departamento en Antofagasta", tipo: "departamento", region: "antofagasta", comuna: "Antofagasta", precio: 82000000, dormitorios: 2, banos: 1, m2: 60, uf: 2214, descripcion: "Sector centro norte. Vista al mar, cerca de todo. Excelente estado." },

  // LA ARAUCANIA
  { id: 19, titulo: "Parcela en Villarrica", tipo: "parcela", region: "araucania", comuna: "Villarrica", precio: 62000000, dormitorios: 2, banos: 1, m2: 5000, uf: 1674, descripcion: "Parcela con casa de madera. Vista al volcan Villarrica. Bosque nativo." },
  { id: 20, titulo: "Casa en Pucon", tipo: "casa", region: "araucania", comuna: "Pucon", precio: 175000000, dormitorios: 3, banos: 2, m2: 130, uf: 4725, descripcion: "Casa de lujo a orillas del lago Villarrica. Muelle privado, tinaja caliente." },

  // O'HIGGINS
  { id: 21, titulo: "Casa en Rancagua", tipo: "casa", region: "ohiggins", comuna: "Rancagua", precio: 68000000, dormitorios: 3, banos: 1, m2: 100, uf: 1836, descripcion: "Casa central, cerca de todo. Sector residencial tranquilo." },

  // MAGALLANES
  { id: 22, titulo: "Casa en Punta Arenas", tipo: "casa", region: "magallanes", comuna: "Punta Arenas", precio: 89000000, dormitorios: 3, banos: 2, m2: 125, uf: 2403, descripcion: "Casa con calefaccion central. Aislada termicamente. Cerca del centro." },

  // MAULE
  { id: 23, titulo: "Terreno agricola en Talca", tipo: "terreno", region: "maule", comuna: "Talca", precio: 42000000, dormitorios: 0, banos: 0, m2: 8000, uf: 1134, descripcion: "Terreno agricola con derechos de agua. Ideal para plantaciones o vina." },

  // ATACAMA
  { id: 24, titulo: "Departamento en Copiapo", tipo: "departamento", region: "atacama", comuna: "Copiapo", precio: 59000000, dormitorios: 2, banos: 1, m2: 58, uf: 1593, descripcion: "Departamento centrico, cerca de todo. Excelente para profesionales mineros." },

  // NUBLE
  { id: 25, titulo: "Casa en Chillan", tipo: "casa", region: "nuble", comuna: "Chillan", precio: 65000000, dormitorios: 3, banos: 2, m2: 115, uf: 1755, descripcion: "Casa nueva, barrio residencial. Cerca de Universidad del Bio-Bio." }
];

// Valor UF (se actualiza dinamicamente desde mindicador.cl)
let valorUF = 37050; // valor por defecto mientras carga

// Fecha de ultima actualizacion de tasas (referencial)
const fechaActualizacionTasas = "Julio 2026";

// ===== CMF API - TASAS DE INTERES REALES =====
// La CMF (Comision para el Mercado Financiero) publica tasas de interes
// promedio del sistema financiero chileno

/**
 * Obtiene la tasa de interes promedio real para creditos hipotecarios desde la CMF
 * @returns {Promise<number|null>} Tasa anual promedio o null si falla
 */
/**
 * Obtiene la tasa de interes promedio real desde multiples fuentes
 * @returns {Promise<number|null>} Tasa anual promedio o null si falla
 */
async function obtenerTasaReal() {
  // Intentar con la API publica de la CMF (SBIF)
  var tasa = await obtenerTasaSBIF();
  if (tasa) return tasa;

  // Si SBIF falla, usar valor de referencia basado en la UF del Banco Central
  return null;
}

async function obtenerTasaSBIF() {
  try {
    // La Comision para el Mercado Financiero (CMF) publica estadisticas
    // Usamos la API v1 que es mas estable
    var url = "https://api.cmfchile.cl/api-sbi/estadisticas/financiero/2024/1/mercado-cambios/operaciones-cambio/F030_TASA_INTERES_PROMEDIO/17/18/19/20/21/d?formato=json";
    console.log("CMF:", url);
    var response = await fetch(url);
    if (!response.ok) throw new Error("Error CMF");
    var data = await response.json();
    if (data && data.data && data.data.length > 0) {
      for (var i = data.data.length - 1; i >= 0; i--) {
        if (data.data[i].valor && parseFloat(data.data[i].valor) > 0) {
          var tasa = parseFloat(data.data[i].valor);
          console.log("Tasa CMF:", tasa + "%", data.data[i].fecha);
          window._tasaCMFReal = tasa;
          window._fechaTasaCMF = data.data[i].fecha;
          return tasa;
        }
      }
    }
    throw new Error("Sin datos CMF");
  } catch (e) {
    console.warn("CMF:", e.message);
    return null;
  }
}

/**
 * Ajusta las tasas con el valor real obtenido
 */
function ajustarTasasConCMF(tasaReal) {
  if (!tasaReal || tasaReal <= 0) return;

  var tasaBase = 4.20;
  var factor = Math.max(0.85, Math.min(1.15, tasaReal / tasaBase));
  console.log("Factor ajuste:", factor.toFixed(3));

  bancosChile.forEach(function(b) {
    b.tasaPrimeraVivienda = Math.round(b.tasaPrimeraVivienda * factor * 100) / 100;
    b.tasaSegundaVivienda = Math.round(b.tasaSegundaVivienda * factor * 100) / 100;
  });

  window._tasasAjustadas = true;
}

// ===== SUBSIDIOS HABITACIONALES CHILE =====
const subsidiosChile = {
  ds1: {
    nombre: "DS1 - Subsidio para Sectores Medios",
    tramos: {
      t1: { nombre: "Tramo 1", monto: 500, descripcion: "Viviendas hasta 1.100 UF" },
      t2: { nombre: "Tramo 2", monto: 400, descripcion: "Viviendas hasta 1.600 UF" },
      t3: { nombre: "Tramo 3", monto: 300, descripcion: "Viviendas hasta 2.200 UF" }
    },
    descripcion: "Subsidio del MINVU para familias de sectores medios que no son propietarias de vivienda. Requiere ahorro minimo y credito hipotecario aprobado."
  },
  ds19: {
    nombre: "DS19 - Programa Integracion Social",
    monto: 300,
    descripcion: "Subsidio para proyectos de integracion social en barrios bien localizados. Viviendas hasta 2.200 UF en regiones especificas."
  },
  dfl2: {
    nombre: "DFL2 - Credito para Viviendas Economicas",
    descripcion: "Permite financiar hasta el 100% de viviendas de hasta UF 5.200 (RM) o UF 5.500 (regiones) con tasa preferencial rebajada y dividendos sin reajuste. Exento de impuesto de timbre.",
    tasaAnual: 3.0,
    viviendaMaximaUF: 5200,
    pieMinimo: 5,
    financiamientoMax: 95
  }
};

// ===== MERCADOLIBRE API - PROPIEDADES REALES =====
// Categorias de Inmuebles en MercadoLibre Chile (MLC)
const categoriasML = {
  "departamento": "MLC1482",   // Departamentos
  "casa": "MLC1481",           // Casas
  "terreno": "MLC1486",        // Terrenos
  "parcela": "MLC1486"         // Terrenos (misma categoria)
};

// Mapeo de region nombre a state ID de MercadoLibre
const regionesML = {
  "metropolitana": "TUxBUENBUGw3M2E1",     // RM (Metropolitana)
  "valparaiso": "TUxBUENBUGw3M2E1",        // Valparaiso
  "biobio": "TUxBUENBUGw3M2Uz",            // Biobio
  "loslagos": "TUxBUENBUGw3M2U5",          // Los Lagos
  "coquimbo": "TUxBUENBUGw3M2Ux",          // Coquimbo
  "antofagasta": "TUxBUENBUGw3M2Vh",       // Antofagasta
  "araucania": "TUxBUENBUGw3M2U2",         // Araucania
  "ohiggins": "TUxBUENBUGw3M2Vj",          // O'Higgins
  "maule": "TUxBUENBUGw3M2U4",             // Maule
  "atacama": "TUxBUENBUGw3M2Vm",           // Atacama
  "tarapaca": "TUxBUENBUGw3M2Uw",          // Tarapaca
  "losrios": "TUxBUENBUGw3M2Vk",           // Los Rios
  "arica": "TUxBUENBUGw3M2Vi",             // Arica y Parinacota
  "nuble": "TUxBUENBUGw3M2Vn",             // Nuble
  "magallanes": "TUxBUENBUGw3M2Vl",        // Magallanes
  "aysen": "TUxBUENBUGw3M2Vh"              // Aysen
};

/**
 * Obtiene propiedades reales desde la API publica de MercadoLibre Chile
 * @param {string} tipo - departamento, casa, terreno, parcela
 * @param {string} regionKey - clave de la region (opcional)
 * @param {number} precioMax - precio maximo en CLP
 * @returns {Promise<Array>} Lista de propiedades formateadas
 */
async function obtenerPropiedadesML(tipo, regionKey, precioMax, comuna) {
  const categoria = categoriasML[tipo] || "MLC1482";
  let urlML = "https://api.mercadolibre.com/sites/MLC/search?category=" + categoria + "&limit=15&sort=price_asc";

  // Agregar filtro de region si existe mapeo
  if (regionKey && regionesML[regionKey]) {
    urlML += "&state=" + regionesML[regionKey];
  }

  // Agregar filtro de comuna (q=busqueda textual)
  if (comuna && comuna.trim()) {
    urlML += "&q=" + encodeURIComponent(comuna.trim());
  }

  // Agregar precio maximo
  if (precioMax && precioMax > 0) {
    urlML += "&price=0-" + precioMax;
  }

  /**
   * Intenta fetch con proxy CORS si falla directo
   */
  async function fetchConProxy(url) {
    // Intento 1: Directo
    try {
      console.log("ML directo:", url);
      const resp = await fetch(url);
      if (resp.ok) return resp;
    } catch(e) {
      console.warn("ML directo fallo, intentando con proxy CORS...");
    }

    // Intento 2: Con proxy allorigins
    try {
      var proxyUrl = "https://api.allorigins.win/raw?url=" + encodeURIComponent(url);
      console.log("ML via proxy:", proxyUrl);
      var resp = await fetch(proxyUrl);
      if (resp.ok) return resp;
    } catch(e2) {
      console.warn("ML proxy tambien fallo");
    }

    // Intento 3: Otro proxy
    try {
      var proxyUrl2 = "https://corsproxy.io/?" + encodeURIComponent(url);
      var resp = await fetch(proxyUrl2);
      if (resp.ok) return resp;
    } catch(e3) {
      console.warn("ML proxy2 fallo");
    }

    return null;
  }

  try {
    const response = await fetchConProxy(urlML);
    if (!response) throw new Error("Todos los intentos fallaron");
    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      console.warn("ML sin resultados para " + tipo + " en region " + (regionKey || "todas"));
      return [];
    }

    // Formatear resultados a nuestro formato de propiedad
    return data.results.map(function(item, index) {
      // Extraer atributos
      const attrs = {};
      if (item.attributes) {
        item.attributes.forEach(function(attr) {
          attrs[attr.id] = attr.value_name || attr.value;
        });
      }

      // Extraer comuna del address
      let comuna = "";
      if (item.address && item.address.city_name) {
        comuna = item.address.city_name;
      } else if (item.seller_address && item.seller_address.city && item.seller_address.city.name) {
        comuna = item.seller_address.city.name;
      }

      let regionNombre = "";
      if (regionKey && regionesChile[regionKey]) {
        regionNombre = regionesChile[regionKey].nombre;
      } else if (item.seller_address && item.seller_address.state && item.seller_address.state.name) {
        regionNombre = item.seller_address.state.name;
      }

      return {
        id: 1000 + index,
        titulo: item.title || "Propiedad sin titulo",
        tipo: tipo,
        region: regionKey || "",
        comuna: comuna || "Consultar",
        precio: item.price || 0,
        dormitorios: parseInt(attrs["BEDROOMS"] || attrs["ROOMS"] || 0),
        banos: parseInt(attrs["BATHROOMS"] || attrs["FULL_BATHROOMS"] || 0),
        m2: parseInt(attrs["COVERED_AREA"] || attrs["TOTAL_AREA"] || 0),
        uf: Math.round((item.price || 0) / valorUF),
        descripcion: comuna ? "Ubicado en " + comuna : "Ver detalle en MercadoLibre",
        imagen: item.thumbnail || "",
        urlML: item.permalink || "",
        fuente: "mercadolibre"
      };
    });

  } catch (error) {
    console.warn("Error obteniendo propiedades de MercadoLibre:", error.message);
    return [];
  }
}

/**
 * Obtiene el valor actual de la UF desde la API de mindicador.cl
 * @returns {Promise<number>} Valor de la UF en CLP
 */
async function obtenerValorUF() {
  try {
    const response = await fetch("https://mindicador.cl/api/uf");
    if (!response.ok) throw new Error("Error al obtener UF");
    const data = await response.json();
    if (data.serie && data.serie.length > 0) {
      valorUF = data.serie[0].valor;
      // Guardar la fecha de actualizacion
      window._fechaUF = new Date(data.serie[0].fecha).toLocaleDateString("es-CL", {
        year: "numeric", month: "long", day: "numeric"
      });
      console.log("UF actualizada: $" + valorUF + " (fecha: " + window._fechaUF + ")");
      return valorUF;
    }
  } catch (error) {
    console.warn("No se pudo obtener UF de mindicador.cl, usando valor por defecto:", error.message);
    window._fechaUF = null;
  }
  return valorUF;
}
