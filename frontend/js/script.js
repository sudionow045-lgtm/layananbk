// Configuration
const GAS_URL = 'YOUR_GAS_WEB_APP_URL_HERE'; // Ganti setelah deploy code.gs di Google Apps Script

// State Management
let currentSection = 'dashboard';
let currentLayananType = '';
let dataSiswa = [];
let dataLayanan = [];
let dataGuru = [];
let dataWali = [];
let dataDCM = [];
let dataPotensi = [];
let dataMinat = [];
let dataGayaBelajar = [];
let appSettings = {};

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    // Load settings first so we have the correct admin password and school name
    await refreshData();
    checkLogin();

    // Login Form
    document.getElementById('login-form').addEventListener('submit', handleLogin);

    // Form Siswa
    document.getElementById('form-siswa').addEventListener('submit', handleSaveSiswa);

    // Form Layanan
    document.getElementById('form-layanan').addEventListener('submit', handleSaveLayanan);

    // Form Guru
    document.getElementById('form-guru').addEventListener('submit', (e) => handleSaveGeneric(e, 'Guru', 'modalGuru', 'form-guru', ['Nama', 'NIP', 'Mata Pelajaran'], ['guru-nama', 'guru-nip', 'guru-mapel']));

    // Form Wali
    document.getElementById('form-wali').addEventListener('submit', (e) => handleSaveGeneric(e, 'WaliKelas', 'modalWali', 'form-wali', ['Nama', 'Kelas'], ['wali-nama', 'wali-kelas']));

    // Form Instrumen
    document.getElementById('form-dcm').addEventListener('submit', (e) => handleSaveGeneric(e, 'DCM', 'modalDCM', 'form-dcm', ['Tanggal', 'Siswa', 'Hasil/Keterangan'], ['dcm-tanggal', 'dcm-siswa', 'dcm-hasil']));
    document.getElementById('form-potensi').addEventListener('submit', (e) => handleSaveGeneric(e, 'Potensi', 'modalPotensi', 'form-potensi', ['Tanggal', 'Siswa', 'Potensi Diri'], ['potensi-tanggal', 'potensi-siswa', 'potensi-diri']));
    document.getElementById('form-minat').addEventListener('submit', (e) => handleSaveGeneric(e, 'MinatBakat', 'modalMinat', 'form-minat', ['Tanggal', 'Siswa', 'Minat', 'Bakat'], ['minat-tanggal', 'minat-siswa', 'minat-bidang', 'bakat-bidang']));
    document.getElementById('form-gaya-belajar').addEventListener('submit', (e) => handleSaveGeneric(e, 'GayaBelajar', 'modalGayaBelajar', 'form-gaya-belajar', ['Tanggal', 'Siswa', 'Tipe Gaya Belajar'], ['gaya-belajar-tanggal', 'gaya-belajar-siswa', 'gaya-belajar-tipe']));

    // Form Pengaturan
    document.getElementById('form-pengaturan').addEventListener('submit', handleSaveSettings);
});

function checkLogin() {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    if (isLoggedIn) {
        showApp();
    } else {
        showLogin();
    }
}

function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Pastikan appSettings tidak undefined
    const settings = appSettings || {};
    const adminPass = settings.AdminPass || 'Lajoroni234';

    if (username === 'admin' && password === adminPass) {
        sessionStorage.setItem('isLoggedIn', 'true');
        showApp();
    } else {
        alert('Login Gagal! Username: admin, Password default: Lajoroni234 (atau cek pengaturan)');
    }
}

function logout() {
    sessionStorage.removeItem('isLoggedIn');
    location.reload();
}

function showLogin() {
    document.getElementById('login-container').classList.remove('d-none');
    document.getElementById('app-container').classList.add('d-none');
}

function showApp() {
    document.getElementById('login-container').classList.add('d-none');
    document.getElementById('app-container').classList.remove('d-none');
    showSection('dashboard');
    refreshData();
}

function showSection(sectionId, type = '') {
    currentSection = sectionId;
    currentLayananType = type;

    // Hide all sections
    document.querySelectorAll('.content-section').forEach(sec => sec.classList.add('d-none'));

    // Show selected section
    const target = document.getElementById(sectionId);
    if (target) {
        target.classList.remove('d-none');
    }

    if (sectionId === 'layanan-bk') {
        document.getElementById('layanan-title').innerText = `Layanan BK: ${type}`;
        renderTableLayanan();
    } else if (sectionId === 'data-siswa') {
        renderTableSiswa();
    } else if (sectionId === 'data-guru') {
        renderTableGuru();
    } else if (sectionId === 'data-wali-kelas') {
        renderTableWali();
    } else if (sectionId === 'instrumen-dcm') {
        renderTableDCM();
    } else if (sectionId === 'instrumen-potensi') {
        renderTablePotensi();
    } else if (sectionId === 'instrumen-minat') {
        renderTableMinat();
    } else if (sectionId === 'instrumen-gaya-belajar') {
        renderTableGayaBelajar();
    } else if (sectionId === 'pengaturan') {
        loadSettingsToForm();
    } else if (sectionId === 'dashboard') {
        updateDashboardCounts();
    }
}

