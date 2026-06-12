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
    // ═══════════════════════════════════════════════
    var sheetForm = ss.getSheetByName('Formulario') || ss.insertSheet('Formulario');
    var lastRowForm = sheetForm.getLastRow();
    if (lastRowForm === 0) {
      sheetForm.appendRow([
        'Fecha/Hora', 'Asistencia', 'Nombre', 'Apellidos', 'Acompañante',
        'Nombre acompañantes', 'Bus', 'Dirección', 'Piso',
        'Código Postal', 'Ciudad', 'Alergias', 'Alergias - Quién',
        'Restricciones', 'Canciones', 'Mensaje'
      ]);
      sheetForm.getRange('1:1').setFontWeight('bold');
      lastRowForm = 1;
    }
    
    var rowFormValue = [
      new Date(),              // A — Fecha/Hora
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
    ];
    sheetForm.getRange(lastRowForm + 1, 1, 1, 16).setValues([rowFormValue]);
    
    // ═══════════════════════════════════════════════
    // HOJA 2: "Personas"
    // ═══════════════════════════════════════════════
    var sheetPersonas = ss.getSheetByName('Personas') || ss.insertSheet('Personas');
    var lastRowPersonas = sheetPersonas.getLastRow();
    if (lastRowPersonas === 0) {
      sheetPersonas.appendRow(['', 'Nombre', 'Asistencia', 'Bus', 'Dirección', 'Alergias']);
      sheetPersonas.getRange('1:1').setFontWeight('bold');
      lastRowPersonas = 1;
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
    
    var personasRows = [];
    
    // Fila del invitado principal
    personasRows.push([
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
          personasRows.push([
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
    
    // Escribir todas las filas en lote
    sheetPersonas.getRange(lastRowPersonas + 1, 1, personasRows.length, 6).setValues(personasRows);
    
    lock.releaseLock();
    
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Loguear el error también en caso de falla
    try {
      var ss2 = SpreadsheetApp.getActiveSpreadsheet();
      var logSheet2 = ss2.getSheetByName('Log') || ss2.insertSheet('Log');
      var lastRowLog = logSheet2.getLastRow();
      if (lastRowLog === 0) {
        logSheet2.appendRow(['Timestamp', 'Datos recibidos / Error']);
        logSheet2.getRange('1:1').setFontWeight('bold');
        lastRowLog = 1;
      }
      logSheet2.getRange(lastRowLog + 1, 1, 1, 2).setValues([[
        new Date(),
        'ERROR: ' + error.toString() + ' | Params: ' + JSON.stringify(e.parameter)
      ]]);
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
