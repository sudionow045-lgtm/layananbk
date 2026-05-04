// Configuration
const GAS_URL = 'YOUR_GAS_WEB_APP_URL_HERE'; // Ganti setelah deploy code.gs di Google Apps Script

// State Management
let currentSection = 'dashboard';
let currentLayananType = '';
let userRole = '';
let currentUser = null;
let dataSiswa = [];
let dataLayanan = [];
let dataGuru = [];
let dataWali = [];
let dataDCM = [];
let dataPotensi = [];
let dataMinat = [];
let dataGayaBelajar = [];
let dataJawaban = [];
let appSettings = {};

// Questions Definition
const INSTRUMEN_QUESTIONS = {
    DCM: [
        { id: 'dcm1', text: 'Saya sering merasa kurang sehat', category: 'Kesehatan' },
        { id: 'dcm2', text: 'Saya sering merasa pusing/sakit kepala', category: 'Kesehatan' },
        { id: 'dcm3', text: 'Saya kurang bersemangat dalam belajar', category: 'Belajar' },
        { id: 'dcm4', text: 'Saya sulit berkonsentrasi saat guru menjelaskan', category: 'Belajar' },
        { id: 'dcm5', text: 'Saya merasa kurang percaya diri di depan umum', category: 'Pribadi' },
        { id: 'dcm6', text: 'Saya sulit mengambil keputusan sendiri', category: 'Pribadi' },
        { id: 'dcm7', text: 'Saya sulit bergaul dengan teman sebaya', category: 'Sosial' },
        { id: 'dcm8', text: 'Saya merasa sering dikucilkan oleh teman', category: 'Sosial' }
    ],
    Potensi: [
        { id: 'pot1', text: 'Saya senang memimpin dalam kegiatan kelompok', category: 'Kepemimpinan' },
        { id: 'pot2', text: 'Saya mampu mempengaruhi orang lain untuk tujuan baik', category: 'Kepemimpinan' },
        { id: 'pot3', text: 'Saya senang memecahkan masalah matematika/logika', category: 'Intelektual' },
        { id: 'pot4', text: 'Saya cepat memahami materi baru yang bersifat teoritis', category: 'Intelektual' },
        { id: 'pot5', text: 'Saya senang menggambar atau membuat kerajinan tangan', category: 'Kreativitas' },
        { id: 'pot6', text: 'Saya sering memiliki ide-ide baru yang tidak terpikirkan orang lain', category: 'Kreativitas' }
    ],
    Minat: [
        { id: 'min1', text: 'Saya tertarik dengan pekerjaan di bidang teknologi', category: 'Teknologi' },
        { id: 'min2', text: 'Saya senang mencoba perangkat lunak atau gadget baru', category: 'Teknologi' },
        { id: 'min3', text: 'Saya senang membantu orang lain yang sedang kesulitan', category: 'Sosial' },
        { id: 'min4', text: 'Saya tertarik menjadi tenaga kesehatan atau pengajar', category: 'Sosial' },
        { id: 'min5', text: 'Saya senang tampil di atas panggung (menyanyi/akting)', category: 'Seni' },
        { id: 'min6', text: 'Saya tertarik dengan dunia desain atau musik', category: 'Seni' }
    ],
    Gaya: [
        { id: 'gay1', text: 'Saya lebih mudah ingat jika melihat gambar/diagram', category: 'Visual' },
        { id: 'gay2', text: 'Saya lebih suka membaca petunjuk tertulis daripada mendengarkan', category: 'Visual' },
        { id: 'gay3', text: 'Saya lebih mudah ingat jika mendengarkan penjelasan langsung', category: 'Auditori' },
        { id: 'gay4', text: 'Saya sering berbicara sendiri saat sedang belajar', category: 'Auditori' },
        { id: 'gay5', text: 'Saya tidak bisa diam saat sedang belajar (suka bergerak)', category: 'Kinestetik' },
        { id: 'gay6', text: 'Saya lebih mudah paham jika langsung mempraktikkan materi', category: 'Kinestetik' }
    ]
};

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    // Load settings first
    await refreshData();
    checkLogin();

    // Login Form
    document.getElementById('login-form').addEventListener('submit', handleLogin);

    // Form Siswa
    document.getElementById('form-siswa').addEventListener('submit', handleSaveSiswa);

    // Form Layanan
    document.getElementById('form-layanan').addEventListener('submit', handleSaveLayanan);

    // Form Generic
    document.getElementById('form-guru').addEventListener('submit', (e) => handleSaveGeneric(e, 'Guru', 'modalGuru', 'form-guru', ['Nama', 'NIP', 'Mata Pelajaran'], ['guru-nama', 'guru-nip', 'guru-mapel']));
    document.getElementById('form-wali').addEventListener('submit', (e) => handleSaveGeneric(e, 'WaliKelas', 'modalWali', 'form-wali', ['Nama', 'Kelas'], ['wali-nama', 'wali-kelas']));

    // Form Isi Instrumen
    document.getElementById('form-isi-instrumen').addEventListener('submit', handleSaveJawaban);

    // Form Pengaturan
    document.getElementById('form-pengaturan').addEventListener('submit', handleSaveSettings);
});