// API Calls
async function callAPI(action, payload) {
    if (GAS_URL === 'YOUR_GAS_WEB_APP_URL_HERE') {
        console.warn('GAS_URL belum dikonfigurasi. Menggunakan data lokal (mock).');
        return handleMockAPI(action, payload);
    }

    try {
        const response = await fetch(GAS_URL, {
            method: 'POST',
            body: JSON.stringify({ action, payload })
        });
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        alert('Gagal menghubungi server backend.');
        return { success: false };
    }
}

// Mock API for local testing
function handleMockAPI(action, payload) {
    // In-memory data for demo
    if (!window.mockDb) {
        window.mockDb = {
            Siswa: JSON.parse(localStorage.getItem('mockSiswa') || '[]'),
            LayananBK: JSON.parse(localStorage.getItem('mockLayanan') || '[]'),
            Guru: JSON.parse(localStorage.getItem('mockGuru') || '[]'),
            WaliKelas: JSON.parse(localStorage.getItem('mockWaliKelas') || '[]'),
            DCM: JSON.parse(localStorage.getItem('mockDCM') || '[]'),
            Potensi: JSON.parse(localStorage.getItem('mockPotensi') || '[]'),
            MinatBakat: JSON.parse(localStorage.getItem('mockMinatBakat') || '[]'),
            GayaBelajar: JSON.parse(localStorage.getItem('mockGayaBelajar') || '[]'),
            Settings: JSON.parse(localStorage.getItem('mockSettings') || '{"AdminPass": "Lajoroni234", "SchoolName": "Layanan BK Sekolah"}')
        };
    }

    switch (action) {
        case 'getData':
            return { success: true, data: window.mockDb[payload.sheetName] || [] };
        case 'getSettings':
            return { success: true, data: window.mockDb.Settings };
        case 'updateSettings':
            window.mockDb.Settings = { ...window.mockDb.Settings, ...payload.settings };
            localStorage.setItem('mockSettings', JSON.stringify(window.mockDb.Settings));
            return { success: true };
        case 'addData':
            const newData = { ...payload.rowData, ID: Date.now().toString() };
            if (!window.mockDb[payload.sheetName]) window.mockDb[payload.sheetName] = [];
            window.mockDb[payload.sheetName].push(newData);
            localStorage.setItem('mock' + payload.sheetName, JSON.stringify(window.mockDb[payload.sheetName]));
            return { success: true };
        case 'sendWA':
            alert(`MENSIMULASIKAN WA ke ${payload.phone}: ${payload.message}`);
            return { success: true };
        default:
            return { success: true, data: [] };
    }
}

async function refreshData() {
    const resSiswa = await callAPI('getData', { sheetName: 'Siswa' });
    if (resSiswa.success) {
        dataSiswa = resSiswa.data;
        updateSiswaSelect();
    }

    const resLayanan = await callAPI('getData', { sheetName: 'LayananBK' });
    if (resLayanan.success) {
        dataLayanan = resLayanan.data;
    }

    const resGuru = await callAPI('getData', { sheetName: 'Guru' });
    if (resGuru.success) {
        dataGuru = resGuru.data;
    }

    const resWali = await callAPI('getData', { sheetName: 'WaliKelas' });
    if (resWali.success) {
        dataWali = resWali.data;
    }

    const resDCM = await callAPI('getData', { sheetName: 'DCM' });
    if (resDCM.success) {
        dataDCM = resDCM.data;
    }

    const resPotensi = await callAPI('getData', { sheetName: 'Potensi' });
    if (resPotensi.success) {
        dataPotensi = resPotensi.data;
    }

    const resMinat = await callAPI('getData', { sheetName: 'MinatBakat' });
    if (resMinat.success) {
        dataMinat = resMinat.data;
    }

    const resGaya = await callAPI('getData', { sheetName: 'GayaBelajar' });
    if (resGaya.success) {
        dataGayaBelajar = resGaya.data;
    }

    const resSettings = await callAPI('getSettings', {});
    if (resSettings.success) {
        appSettings = resSettings.data;
        updateUIFromSettings();
    }

    updateDashboardCounts();
}

