# Aplikasi Layanan BK (Bimbingan Konseling)

Aplikasi manajemen layanan BK berbasis web dengan backend Google Apps Script dan frontend HTML/JS yang siap di-deploy ke Vercel.

## Fitur Utama
- **Jenis Layanan:** Belajar, Sosial, Karier, Konseling Individu, dan Konseling Kelompok.
- **Manajemen Data:** Siswa, Guru, dan Wali Kelas.
- **Dashboard Admin:** Ringkasan data yang informatif.
- **Sistem Login:** Aman dengan kredensial admin.

## Kredensial Login
- **Username:** admin
- **Password:** Lajoroni234

## Petunjuk Instalasi & Deploy

### 1. Setup Backend (Google Apps Script)
1. Buat Google Spreadsheet baru.
2. Buka menu **Extensions** > **Apps Script**.
3. Copy isi dari file `backend/code.gs` ke editor Apps Script.
4. Ganti `YOUR_SPREADSHEET_ID_HERE` dengan ID Spreadsheet Anda (ada di URL spreadsheet).
5. Klik ikon simpan, lalu pilih fungsi `setup` di toolbar editor dan klik **Run**. Ini akan membuat semua tab sheet secara otomatis (Siswa, Guru, WaliKelas, LayananBK).
6. Klik **Deploy** > **New Deployment**.
7. Pilih type **Web App**.
8. Set "Who has access" ke **Anyone**.
9. Klik **Deploy** dan salin **Web App URL** yang muncul.

### 2. Setup Frontend
1. Buka file `frontend/js/script.js`.
2. Ganti `YOUR_GAS_WEB_APP_URL_HERE` dengan URL yang Anda dapatkan dari langkah sebelumnya.

### 3. Deploy ke Vercel
1. Pastikan Anda memiliki akun [Vercel](https://vercel.com/).
2. Install Vercel CLI atau hubungkan repository GitHub Anda ke Vercel.
3. Jalankan perintah `vercel` di root folder proyek ini, atau push ke GitHub dan import di dashboard Vercel.
4. Vercel akan secara otomatis mendeteksi konfigurasi di `vercel.json`.

## Struktur Folder
- `backend/`: Berisi logika Google Apps Script.
- `frontend/`: Berisi file antarmuka (HTML, CSS, JS).
- `assets/`: Tempat menyimpan gambar atau ikon pendukung.
- `vercel.json`: Konfigurasi deployment untuk Vercel.