function toggleLoginFields() {
    const role = document.getElementById('login-role').value;
    const fieldUser = document.getElementById('field-username');
    const fieldNisn = document.getElementById('field-nisn');
    const inputUser = document.getElementById('username');
    const inputNisn = document.getElementById('login-nisn');

    if (role === 'admin') {
        fieldUser.classList.remove('d-none');
        fieldUser.style.display = 'block';
        fieldNisn.classList.add('d-none');
        fieldNisn.style.display = 'none';
        inputUser.required = true;
        inputNisn.required = false;
    } else {
        fieldUser.classList.add('d-none');
        fieldUser.style.display = 'none';
        fieldNisn.classList.remove('d-none');
        fieldNisn.style.display = 'block';
        inputUser.required = false;
        inputNisn.required = true;
    }
}

function checkLogin() {
    const role = sessionStorage.getItem('userRole');
    const userData = JSON.parse(sessionStorage.getItem('currentUser') || 'null');

    if (role && (role === 'admin' || userData)) {
        userRole = role;
        currentUser = userData;
        showApp();
    } else {
        showLogin();
    }
}

async function handleLogin(e) {
    e.preventDefault();
    const role = document.getElementById('login-role').value;
    const password = document.getElementById('password').value;

    if (role === 'admin') {
        const username = document.getElementById('username').value;
        const adminPass = appSettings.AdminPass || 'Lajoroni234';
        if (username === 'admin' && password === adminPass) {
            sessionStorage.setItem('userRole', 'admin');
            userRole = 'admin';
            showApp();
        } else {
            alert('Login Admin Gagal!');
        }
    } else {
        const nisn = document.getElementById('login-nisn').value;
        // Password siswa adalah NISN-nya sendiri atau password default jika ingin dikembangkan
        // Di sini kita cek data siswa yang ada
        const siswa = dataSiswa.find(s => s.NISN === nisn);
        if (siswa && password === nisn) {
            sessionStorage.setItem('userRole', 'siswa');
            sessionStorage.setItem('currentUser', JSON.stringify(siswa));
            userRole = 'siswa';
            currentUser = siswa;
            showApp();
        } else {
            alert('Login Siswa Gagal! Gunakan NISN sebagai Username dan Password.');
        }
    }
}

function logout() {
    sessionStorage.removeItem('userRole');
    sessionStorage.removeItem('currentUser');
    location.reload();
}

function showLogin() {
    document.getElementById('login-container').classList.remove('d-none');
    document.getElementById('app-container').classList.add('d-none');
    document.getElementById('admin-navbar').classList.add('d-none');
    document.getElementById('siswa-navbar').classList.add('d-none');
}

