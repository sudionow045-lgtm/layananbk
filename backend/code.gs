/**
 * APLIKASI LAYANAN BK - BACKEND (Google Apps Script) - COMPRESSED VERSION
 */

const SPREADSHEET_ID = '1dePFAWsdKhegQw2-z1T5rz_4v7MpnCX2v4mfUnSaQA0';
const ADMIN_USER = 'admin';
const ADMIN_PASS = 'Lajoroni234';
const CACHE_TIME = 600; // 10 menit

const SHEETS_CONFIG = {
  'Siswa': ['ID', 'NISN', 'Nama', 'Tempat Lahir', 'Tanggal Lahir', 'Jenis Kelamin', 'Agama', 'Nama Orang Tua', 'Kelas', 'Status'],
  'Guru': ['ID', 'Nama', 'NIP', 'Mata Pelajaran'],
  'WaliKelas': ['ID', 'Nama', 'Kelas'],
  'LayananBK': ['ID', 'Tanggal', 'Jenis Layanan', 'Siswa', 'Keterangan'],
  'DCM': ['ID', 'Tanggal', 'Siswa', 'Hasil/Keterangan'],
  'Potensi': ['ID', 'Tanggal', 'Siswa', 'Potensi Diri'],
  'MinatBakat': ['ID', 'Tanggal', 'Siswa', 'Minat', 'Bakat'],
  'GayaBelajar': ['ID', 'Tanggal', 'Siswa', 'Tipe Gaya Belajar'],
  'JawabanInstrumen': ['ID', 'Tanggal', 'NISN', 'Nama', 'Kelas', 'Instrumen', 'Jawaban'],
  'PertanyaanInstrumen': ['ID', 'Instrumen', 'Pertanyaan', 'Kategori', 'Opsi'],
  'Settings': ['Key', 'Value']
};

let _ss;
const getSS = () => _ss || (_ss = SpreadsheetApp.openById(SPREADSHEET_ID));

function doPost(e) {
  try {
    const { action, payload } = JSON.parse(e.postData.contents);
    return createResponse(runAction(action, payload));
  } catch (error) {
    return createResponse({ success: false, message: error.toString() });
  }
}

/**
 * Helper function to run actions, accessible by doPost and google.script.run
 */
function runAction(action, payload) {
  try {
    const actions = {
      login: () => {
        const p = payload || {};
        const settings = getSettings();
        const username = (p.username || '').toLowerCase().trim();
        const password = p.password || '';
        
        // Cek terhadap password default ATAU password di pengaturan sheet
        const isDefaultPass = password === ADMIN_PASS;
        const isSheetPass = password === settings.AdminPass;
        const isValid = username === ADMIN_USER && (isDefaultPass || isSheetPass);
        
        console.log(`Login attempt: user=${username}, success=${isValid}`);
        
        return { 
          success: isValid, 
          message: isValid ? 'Login Berhasil' : 'Username atau Password Salah. (Cek penulisan password)' 
        };
      },
      getData: () => ({ success: true, data: getAllData(payload.sheetName) }),
      getBatchData: () => ({ success: true, data: getBatchData(payload.sheetNames) }),
      addData: () => ({ success: true, data: addData(payload.sheetName, payload.rowData) }),
      updateData: () => ({ success: true, data: updateData(payload.sheetName, payload.id, payload.rowData) }),
      deleteData: () => ({ success: true, data: deleteData(payload.sheetName, payload.id) }),
      getSettings: () => ({ success: true, data: getSettings() }),
      updateSettings: () => ({ success: true, data: updateSettings(payload.settings) }),
      clearCache: () => {
        const cache = CacheService.getScriptCache();
        Object.keys(SHEETS_CONFIG).forEach(name => cache.remove('data_' + name));
        return { success: true, message: 'Cache dibersihkan' };
      }
    };
    return actions[action] ? actions[action]() : { success: false, message: 'Aksi tidak dikenal: ' + action };
  } catch (error) {
    return { success: false, message: error.toString() };
  }
}

function doGet() {
  return HtmlService.createTemplateFromFile('index')
    .evaluate()
    .setTitle('Aplikasi Layanan BK')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function setup() {
  Object.keys(SHEETS_CONFIG).forEach(name => getSheet(name));
  initializePertanyaan();
  return "Setup Berhasil!";
}

function initializePertanyaan() {
  const sheet = getSheet('PertanyaanInstrumen');
  if (sheet.getLastRow() > 1) return;

  const defaultQuestions = [
    // DCM - A. KESEHATAN
    { instrumen: 'DCM', teks: 'Sering merasa lelah atau kurang bersemangat.', kategori: 'A. KESEHATAN' },
    { instrumen: 'DCM', teks: 'Sering sakit kepala atau pusing.', kategori: 'A. KESEHATAN' },
    // ... (Singkatkan saja untuk inisialisasi awal, user bisa tambah sendiri via UI)
    // Gaya Belajar (Contoh dengan Opsi)
    { 
      instrumen: 'Gaya', 
      teks: 'Ketika aku mengeja kata-kata, aku biasanya …', 
      kategori: 'Gaya Belajar', 
      opsi: JSON.stringify([
        { v: 'A', t: 'menuliskan kata tersebut' }, 
        { v: 'B', t: 'menyebutkan kata tersebut' }, 
        { v: 'C', t: 'menuliskan kata tersebut dengan cara rnenggerak-gerakkan jari di udara' }
      ]) 
    }
  ];

  defaultQuestions.forEach(q => {
    const rowData = {
      ID: Utilities.getUuid(),
      Instrumen: q.instrumen,
      Pertanyaan: q.teks,
      Kategori: q.kategori,
      Opsi: q.opsi || ''
    };
    addData('PertanyaanInstrumen', rowData);
  });
}

function createResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}