function updateUIFromSettings() {
    if (appSettings.SchoolName) {
        document.querySelector('.navbar-brand').innerHTML = `<i class="fas fa-graduation-cap me-2"></i>${appSettings.SchoolName}`;
    }
}

function loadSettingsToForm() {
    document.getElementById('setting-school-name').value = appSettings.SchoolName || '';
    document.getElementById('setting-academic-year').value = appSettings.AcademicYear || '';
    document.getElementById('setting-wa-token').value = appSettings.WAToken || '';
    document.getElementById('setting-admin-pass').value = ''; // Password always empty for security

    // Preview Kop Surat if exists
    if (appSettings.KopSurat) {
        const preview = document.getElementById('kop-preview-img');
        const container = document.getElementById('kop-preview-container');
        preview.src = appSettings.KopSurat;
        container.classList.remove('d-none');
    }
}

function previewKop(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const preview = document.getElementById('kop-preview-img');
            const container = document.getElementById('kop-preview-container');
            preview.src = e.target.result;
            container.classList.remove('d-none');
        }
        reader.readAsDataURL(input.files[0]);
    }
}

async function handleSaveSettings(e) {
    e.preventDefault();
    const newSettings = {
        SchoolName: document.getElementById('setting-school-name').value,
        AcademicYear: document.getElementById('setting-academic-year').value,
        WAToken: document.getElementById('setting-wa-token').value
    };

    // Handle Kop Surat Image
    const kopImg = document.getElementById('kop-preview-img').src;
    if (kopImg && kopImg.startsWith('data:image')) {
        newSettings.KopSurat = kopImg;
    }

    const newPass = document.getElementById('setting-admin-pass').value;
    if (newPass) {
        newSettings.AdminPass = newPass;
    }

    const res = await callAPI('updateSettings', { settings: newSettings });
    if (res.success) {
        alert('Pengaturan berhasil disimpan!');
        await refreshData();
    }
}

// UI Rendering
function renderTableSiswa() {
    const tbody = document.getElementById('table-siswa-body');
    tbody.innerHTML = '';
    dataSiswa.forEach(item => {
        tbody.innerHTML += `
            <tr>
                <td>${item.NISN || '-'}</td>
                <td>${item.Nama}</td>
                <td>${item['Tempat Lahir']}, ${item['Tanggal Lahir']}</td>
                <td>${item['Jenis Kelamin']}</td>
                <td>${item.Agama}</td>
                <td>${item['Nama Orang Tua']}</td>
                <td>${item.Kelas}</td>
                <td><span class="badge ${item.Status === 'Aktif' ? 'bg-success' : 'bg-secondary'}">${item.Status}</span></td>
                <td>
                    <button class="btn btn-sm btn-danger" onclick="deleteItem('Siswa', '${item.ID}')">Hapus</button>
                </td>
            </tr>
        `;
    });
}

function renderTableGuru() {
    const tbody = document.getElementById('table-guru-body');
    tbody.innerHTML = '';
    dataGuru.forEach(item => {
        tbody.innerHTML += `
            <tr>
                <td>${item.Nama}</td>
                <td>${item.NIP}</td>
                <td>${item['Mata Pelajaran']}</td>
                <td>
                    <button class="btn btn-sm btn-danger" onclick="deleteItem('Guru', '${item.ID}')">Hapus</button>
                </td>
            </tr>
        `;
    });
}

function renderTableWali() {
    const tbody = document.getElementById('table-wali-body');
    tbody.innerHTML = '';
    dataWali.forEach(item => {
        tbody.innerHTML += `
            <tr>
                <td>${item.Nama}</td>
                <td>${item.Kelas}</td>
                <td>
                    <button class="btn btn-sm btn-danger" onclick="deleteItem('WaliKelas', '${item.ID}')">Hapus</button>
                </td>
            </tr>
        `;
    });
}

function renderTableDCM() {
    const tbody = document.getElementById('table-dcm-body');
    tbody.innerHTML = '';
    dataDCM.forEach(item => {
        tbody.innerHTML += `
            <tr>
                <td>${item.Tanggal}</td>
                <td>${item.Siswa}</td>
                <td>${item['Hasil/Keterangan']}</td>
                <td>
                    <button class="btn btn-sm btn-danger" onclick="deleteItem('DCM', '${item.ID}')">Hapus</button>
                </td>
            </tr>
        `;
    });
}