function showApp() {
    document.getElementById('login-container').classList.add('d-none');
    document.getElementById('app-container').classList.remove('d-none');

    if (userRole === 'admin') {
        document.getElementById('admin-navbar').classList.remove('d-none');
        document.getElementById('siswa-navbar').classList.add('d-none');
        showSection('dashboard');
    } else {
        document.getElementById('admin-navbar').classList.add('d-none');
        document.getElementById('siswa-navbar').classList.remove('d-none');
        document.getElementById('display-nama-siswa').innerText = currentUser.Nama;
        showSection('siswa-dashboard');
    }
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

    // Update active state in nav
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    // (Logic to set active class based on sectionId)

    if (userRole === 'admin') {
        if (sectionId === 'layanan-bk') {
            document.getElementById('layanan-title').innerText = `Layanan BK: ${type}`;
            renderTableLayanan();
        } else if (sectionId === 'data-siswa') renderTableSiswa();
        else if (sectionId === 'data-guru') renderTableGuru();
        else if (sectionId === 'data-wali-kelas') renderTableWali();
        else if (sectionId === 'pengaturan') loadSettingsToForm();
        else if (sectionId === 'dashboard') updateDashboardCounts();
        else if (sectionId === 'instrumen-dcm') renderTableInstrumen('DCM');
        else if (sectionId === 'instrumen-potensi') renderTableInstrumen('Potensi');
        else if (sectionId === 'instrumen-minat') renderTableInstrumen('Minat');
        else if (sectionId === 'instrumen-gaya-belajar') renderTableInstrumen('Gaya');
        else if (sectionId === 'analisis-instrumen') updateAnalisisFilters();

        // Update active nav link
        const navId = sectionId.startsWith('instrumen-') ? 'nav-instrumen' : `nav-${sectionId}`;
        // (Simple active state)
    } else {
        if (sectionId === 'siswa-dashboard') updateSiswaStatus();
        else if (sectionId === 'hasil-saya') renderHasilSaya();
    }
}

// Student Specific Functions
function updateSiswaStatus() {
    const myAnswers = dataJawaban.filter(j => j.NISN === currentUser.NISN);
    const instrumenTypes = ['DCM', 'Potensi', 'Minat', 'Gaya'];

    instrumenTypes.forEach(type => {
        const hasFilled = myAnswers.some(j => j.Instrumen === type);
        const el = document.getElementById(`status-${type.toLowerCase()}`);
        if (hasFilled) {
            el.innerText = 'Sudah Diisi';
            el.className = 'badge bg-success';
        } else {
            el.innerText = 'Belum Diisi';
            el.className = 'badge bg-secondary';
        }
    });
}

let currentFillingInstrumen = '';

function startInstrumen(type) {
    currentFillingInstrumen = type;
    document.getElementById('instrumen-form-container').classList.remove('d-none');
    document.getElementById('instrumen-form-title').innerText = `Isi Instrumen: ${type}`;

    const questions = INSTRUMEN_QUESTIONS[type];
    const container = document.getElementById('instrumen-questions-list');
    container.innerHTML = '';

    questions.forEach((q, index) => {
        container.innerHTML += `
            <div class="mb-4 p-3 border rounded bg-light">
                <p class="fw-bold mb-2">${index + 1}. ${q.text}</p>
                <div class="d-flex gap-4">
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="q-${q.id}" id="${q.id}-ya" value="Ya" required>
                        <label class="form-check-label" for="${q.id}-ya">Ya</label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="q-${q.id}" id="${q.id}-tidak" value="Tidak" required>
                        <label class="form-check-label" for="${q.id}-tidak">Tidak</label>
                    </div>
                </div>
            </div>
        `;
    });

    window.scrollTo(0, document.getElementById('instrumen-form-container').offsetTop);
}

function cancelInstrumen() {
    document.getElementById('instrumen-form-container').classList.add('d-none');
    currentFillingInstrumen = '';
}

async function handleSaveJawaban(e) {
    e.preventDefault();
    const questions = INSTRUMEN_QUESTIONS[currentFillingInstrumen];
    const jawaban = {};

    questions.forEach(q => {
        const val = document.querySelector(`input[name="q-${q.id}"]:checked`).value;
        jawaban[q.id] = val;
    });

    const payload = {
        NISN: currentUser.NISN,
        Nama: currentUser.Nama,
        Kelas: currentUser.Kelas,
        Instrumen: currentFillingInstrumen,
        Tanggal: new Date().toISOString().split('T')[0],
        Jawaban: JSON.stringify(jawaban)
    };

    const res = await callAPI('addData', { sheetName: 'JawabanInstrumen', rowData: payload });
    if (res.success) {
        alert('Jawaban Anda berhasil disimpan!');
        cancelInstrumen();
        await refreshData();
        showSection('siswa-dashboard');
    }
}

// Analytics Functions
function calculatePercentage(nisn, type) {
    const jawabanData = dataJawaban.find(j => j.NISN === nisn && j.Instrumen === type);
    if (!jawabanData) return null;

    const jawaban = JSON.parse(jawabanData.Jawaban);
    const questions = INSTRUMEN_QUESTIONS[type];
    const categories = [...new Set(questions.map(q => q.category))];

    const results = {};
    categories.forEach(cat => {
        const catQuestions = questions.filter(q => q.category === cat);
        const yesCount = catQuestions.filter(q => jawaban[q.id] === 'Ya').length;
        results[cat] = Math.round((yesCount / catQuestions.length) * 100);
    });

    return results;
}

