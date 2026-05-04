// Configuration
const GAS_URL = 'YOUR_GAS_WEB_APP_URL_HERE'; // Ganti setelah deploy code.gs di Google Apps Script

// State Management
let currentSection = 'dashboard';
let currentLayananType = '';
let dataSiswa = [];
let dataLayanan = [];
let dataGuru = [];
let dataWali = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
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

    // Untuk demo/lokal jika GAS_URL belum ada, kita bypass dengan kredensial yang diminta user
    if (username === 'admin' && password === 'Lajoroni234') {
        sessionStorage.setItem('isLoggedIn', 'true');
        showApp();
    } else {
        alert('Login Gagal! Cek username dan password.');
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
            LayananBK: JSON.parse(localStorage.getItem('mockLayanan') || '[]')
        };
    }

    switch (action) {
        case 'getData':
            return { success: true, data: window.mockDb[payload.sheetName] };
        case 'addData':
            const newData = { ...payload.rowData, ID: Date.now().toString() };
            window.mockDb[payload.sheetName].push(newData);
            localStorage.setItem('mock' + payload.sheetName, JSON.stringify(window.mockDb[payload.sheetName]));
            return { success: true };
        case 'sendWA':
            alert(`MENSIMULASIKAN WA ke ${payload.phone}: ${payload.message}`);
            return { success: true };
        default:
            return { success: true };
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

    updateDashboardCounts();
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

function renderTableLayanan() {
    const tbody = document.getElementById('table-layanan-body');
    tbody.innerHTML = '';
    const filtered = dataLayanan.filter(item => item['Jenis Layanan'] === currentLayananType);
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
}

function updateSiswaSelect() {
    const select = document.getElementById('layanan-siswa');
    select.innerHTML = '<option value="">Pilih Siswa...</option>';
    dataSiswa.forEach(s => {
        select.innerHTML += `<option value="${s.Nama}">${s.Nama} (${s.Kelas})</option>`;
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
        if (sheetName === 'WaliKelas') renderTableWali();
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
