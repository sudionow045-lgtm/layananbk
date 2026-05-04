/**
 * APLIKASI LAYANAN BK - BACKEND (Google Apps Script)
 * File: code.gs
 */

const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE'; // Ganti dengan ID Spreadsheet Anda
const ADMIN_USER = 'admin';
const ADMIN_PASS = 'Lajoroni234';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    const payload = data.payload;

    // Autentikasi Sederhana
    if (action === 'login') {
      if (payload.username === ADMIN_USER && payload.password === ADMIN_PASS) {
        return createResponse({ success: true, message: 'Login Berhasil' });
      } else {
        return createResponse({ success: false, message: 'Username atau Password Salah' });
      }
    }

    // Aksi lainnya memerlukan validasi login (dalam demo ini kita langsung proses)
    switch (action) {
      case 'getData':
        return createResponse({ success: true, data: getAllData(payload.sheetName) });
      case 'addData':
        return createResponse({ success: true, data: addData(payload.sheetName, payload.rowData) });
      case 'updateData':
        return createResponse({ success: true, data: updateData(payload.sheetName, payload.id, payload.rowData) });
      case 'deleteData':
        return createResponse({ success: true, data: deleteData(payload.sheetName, payload.id) });
      case 'sendWA':
        return createResponse(sendWhatsAppNotification(payload.phone, payload.message));
      case 'getSettings':
        return createResponse({ success: true, data: getSettings() });
      case 'updateSettings':
        return createResponse({ success: true, data: updateSettings(payload.settings) });
      default:
        return createResponse({ success: false, message: 'Aksi tidak dikenal' });
    }
  } catch (error) {
    return createResponse({ success: false, message: error.toString() });
  }
}

function doGet(e) {
  return HtmlService.createHtmlOutput("Backend Aplikasi Layanan BK aktif. Spreadsheet ID: " + SPREADSHEET_ID);
}

/**
 * Fungsi untuk inisialisasi awal spreadsheet.
 * Jalankan fungsi ini sekali dari editor Apps Script untuk membuat semua sheet dan header.
 */
function setup() {
  const sheetNames = ['Siswa', 'Guru', 'WaliKelas', 'LayananBK', 'Settings', 'DCM', 'Potensi', 'MinatBakat', 'GayaBelajar'];
  sheetNames.forEach(name => {
    getSheet(name);
  });
  Logger.log('Inisialisasi Spreadsheet Berhasil!');
}

/**
 * Menambahkan menu ke Spreadsheet untuk memudahkan akses setup
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('Layanan BK')
      .addItem('Setup Spreadsheet', 'setup')
      .addToUi();
}

function createResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// Spreadsheet Functions
function getSheet(name) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    // Inisialisasi Header sesuai permintaan
    if (name === 'Siswa') sheet.appendRow(['ID', 'NISN', 'Nama', 'Tempat Lahir', 'Tanggal Lahir', 'Jenis Kelamin', 'Agama', 'Nama Orang Tua', 'Kelas', 'Status', 'No WA Orang Tua']);
    if (name === 'Guru') sheet.appendRow(['ID', 'Nama', 'NIP', 'Mata Pelajaran']);
    if (name === 'WaliKelas') sheet.appendRow(['ID', 'Nama', 'Kelas']);
    if (name === 'LayananBK') sheet.appendRow(['ID', 'Tanggal', 'Jenis Layanan', 'Siswa', 'Keterangan']);
    if (name === 'DCM') sheet.appendRow(['ID', 'Tanggal', 'Siswa', 'Hasil/Keterangan']);
    if (name === 'Potensi') sheet.appendRow(['ID', 'Tanggal', 'Siswa', 'Potensi Diri']);
    if (name === 'MinatBakat') sheet.appendRow(['ID', 'Tanggal', 'Siswa', 'Minat', 'Bakat']);
    if (name === 'GayaBelajar') sheet.appendRow(['ID', 'Tanggal', 'Siswa', 'Tipe Gaya Belajar']);
    if (name === 'Settings') {
      sheet.appendRow(['Key', 'Value']);
      sheet.appendRow(['SchoolName', 'Nama Sekolah Anda']);
      sheet.appendRow(['WAToken', 'YOUR_FONNTE_TOKEN']);
      sheet.appendRow(['AdminPass', 'Lajoroni234']);
    }
  }
  return sheet;
}

function getSettings() {
  const sheet = getSheet('Settings');
  const values = sheet.getDataRange().getValues();
  const settings = {};
  for (let i = 1; i < values.length; i++) {
    settings[values[i][0]] = values[i][1];
  }
  return settings;
}

function updateSettings(newSettings) {
  const sheet = getSheet('Settings');
  const values = sheet.getDataRange().getValues();
  for (const key in newSettings) {
    let found = false;
    for (let i = 1; i < values.length; i++) {
      if (values[i][0] === key) {
        sheet.getRange(i + 1, 2).setValue(newSettings[key]);
        found = true;
        break;
      }
    }
    if (!found) {
      sheet.appendRow([key, newSettings[key]]);
    }
  }
  return { message: 'Pengaturan diperbarui' };
}

function getAllData(sheetName) {
  const sheet = getSheet(sheetName);
  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  const data = [];
  for (let i = 1; i < values.length; i++) {
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = values[i][index];
    });
    data.push(obj);
  }
  return data;
}

function addData(sheetName, rowData) {
  const sheet = getSheet(sheetName);
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const newRow = headers.map(header => rowData[header] || '');
  if (!rowData.ID) newRow[0] = Utilities.getUuid(); // Auto ID jika tidak ada
  sheet.appendRow(newRow);
  return { message: 'Data berhasil ditambahkan' };
}

function updateData(sheetName, id, rowData) {
  const sheet = getSheet(sheetName);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] == id) {
      const rowNum = i + 1;
      headers.forEach((header, index) => {
        if (rowData[header] !== undefined) {
          sheet.getRange(rowNum, index + 1).setValue(rowData[header]);
        }
      });
      return { message: 'Data berhasil diperbarui' };
    }
  }
  throw new Error('ID tidak ditemukan');
}

function deleteData(sheetName, id) {
  const sheet = getSheet(sheetName);
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] == id) {
      sheet.deleteRow(i + 1);
      return { message: 'Data berhasil dihapus' };
    }
  }
  throw new Error('ID tidak ditemukan');
}

function sendWhatsAppNotification(phone, message) {
  const settings = getSettings();
  const token = settings.WAToken || 'YOUR_FONNTE_TOKEN'; 
  
  if (token === 'YOUR_FONNTE_TOKEN' || token === '') {
    return { success: true, message: 'Simulasi: Notifikasi WA terkirim ke ' + phone };
  }

  const url = 'https://api.fonnte.com/send';
  const options = {
    method: 'post',
    payload: {
      target: phone,
      message: message,
    },
    headers: {
      Authorization: token
    }
  };
  
  try {
    const response = UrlFetchApp.fetch(url, options);
    return { success: true, message: 'Notifikasi WA terkirim' };
  } catch (e) {
    return { success: false, message: 'Gagal mengirim WA: ' + e.toString() };
  }
}