function getSheet(name) {
  const ss = getSS();
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    if (SHEETS_CONFIG[name]) sheet.appendRow(SHEETS_CONFIG[name]);
    if (name === 'Settings') {
      sheet.appendRow(['SchoolName', 'SMP NEGERI 4 FAKFAK']);
      sheet.appendRow(['AdminPass', 'Lajoroni234']);
      sheet.appendRow(['AcademicYear', '2023/2024']);
      sheet.appendRow(['KopSurat', 'https://imgur.com/3hAG3CN']);
    }
  }
  return sheet;
}

function getSettings() {
  const cache = CacheService.getScriptCache();
  const cached = cache.get('settings');
  if (cached) return JSON.parse(cached);

  const values = getSheet('Settings').getDataRange().getValues();
  const settings = values.slice(1).reduce((acc, [key, val]) => ({ ...acc, [key]: val }), {});
  cache.put('settings', JSON.stringify(settings), CACHE_TIME);
  return settings;
}

function updateSettings(newSettings) {
  const sheet = getSheet('Settings');
  const values = sheet.getDataRange().getValues();
  const settingsMap = new Map(values.map((r, i) => [r[0], i]));
  
  for (const [key, val] of Object.entries(newSettings)) {
    if (settingsMap.has(key)) sheet.getRange(settingsMap.get(key) + 1, 2).setValue(val);
    else sheet.appendRow([key, val]);
  }
  CacheService.getScriptCache().remove('settings');
  CacheService.getScriptCache().remove('data_Settings');
  return { message: 'Pengaturan diperbarui' };
}

function getAllData(sheetName) {
  const cache = CacheService.getScriptCache();
  const cached = cache.get('data_' + sheetName);
  if (cached) return JSON.parse(cached);

  const values = getSheet(sheetName).getDataRange().getValues();
  if (values.length <= 1) return [];
  const headers = values[0];
  let data;
  if (sheetName === 'Settings') {
    data = values.slice(1).reduce((acc, [key, val]) => ({ ...acc, [key]: val }), {});
  } else {
    data = values.slice(1).map(row => headers.reduce((obj, h, i) => ({ ...obj, [h]: row[i] }), {}));
  }
  
  try {
    cache.put('data_' + sheetName, JSON.stringify(data), CACHE_TIME);
  } catch (e) {
    // Jika data terlalu besar untuk cache, abaikan saja
  }
  return data;
}

function getBatchData(sheetNames) {
  const names = sheetNames || Object.keys(SHEETS_CONFIG);
  const cache = CacheService.getScriptCache();
  const result = {};
  const namesToFetch = [];

  // Coba ambil dari cache dulu
  names.forEach(name => {
    const cached = cache.get('data_' + name);
    if (cached) result[name] = JSON.parse(cached);
    else namesToFetch.push(name);
  });

  // Fetch yang tidak ada di cache
  if (namesToFetch.length > 0) {
    const ss = getSS();
    namesToFetch.forEach(name => {
      const sheet = ss.getSheetByName(name);
      if (!sheet) {
        result[name] = [];
        return;
      }
      const values = sheet.getDataRange().getValues();
      if (values.length <= 1) {
        result[name] = [];
      } else {
        const headers = values[0];
      let data;
      if (name === 'Settings') {
        data = values.slice(1).reduce((acc, [key, val]) => ({ ...acc, [key]: val }), {});
      } else {
        data = values.slice(1).map(row => headers.reduce((obj, h, i) => ({ ...obj, [h]: row[i] }), {}));
      }
      result[name] = data;
        try { cache.put('data_' + name, JSON.stringify(data), CACHE_TIME); } catch (e) {}
      }
    });
  }

  return result;
}

function addData(sheetName, rowData) {
  const sheet = getSheet(sheetName);
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const newRow = headers.map(h => (h === 'ID' && !rowData.ID) ? Utilities.getUuid() : (rowData[h] || ''));
  sheet.appendRow(newRow);
  CacheService.getScriptCache().remove('data_' + sheetName);
  return { message: 'Data berhasil ditambahkan' };
}

function updateData(sheetName, id, rowData) {
  const sheet = getSheet(sheetName);
  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  const rowIndex = values.findIndex(r => r[0] == id);
  if (rowIndex === -1) throw new Error('ID tidak ditemukan');
  
  const updatedRow = headers.map((h, i) => rowData[h] !== undefined ? rowData[h] : values[rowIndex][i]);
  sheet.getRange(rowIndex + 1, 1, 1, headers.length).setValues([updatedRow]);
  CacheService.getScriptCache().remove('data_' + sheetName);
  return { message: 'Data berhasil diperbarui' };
}

function deleteData(sheetName, id) {
  const sheet = getSheet(sheetName);
  const values = sheet.getDataRange().getValues();
  const rowIndex = values.findIndex(r => r[0] == id);
  if (rowIndex === -1) throw new Error('ID tidak ditemukan');
  sheet.deleteRow(rowIndex + 1);
  CacheService.getScriptCache().remove('data_' + sheetName);
  return { message: 'Data berhasil dihapus' };
}