function renderTablePotensi() {
    const tbody = document.getElementById('table-potensi-body');
    tbody.innerHTML = '';
    dataPotensi.forEach(item => {
        tbody.innerHTML += `
            <tr>
                <td>${item.Tanggal}</td>
                <td>${item.Siswa}</td>
                <td>${item['Potensi Diri']}</td>
                <td>
                    <button class="btn btn-sm btn-danger" onclick="deleteItem('Potensi', '${item.ID}')">Hapus</button>
                </td>
            </tr>
        `;
    });
}

function renderTableMinat() {
    const tbody = document.getElementById('table-minat-body');
    tbody.innerHTML = '';
    dataMinat.forEach(item => {
        tbody.innerHTML += `
            <tr>
                <td>${item.Tanggal}</td>
                <td>${item.Siswa}</td>
                <td>${item.Minat}</td>
                <td>${item.Bakat}</td>
                <td>
                    <button class="btn btn-sm btn-danger" onclick="deleteItem('MinatBakat', '${item.ID}')">Hapus</button>
                </td>
            </tr>
        `;
    });
}

function renderTableGayaBelajar() {
    const tbody = document.getElementById('table-gaya-belajar-body');
    tbody.innerHTML = '';
    dataGayaBelajar.forEach(item => {
        tbody.innerHTML += `
            <tr>
                <td>${item.Tanggal}</td>
                <td>${item.Siswa}</td>
                <td>${item['Tipe Gaya Belajar']}</td>
                <td>
                    <button class="btn btn-sm btn-danger" onclick="deleteItem('GayaBelajar', '${item.ID}')">Hapus</button>
                </td>
            </tr>
        `;
    });
}

function renderTableLayanan() {
    const tbody = document.getElementById('table-layanan-body');
    tbody.innerHTML = '';
    const filtered = currentLayananType === 'Semua' || currentLayananType === ''
        ? dataLayanan
        : dataLayanan.filter(item => item['Jenis Layanan'] === currentLayananType);

    filtered.forEach(item => {
        tbody.innerHTML += `
            <tr>
                <td>${item.Tanggal}</td>
                <td>${item.Siswa}</td>
                <td>${item['Jenis Layanan']}</td>
                <td>${item.Keterangan}</td>
                <td>
                    <button class="btn btn-sm btn-danger" onclick="deleteItem('LayananBK', '${item.ID}')">Hapus</button>
                </td>
            </tr>
        `;
    });
}

function updateDashboardCounts() {
    document.getElementById('count-siswa').innerText = dataSiswa.length;
    document.getElementById('count-layanan').innerText = dataLayanan.length;

    // Hitung per jenis layanan
    const countBelajar = dataLayanan.filter(item => item['Jenis Layanan'] === 'Bimbingan Belajar').length;
    const countSosial = dataLayanan.filter(item => item['Jenis Layanan'] === 'Bimbingan Sosial').length;
    const countKarier = dataLayanan.filter(item => item['Jenis Layanan'] === 'Bimbingan Karier').length;
    const countIndividu = dataLayanan.filter(item => item['Jenis Layanan'] === 'Konseling Individu').length;
    const countKelompok = dataLayanan.filter(item => item['Jenis Layanan'] === 'Konseling Kelompok').length;

    // Update UI
    if (document.getElementById('count-belajar')) document.getElementById('count-belajar').innerText = countBelajar;
    if (document.getElementById('count-sosial')) document.getElementById('count-sosial').innerText = countSosial;
    if (document.getElementById('count-karier')) document.getElementById('count-karier').innerText = countKarier;
    if (document.getElementById('count-individu')) document.getElementById('count-individu').innerText = countIndividu;
    if (document.getElementById('count-kelompok')) document.getElementById('count-kelompok').innerText = countKelompok;
}

function updateSiswaSelect() {
    const selects = document.querySelectorAll('.select-siswa, #layanan-siswa');
    selects.forEach(select => {
        const currentVal = select.value;
        select.innerHTML = '<option value="">Pilih Siswa...</option>';
        dataSiswa.forEach(s => {
            select.innerHTML += `<option value="${s.Nama}">${s.Nama} (${s.Kelas})</option>`;
        });
        select.value = currentVal;
    });
}