function renderHasilSaya() {
    const container = document.getElementById('hasil-saya-content');
    container.innerHTML = '';

    const instrumenTypes = ['DCM', 'Potensi', 'Minat', 'Gaya'];
    instrumenTypes.forEach(type => {
        const results = calculatePercentage(currentUser.NISN, type);
        if (results) {
            const cardId = `chart-${type.toLowerCase()}`;
            container.innerHTML += `
                <div class="col-md-6 mb-4">
                    <div class="card shadow-sm h-100">
                        <div class="card-header bg-white"><strong>Hasil ${type}</strong></div>
                        <div class="card-body">
                            <canvas id="${cardId}"></canvas>
                            <div class="mt-3">
                                ${Object.entries(results).map(([cat, val]) => `
                                    <div class="d-flex justify-content-between mb-1">
                                        <span>${cat}</span>
                                        <span class="fw-bold">${val}%</span>
                                    </div>
                                    <div class="progress mb-2" style="height: 10px;">
                                        <div class="progress-bar" style="width: ${val}%"></div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            `;

            // Render Chart after adding to DOM
            setTimeout(() => {
                const ctx = document.getElementById(cardId).getContext('2d');
                new Chart(ctx, {
                    type: 'radar',
                    data: {
                        labels: Object.keys(results),
                        datasets: [{
                            label: 'Persentase (%)',
                            data: Object.values(results),
                            backgroundColor: 'rgba(54, 162, 235, 0.2)',
                            borderColor: 'rgb(54, 162, 235)',
                            pointBackgroundColor: 'rgb(54, 162, 235)',
                        }]
                    },
                    options: {
                        scales: { r: { suggestMin: 0, suggestMax: 100 } }
                    }
                });
            }, 100);
        }
    });

    if (container.innerHTML === '') {
        container.innerHTML = '<div class="col-12 text-center"><p>Anda belum mengisi instrumen apapun.</p></div>';
    }
}

// Admin Analysis Functions
function updateAnalisisFilters() {
    const level = document.getElementById('analisis-level').value;
    const filterSiswa = document.getElementById('filter-siswa-container');
    const filterKelas = document.getElementById('filter-kelas-container');

    if (level === 'individu') {
        filterSiswa.classList.remove('d-none');
        filterKelas.classList.add('d-none');
    } else {
        filterSiswa.classList.add('d-none');
        filterKelas.classList.remove('d-none');

        // Fill class filter
        const kelasList = [...new Set(dataSiswa.map(s => s.Kelas))];
        const selectKelas = document.getElementById('analisis-filter-kelas');
        selectKelas.innerHTML = '<option value="">Pilih Kelas...</option>';
        kelasList.forEach(k => { selectKelas.innerHTML += `<option value="${k}">${k}</option>`; });
    }

    document.getElementById('analisis-result-container').innerHTML = '';
}

function generateAnalisis() {
    const level = document.getElementById('analisis-level').value;
    const container = document.getElementById('analisis-result-container');
    container.innerHTML = '';

    if (level === 'individu') {
        const nisn = dataSiswa.find(s => s.Nama === document.getElementById('analisis-filter-siswa').value)?.NISN;
        if (!nisn) return;

        // Use same rendering logic as student but for selected student
        const instrumenTypes = ['DCM', 'Potensi', 'Minat', 'Gaya'];
        let html = '<div class="row">';
        instrumenTypes.forEach(type => {
            const results = calculatePercentage(nisn, type);
            if (results) {
                const cardId = `admin-chart-${type.toLowerCase()}`;
                html += `
                    <div class="col-md-6 mb-4">
                        <div class="card shadow-sm h-100">
                            <div class="card-header bg-white"><strong>Hasil ${type}</strong></div>
                            <div class="card-body">
                                <canvas id="${cardId}"></canvas>
                            </div>
                        </div>
                    </div>
                `;
                setTimeout(() => {
                    const ctx = document.getElementById(cardId).getContext('2d');
                    new Chart(ctx, {
                        type: 'bar',
                        data: {
                            labels: Object.keys(results),
                            datasets: [{
                                label: 'Persentase (%)',
                                data: Object.values(results),
                                backgroundColor: 'rgba(75, 192, 192, 0.6)'
                            }]
                        },
                        options: { scales: { y: { beginAtZero: true, max: 100 } } }
                    });
                }, 100);
            }
        });
        html += '</div>';
        container.innerHTML = html;

    } else if (level === 'kelas' || level === 'kelompok') {
        const selectedKelas = document.getElementById('analisis-filter-kelas').value;
        if (!selectedKelas) return;

        const siswaInKelas = dataSiswa.filter(s => s.Kelas === selectedKelas);
        const nisns = siswaInKelas.map(s => s.NISN);
        const instrumenTypes = ['DCM', 'Potensi', 'Minat', 'Gaya'];

        let html = `<h4>Analisis Kelas: ${selectedKelas}</h4><div class="row">`;

        instrumenTypes.forEach(type => {
            // Aggregate results for class
            const allResults = nisns.map(nisn => calculatePercentage(nisn, type)).filter(r => r !== null);
            if (allResults.length > 0) {
                const questions = INSTRUMEN_QUESTIONS[type];
                const categories = [...new Set(questions.map(q => q.category))];
                const classAvg = {};

                categories.forEach(cat => {
                    const sum = allResults.reduce((acc, curr) => acc + (curr[cat] || 0), 0);
                    classAvg[cat] = Math.round(sum / allResults.length);
                });

                const cardId = `class-chart-${type.toLowerCase()}`;
                html += `
                    <div class="col-md-6 mb-4">
                        <div class="card shadow-sm h-100">
                            <div class="card-header bg-white"><strong>Rata-rata Kelas - ${type}</strong></div>
                            <div class="card-body">
                                <canvas id="${cardId}"></canvas>
                            </div>
                        </div>
                    </div>
                `;
                setTimeout(() => {
                    const ctx = document.getElementById(cardId).getContext('2d');
                    new Chart(ctx, {
                        type: 'polarArea',
                        data: {
                            labels: Object.keys(classAvg),
                            datasets: [{
                                label: 'Rata-rata Kelas (%)',
                                data: Object.values(classAvg),
                                backgroundColor: [
                                    'rgba(255, 99, 132, 0.5)',
                                    'rgba(54, 162, 235, 0.5)',
                                    'rgba(255, 206, 86, 0.5)',
                                    'rgba(75, 192, 192, 0.5)',
                                    'rgba(153, 102, 255, 0.5)'
                                ]
                            }]
                        }
                    });
                }, 100);
            }
        });
        html += '</div>';
        container.innerHTML = html;
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
            JawabanInstrumen: JSON.parse(localStorage.getItem('mockJawabanInstrumen') || '[]'),
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

    const resJawaban = await callAPI('getData', { sheetName: 'JawabanInstrumen' });
    if (resJawaban.success) {
        dataJawaban = resJawaban.data;
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

function renderTableInstrumen(type) {
    let tbodyId = '';
    let data = [];
    let sheetName = '';

    if (type === 'DCM') { tbodyId = 'table-dcm-body'; data = dataDCM; sheetName = 'DCM'; }
    else if (type === 'Potensi') { tbodyId = 'table-potensi-body'; data = dataPotensi; sheetName = 'Potensi'; }
    else if (type === 'Minat') { tbodyId = 'table-minat-body'; data = dataMinat; sheetName = 'MinatBakat'; }
    else if (type === 'Gaya') { tbodyId = 'table-gaya-belajar-body'; data = dataGayaBelajar; sheetName = 'GayaBelajar'; }

    const tbody = document.getElementById(tbodyId);
    if (!tbody) return;
    tbody.innerHTML = '';

    data.forEach(item => {
        let content = '';
        if (type === 'DCM') content = `<td>${item['Hasil/Keterangan']}</td>`;
        else if (type === 'Potensi') content = `<td>${item['Potensi Diri']}</td>`;
        else if (type === 'Minat') content = `<td>${item.Minat}</td><td>${item.Bakat}</td>`;
        else if (type === 'Gaya') content = `<td>${item['Tipe Gaya Belajar']}</td>`;

        tbody.innerHTML += `
            <tr>
                <td>${item.Tanggal}</td>
                <td>${item.Siswa}</td>
                ${content}
                <td>
                    <button class="btn btn-sm btn-danger" onclick="deleteItem('${sheetName}', '${item.ID}')">Hapus</button>
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
