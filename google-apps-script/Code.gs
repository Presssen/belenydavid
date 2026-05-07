// ============================================================
// BELEN & DAVID — Script para guardar respuestas del formulario web
// ============================================================
// La web (RSVPForm.tsx) envía un POST con estos parámetros:
//   attending, fullName, firstName, lastName, hasCompanion,
//   companions, busNeeded, addressStreet, addressFloor,
//   addressPostalCode, addressCity, hasDietary, dietaryWho,
//   dietaryRestrictions, songSuggestion, message
// ============================================================

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(30000);
  
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var p = e.parameter;
    
    // ─────────────────────────────────────
    // LOGGING: Guardar datos crudos en hoja "Log" para verificar
    // ─────────────────────────────────────
    var logSheet = ss.getSheetByName('Log');
    if (!logSheet) {
      logSheet = ss.insertSheet('Log');
      logSheet.appendRow(['Timestamp', 'Datos recibidos']);
      logSheet.getRange('1:1').setFontWeight('bold');
    }
    logSheet.appendRow([new Date(), JSON.stringify(p)]);
    
    // ─────────────────────────────────────
    // LEER PARÁMETROS
    // ─────────────────────────────────────
    var attending            = p.attending || '';
    var firstName            = p.firstName || '';
    var lastName             = p.lastName || '';
    var hasCompanion         = p.hasCompanion || '';
    var companions           = p.companions || '';
    var busNeeded            = p.busNeeded || '';
    var addressStreet        = p.addressStreet || '';
    var addressFloor         = p.addressFloor || '';
    var addressPostalCode    = p.addressPostalCode || '';
    var addressCity          = p.addressCity || '';
    var hasDietary           = p.hasDietary || '';
    var dietaryWho           = p.dietaryWho || '';
    var dietaryRestrictions  = p.dietaryRestrictions || '';
    var songSuggestion       = p.songSuggestion || '';
    var message              = p.message || '';
    
    // Traducir attending y hasCompanion (llegan como "yes"/"no")
    var asistenciaSiNo = (attending === 'yes') ? 'Sí' : 'No';
    var acompSiNo      = (hasCompanion === 'yes') ? 'Sí' : 'No';
    
    // Dirección completa combinada (para la hoja Personas)
    var direccionCompleta = addressStreet;
    if (addressFloor) direccionCompleta += ', ' + addressFloor;
    direccionCompleta += ' - ' + addressPostalCode + ' ' + addressCity;
    
    // ═══════════════════════════════════════════════
    // HOJA 1: "Formulario"
    // Columna A: vacía | B: Asistencia | C: Nombre | D: Apellidos
    // E: Acompañante | F: Nombre acompañantes | G: Bus
    // H: Dirección | I: Piso | J: Código Postal | K: Ciudad
    // L: Alergias | M: Alergias-Quién | N: Restricciones
    // O: Canciones | P: Mensaje
    // ═══════════════════════════════════════════════
    
    var sheetForm = ss.getSheetByName('Formulario');
    if (!sheetForm) {
      sheetForm = ss.insertSheet('Formulario');
    }
    if (sheetForm.getLastRow() === 0) {
      sheetForm.appendRow([
        '', 'Asistencia', 'Nombre', 'Apellidos', 'Acompañante',
        'Nombre acompañantes', 'Bus', 'Dirección', 'Piso',
        'Código Postal', 'Ciudad', 'Alergias', 'Alergias - Quién',
        'Restricciones', 'Canciones', 'Mensaje'
      ]);
      sheetForm.getRange('1:1').setFontWeight('bold');
    }
    
    // appendRow escribe desde columna A
    // Ponemos '' en A para que los datos empiecen en B
    sheetForm.appendRow([
      '',                      // A — vacío
      asistenciaSiNo,          // B — Asistencia
      firstName,               // C — Nombre
      lastName,                // D — Apellidos
      acompSiNo,               // E — Acompañante
      companions,              // F — Nombre acompañantes
      busNeeded,               // G — Bus
      addressStreet,           // H — Dirección
      addressFloor,            // I — Piso
      addressPostalCode,       // J — Código Postal
      addressCity,             // K — Ciudad
      dietaryRestrictions,     // L — Alergias
      dietaryWho,              // M — Alergias - Quién
      hasDietary,              // N — Restricciones (Sí/No)
      songSuggestion,          // O — Canciones
      message                  // P — Mensaje
    ]);
    
    
    // ═══════════════════════════════════════════════
    // HOJA 2: "Personas"
    // Columna A: vacía | B: Nombre completo | C: Asistencia
    // D: Bus | E: Dirección | F: Alergias
    // Una fila por persona, acompañantes en filas separadas
    // ═══════════════════════════════════════════════
    
    var sheetPersonas = ss.getSheetByName('Personas');
    if (!sheetPersonas) {
      sheetPersonas = ss.insertSheet('Personas');
    }
    if (sheetPersonas.getLastRow() === 0) {
      sheetPersonas.appendRow(['', 'Nombre', 'Asistencia', 'Bus', 'Dirección', 'Alergias']);
      sheetPersonas.getRange('1:1').setFontWeight('bold');
    }
    
    // Determinar alergias por persona
    var alergiaPrincipal = '';
    var alergiaAcompanante = '';
    
    if (dietaryRestrictions !== '') {
      if (dietaryWho === 'Yo') {
        alergiaPrincipal = dietaryRestrictions;
      } else if (dietaryWho === 'Mi acompañante') {
        alergiaAcompanante = dietaryRestrictions;
      } else if (dietaryWho === 'Ambos') {
        alergiaPrincipal = dietaryRestrictions;
        alergiaAcompanante = dietaryRestrictions;
      } else {
        // Sin acompañante o sin especificar → alergia del principal
        alergiaPrincipal = dietaryRestrictions;
      }
    }
    
    // Fila del invitado principal
    sheetPersonas.appendRow([
      '',                                  // A — vacío
      firstName + ' ' + lastName,          // B — Nombre completo
      asistenciaSiNo,                      // C — Asistencia
      busNeeded,                           // D — Bus
      direccionCompleta,                   // E — Dirección
      alergiaPrincipal                     // F — Alergias
    ]);
    
    // Filas de cada acompañante
    if (acompSiNo === 'Sí' && companions !== '') {
      var listaAcomp = companions.split(',');
      for (var i = 0; i < listaAcomp.length; i++) {
        var nombreAcomp = listaAcomp[i].trim();
        if (nombreAcomp !== '') {
          sheetPersonas.appendRow([
            '',                            // A — vacío
            nombreAcomp,                   // B — Nombre completo
            asistenciaSiNo,                // C — Asistencia
            busNeeded,                     // D — Bus
            direccionCompleta,             // E — Dirección (misma del principal)
            alergiaAcompanante             // F — Alergias
          ]);
        }
      }
    }
    
    lock.releaseLock();
    
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Loguear el error también
    try {
      var ss2 = SpreadsheetApp.getActiveSpreadsheet();
      var logSheet2 = ss2.getSheetByName('Log');
      if (logSheet2) {
        logSheet2.appendRow([new Date(), 'ERROR: ' + error.toString()]);
      }
    } catch(e2) {}
    
    lock.releaseLock();
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService.createTextOutput('Script activo. Usa POST para enviar datos.');
}

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('🎉 Boda')
    .addItem('📋 Ver URL del script', 'mostrarUrl')
    .addToUi();
}

function mostrarUrl() {
  var url = ScriptApp.getService().getUrl();
  SpreadsheetApp.getUi().alert('URL del script:\n\n' + url);
}