// Form Handlers
async function handleSaveSiswa(e) {
    e.preventDefault();
    const rowData = {
        NISN: document.getElementById('siswa-nisn').value,
        Nama: document.getElementById('siswa-nama').value,
        'Tempat Lahir': document.getElementById('siswa-tempat-lahir').value,
        'Tanggal Lahir': document.getElementById('siswa-tanggal-lahir').value,
        'Jenis Kelamin': document.getElementById('siswa-jk').value,
        Agama: document.getElementById('siswa-agama').value,
        'Nama Orang Tua': document.getElementById('siswa-ortu').value,
        Kelas: document.getElementById('siswa-kelas').value,
        Status: document.getElementById('siswa-status').value,
        'No WA Orang Tua': document.getElementById('siswa-wa').value
    };

    const res = await callAPI('addData', { sheetName: 'Siswa', rowData });
    if (res.success) {
        bootstrap.Modal.getInstance(document.getElementById('modalSiswa')).hide();
        document.getElementById('form-siswa').reset();
        await refreshData();
        renderTableSiswa();
    }
}

async function handleSaveLayanan(e) {
    e.preventDefault();
    const namaSiswa = document.getElementById('layanan-siswa').value;
    const keterangan = document.getElementById('layanan-keterangan').value;
    const tanggal = document.getElementById('layanan-tanggal').value;

    const rowData = {
        Tanggal: tanggal,
        Siswa: namaSiswa,
        'Jenis Layanan': currentLayananType,
        Keterangan: keterangan
    };

    const res = await callAPI('addData', { sheetName: 'LayananBK', rowData });
    if (res.success) {
        // WhatsApp Integration
        if (document.getElementById('send-wa-check').checked) {
            const siswa = dataSiswa.find(s => s.Nama === namaSiswa);
            if (siswa && siswa['No WA Orang Tua']) {
                const waMsg = `Halo Bapak/Ibu, menginfokan bahwa ananda ${namaSiswa} telah mengikuti layanan ${currentLayananType} pada tanggal ${tanggal}. Keterangan: ${keterangan}`;
                await callAPI('sendWA', { phone: siswa['No WA Orang Tua'], message: waMsg });
            }
        }

        bootstrap.Modal.getInstance(document.getElementById('modalLayanan')).hide();
        document.getElementById('form-layanan').reset();
        await refreshData();
        renderTableLayanan();
    }
}

async function deleteItem(sheetName, id) {
    if (confirm('Yakin ingin menghapus data ini?')) {
        const res = await callAPI('deleteData', { sheetName, id });
        if (res.success) {
            await refreshData();
            if (sheetName === 'Siswa') renderTableSiswa();
            else if (sheetName === 'Guru') renderTableGuru();
            else if (sheetName === 'WaliKelas') renderTableWali();
            else if (sheetName === 'DCM') renderTableDCM();
            else if (sheetName === 'Potensi') renderTablePotensi();
            else if (sheetName === 'MinatBakat') renderTableMinat();
            else if (sheetName === 'GayaBelajar') renderTableGayaBelajar();
            else renderTableLayanan();
        }
    }
}

// Generic Save Handler
async function handleSaveGeneric(e, sheetName, modalId, formId, fields, inputIds) {
    e.preventDefault();
    const rowData = {};
    fields.forEach((field, index) => {
        rowData[field] = document.getElementById(inputIds[index]).value;
    });

    const res = await callAPI('addData', { sheetName, rowData });
    if (res.success) {
        bootstrap.Modal.getInstance(document.getElementById(modalId)).hide();
        document.getElementById(formId).reset();
        await refreshData();
        if (sheetName === 'Guru') renderTableGuru();
        else if (sheetName === 'WaliKelas') renderTableWali();
        else if (sheetName === 'DCM') renderTableDCM();
        else if (sheetName === 'Potensi') renderTablePotensi();
        else if (sheetName === 'MinatBakat') renderTableMinat();
        else if (sheetName === 'GayaBelajar') renderTableGayaBelajar();
    }
}

// Modal Helpers
function openModalSiswa() {
    new bootstrap.Modal(document.getElementById('modalSiswa')).show();
}

function openModalLayanan() {
    new bootstrap.Modal(document.getElementById('modalLayanan')).show();
}

function openModalGuru() {
    new bootstrap.Modal(document.getElementById('modalGuru')).show();
}

function openModalWali() {
    new bootstrap.Modal(document.getElementById('modalWali')).show();
}

function openModalDCM() {
    new bootstrap.Modal(document.getElementById('modalDCM')).show();
}

function openModalPotensi() {
    new bootstrap.Modal(document.getElementById('modalPotensi')).show();
}

function openModalMinat() {
    new bootstrap.Modal(document.getElementById('modalMinat')).show();
}

function openModalGayaBelajar() {
    new bootstrap.Modal(document.getElementById('modalGayaBelajar')).show();
}
