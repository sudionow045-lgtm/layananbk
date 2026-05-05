// Configuration
const GAS_URL = 'https://script.google.com/macros/s/AKfycbxiRz0jik-wiHLi4umC68tYHBZSsAI4xJVXHMnUdmhxdCNkTjyHvzSBtPN7irs29wfQaw/exec';

// State Management
let currentSection = 'dashboard', currentLayananType = '', userRole = '', currentUser = null, appSettings = {}, isRefreshing = false;
let dataSiswa = [], dataLayanan = [], dataGuru = [], dataWali = [], dataDCM = [], dataPotensi = [], dataMinat = [], dataGayaBelajar = [], dataJawaban = [], dataPertanyaan = [];

// Questions Definition
const DEFAULT_QUESTIONS = {
    DCM: [
        // A. KESEHATAN
        { id: 'dcm-a1', text: 'Sering merasa lelah atau kurang bersemangat.', category: 'A. KESEHATAN' },
        { id: 'dcm-a2', text: 'Sering sakit kepala atau pusing.', category: 'A. KESEHATAN' },
        { id: 'dcm-a3', text: 'Penglihatan kurang jelas (mata minus/plus).', category: 'A. KESEHATAN' },
        { id: 'dcm-a4', text: 'Pendengaran kurang tajam.', category: 'A. KESEHATAN' },
        { id: 'dcm-a5', text: 'Sering menderita penyakit influenza/pilek.', category: 'A. KESEHATAN' },
        { id: 'dcm-a6', text: 'Sering sakit gigi atau gusi.', category: 'A. KESEHATAN' },
        { id: 'dcm-a7', text: 'Nafsu makan berkurang atau tidak teratur.', category: 'A. KESEHATAN' },
        { id: 'dcm-a8', text: 'Sering merasa mual atau sakit perut.', category: 'A. KESEHATAN' },
        { id: 'dcm-a9', text: 'Berat badan tidak stabil (terlalu kurus/gemuk).', category: 'A. KESEHATAN' },
        { id: 'dcm-a10', text: 'Sering merasa sesak napas.', category: 'A. KESEHATAN' },
        { id: 'dcm-a11', text: 'Sering merasa jantung berdebar-debar.', category: 'A. KESEHATAN' },
        { id: 'dcm-a12', text: 'Sering merasa gugup atau gemetar.', category: 'A. KESEHATAN' },
        { id: 'dcm-a13', text: 'Sering sulit tidur di malam hari.', category: 'A. KESEHATAN' },
        { id: 'dcm-a14', text: 'Sering merasa mengantuk di siang hari.', category: 'A. KESEHATAN' },
        { id: 'dcm-a15', text: 'Sering merasa gatal-gatal pada kulit.', category: 'A. KESEHATAN' },
        { id: 'dcm-a16', text: 'Sering mengalami gangguan pencernaan.', category: 'A. KESEHATAN' },
        { id: 'dcm-a17', text: 'Sering merasa lemas atau tidak bertenaga.', category: 'A. KESEHATAN' },
        { id: 'dcm-a18', text: 'Memiliki penyakit kronis yang mengganggu.', category: 'A. KESEHATAN' },
        { id: 'dcm-a19', text: 'Sering merasa haus atau lapar berlebihan.', category: 'A. KESEHATAN' },
        { id: 'dcm-a20', text: 'Kurang berolahraga secara teratur.', category: 'A. KESEHATAN' },

        // B. KEADAAN KEHIDUPAN EKONOMI
        { id: 'dcm-b1', text: 'Uang saku harian kurang mencukupi kebutuhan.', category: 'B. KEADAAN KEHIDUPAN EKONOMI' },
        { id: 'dcm-b2', text: 'Kesulitan membeli buku-buku pelajaran.', category: 'B. KEADAAN KEHIDUPAN EKONOMI' },
        { id: 'dcm-b3', text: 'Ingin bekerja untuk menambah penghasilan sendiri.', category: 'B. KEADAAN KEHIDUPAN EKONOMI' },
        { id: 'dcm-b4', text: 'Sering terlambat membayar iuran atau sumbangan sekolah.', category: 'B. KEADAAN KEHIDUPAN EKONOMI' },
        { id: 'dcm-b5', text: 'Merasa rendah diri karena keadaan ekonomi keluarga.', category: 'B. KEADAAN KEHIDUPAN EKONOMI' },
        { id: 'dcm-b6', text: 'Khawatir tentang masa depan pendidikan karena biaya.', category: 'B. KEADAAN KEHIDUPAN EKONOMI' },
        { id: 'dcm-b7', text: 'Fasilitas belajar di rumah sangat terbatas.', category: 'B. KEADAAN KEHIDUPAN EKONOMI' },
        { id: 'dcm-b8', text: 'Tidak memiliki pakaian seragam yang lengkap/layak.', category: 'B. KEADAAN KEHIDUPAN EKONOMI' },
        { id: 'dcm-b9', text: 'Ingin membantu orang tua mencari nafkah.', category: 'B. KEADAAN KEHIDUPAN EKONOMI' },
        { id: 'dcm-b10', text: 'Merasa iri dengan kemewahan yang dimiliki teman.', category: 'B. KEADAAN KEHIDUPAN EKONOMI' },
        { id: 'dcm-b11', text: 'Sering tidak sarapan karena tidak ada biaya.', category: 'B. KEADAAN KEHIDUPAN EKONOMI' },
        { id: 'dcm-b12', text: 'Kondisi rumah tempat tinggal kurang memadai.', category: 'B. KEADAAN KEHIDUPAN EKONOMI' },
        { id: 'dcm-b13', text: 'Biaya transportasi ke sekolah terasa berat.', category: 'B. KEADAAN KEHIDUPAN EKONOMI' },
        { id: 'dcm-b14', text: 'Tidak mampu mengikuti kegiatan sekolah yang berbayar.', category: 'B. KEADAAN KEHIDUPAN EKONOMI' },
        { id: 'dcm-b15', text: 'Orang tua sering mengeluhkan masalah keuangan.', category: 'B. KEADAAN KEHIDUPAN EKONOMI' },
        { id: 'dcm-b16', text: 'Memiliki tanggungan utang yang membebani.', category: 'B. KEADAAN KEHIDUPAN EKONOMI' },
        { id: 'dcm-b17', text: 'Sering merasa malu dengan kondisi ekonomi keluarga.', category: 'B. KEADAAN KEHIDUPAN EKONOMI' },
        { id: 'dcm-b18', text: 'Tidak memiliki tabungan untuk keperluan mendadak.', category: 'B. KEADAAN KEHIDUPAN EKONOMI' },
        { id: 'dcm-b19', text: 'Sering merasa tertekan karena tuntutan ekonomi.', category: 'B. KEADAAN KEHIDUPAN EKONOMI' },
        { id: 'dcm-b20', text: 'Orang tua tidak memiliki pekerjaan atau penghasilan tetap.', category: 'B. KEADAAN KEHIDUPAN EKONOMI' },

        // C. REKREASI / HOBI DENGAN WAKTU LUANG
        { id: 'dcm-c1', text: 'Hampir tidak mempunyai waktu untuk bermain/rekreasi.', category: 'C. REKREASI / HOBI DENGAN WAKTU LUANG' },
        { id: 'dcm-c2', text: 'Waktu luang habis untuk bekerja membantu orang tua.', category: 'C. REKREASI / HOBI DENGAN WAKTU LUANG' },
        { id: 'dcm-c3', text: 'Tidak tahu bagaimana cara mengisi waktu luang.', category: 'C. REKREASI / HOBI DENGAN WAKTU LUANG' },
        { id: 'dcm-c4', text: 'Tidak memiliki hobi atau kegemaran tertentu.', category: 'C. REKREASI / HOBI DENGAN WAKTU LUANG' },
        { id: 'dcm-c5', text: 'Ingin menyalurkan hobi tetapi tidak ada biaya.', category: 'C. REKREASI / HOBI DENGAN WAKTU LUANG' },
        { id: 'dcm-c6', text: 'Kurang mendapat kesempatan untuk berekreasi.', category: 'C. REKREASI / HOBI DENGAN WAKTU LUANG' },
        { id: 'dcm-c7', text: 'Waktu luang sering terbuang sia-sia tanpa kegiatan.', category: 'C. REKREASI / HOBI DENGAN WAKTU LUANG' },
        { id: 'dcm-c8', text: 'Terlalu banyak waktu digunakan untuk menonton TV/HP.', category: 'C. REKREASI / HOBI DENGAN WAKTU LUANG' },
        { id: 'dcm-c9', text: 'Merasa bosan dengan kegiatan sehari-hari yang monoton.', category: 'C. REKREASI / HOBI DENGAN WAKTU LUANG' },
        { id: 'dcm-c10', text: 'Ingin mengikuti kegiatan ekstrakurikuler tetapi dilarang.', category: 'C. REKREASI / HOBI DENGAN WAKTU LUANG' },
        { id: 'dcm-c11', text: 'Tidak ada fasilitas rekreasi di lingkungan tempat tinggal.', category: 'C. REKREASI / HOBI DENGAN WAKTU LUANG' },
        { id: 'dcm-c12', text: 'Sering merasa jenuh dengan tugas-tugas sekolah.', category: 'C. REKREASI / HOBI DENGAN WAKTU LUANG' },
        { id: 'dcm-c13', text: 'Kurang berani mencoba hal-hal baru yang positif.', category: 'C. REKREASI / HOBI DENGAN WAKTU LUANG' },
        { id: 'dcm-c14', text: 'Waktu istirahat sering terganggu oleh kegiatan lain.', category: 'C. REKREASI / HOBI DENGAN WAKTU LUANG' },
        { id: 'dcm-c15', text: 'Ingin berlibur tetapi tidak pernah ada kesempatan.', category: 'C. REKREASI / HOBI DENGAN WAKTU LUANG' },
        { id: 'dcm-c16', text: 'Merasa tidak bebas melakukan hobi yang disukai.', category: 'C. REKREASI / HOBI DENGAN WAKTU LUANG' },
        { id: 'dcm-c17', text: 'Tidak memiliki teman untuk menyalurkan hobi bersama.', category: 'C. REKREASI / HOBI DENGAN WAKTU LUANG' },
        { id: 'dcm-c18', text: 'Sering merasa malas untuk melakukan kegiatan bermanfaat.', category: 'C. REKREASI / HOBI DENGAN WAKTU LUANG' },
        { id: 'dcm-c19', text: 'Waktu luang habis untuk membantu pekerjaan rumah.', category: 'C. REKREASI / HOBI DENGAN WAKTU LUANG' },
        { id: 'dcm-c20', text: 'Merasa kurang mendapat hiburan yang mendidik.', category: 'C. REKREASI / HOBI DENGAN WAKTU LUANG' },

        // D. KEHIDUPAN SOSIAL KEAKTIFAN BERORGANISASI
        { id: 'dcm-d1', text: 'Sulit bergaul atau memulai percakapan dengan orang baru.', category: 'D. KEHIDUPAN SOSIAL KEAKTIFAN BERORGANISASI' },
        { id: 'dcm-d2', text: 'Sering merasa malu atau canggung di depan umum.', category: 'D. KEHIDUPAN SOSIAL KEAKTIFAN BERORGANISASI' },
        { id: 'dcm-d3', text: 'Merasa sulit menyesuaikan diri dalam kelompok.', category: 'D. KEHIDUPAN SOSIAL KEAKTIFAN BERORGANISASI' },
        { id: 'dcm-d4', text: 'Jarang dilibatkan dalam kegiatan kelompok oleh teman.', category: 'D. KEHIDUPAN SOSIAL KEAKTIFAN BERORGANISASI' },
        { id: 'dcm-d5', text: 'Sering merasa dikucilkan atau tidak disukai teman.', category: 'D. KEHIDUPAN SOSIAL KEAKTIFAN BERORGANISASI' },
        { id: 'dcm-d6', text: 'Takut mengemukakan pendapat di depan orang banyak.', category: 'D. KEHIDUPAN SOSIAL KEAKTIFAN BERORGANISASI' },
        { id: 'dcm-d7', text: 'Sulit bekerja sama dalam sebuah tim atau organisasi.', category: 'D. KEHIDUPAN SOSIAL KEAKTIFAN BERORGANISASI' },
        { id: 'dcm-d8', text: 'Tidak tertarik mengikuti kegiatan organisasi di sekolah.', category: 'D. KEHIDUPAN SOSIAL KEAKTIFAN BERORGANISASI' },
        { id: 'dcm-d9', text: 'Merasa tidak memiliki kemampuan untuk memimpin.', category: 'D. KEHIDUPAN SOSIAL KEAKTIFAN BERORGANISASI' },
        { id: 'dcm-d10', text: 'Sering terjadi kesalahpahaman dengan teman sebaya.', category: 'D. KEHIDUPAN SOSIAL KEAKTIFAN BERORGANISASI' },
        { id: 'dcm-d11', text: 'Merasa minder dalam pergaulan sosial di sekolah.', category: 'D. KEHIDUPAN SOSIAL KEAKTIFAN BERORGANISASI' },
        { id: 'dcm-d12', text: 'Sulit mempercayai orang lain atau teman dekat.', category: 'D. KEHIDUPAN SOSIAL KEAKTIFAN BERORGANISASI' },
        { id: 'dcm-d13', text: 'Sering merasa sepi meskipun berada di tengah keramaian.', category: 'D. KEHIDUPAN SOSIAL KEAKTIFAN BERORGANISASI' },
        { id: 'dcm-d14', text: 'Merasa tertekan oleh aturan-aturan dalam kelompok.', category: 'D. KEHIDUPAN SOSIAL KEAKTIFAN BERORGANISASI' },
        { id: 'dcm-d15', text: 'Tidak berani menolak ajakan teman yang kurang baik.', category: 'D. KEHIDUPAN SOSIAL KEAKTIFAN BERORGANISASI' },
        { id: 'dcm-d16', text: 'Sering merasa ragu untuk meminta bantuan orang lain.', category: 'D. KEHIDUPAN SOSIAL KEAKTIFAN BERORGANISASI' },
        { id: 'dcm-d17', text: 'Merasa kurang dihargai oleh teman-teman sekelas.', category: 'D. KEHIDUPAN SOSIAL KEAKTIFAN BERORGANISASI' },
        { id: 'dcm-d18', text: 'Sulit mengendalikan emosi saat berinteraksi sosial.', category: 'D. KEHIDUPAN SOSIAL KEAKTIFAN BERORGANISASI' },
        { id: 'dcm-d19', text: 'Merasa tidak punya teman akrab tempat berkeluh kesah.', category: 'D. KEHIDUPAN SOSIAL KEAKTIFAN BERORGANISASI' },
        { id: 'dcm-d20', text: 'Terlalu pemalu untuk ikut serta dalam kegiatan bersama.', category: 'D. KEHIDUPAN SOSIAL KEAKTIFAN BERORGANISASI' },

        // E. HUBUNGAN PRIBADI
        { id: 'dcm-e1', text: 'Sering merasa rendah diri atau kurang percaya diri.', category: 'E. HUBUNGAN PRIBADI' },
        { id: 'dcm-e2', text: 'Sulit mengambil keputusan untuk diri sendiri.', category: 'E. HUBUNGAN PRIBADI' },
        { id: 'dcm-e3', text: 'Sering merasa sedih tanpa alasan yang jelas.', category: 'E. HUBUNGAN PRIBADI' },
        { id: 'dcm-e4', text: 'Merasa putus asa dalam menghadapi masalah hidup.', category: 'E. HUBUNGAN PRIBADI' },
        { id: 'dcm-e5', text: 'Sering merasa cemas atau khawatir berlebihan.', category: 'E. HUBUNGAN PRIBADI' },
        { id: 'dcm-e6', text: 'Sulit mengendalikan amarah atau emosi yang meledak.', category: 'E. HUBUNGAN PRIBADI' },
        { id: 'dcm-e7', text: 'Merasa tidak memiliki kelebihan atau bakat apa pun.', category: 'E. HUBUNGAN PRIBADI' },
        { id: 'dcm-e8', text: 'Sering menyalahkan diri sendiri atas kegagalan.', category: 'E. HUBUNGAN PRIBADI' },
        { id: 'dcm-e9', text: 'Merasa hidup ini tidak adil bagi diri saya.', category: 'E. HUBUNGAN PRIBADI' },
        { id: 'dcm-e10', text: 'Sulit untuk jujur pada diri sendiri tentang perasaan.', category: 'E. HUBUNGAN PRIBADI' },
        { id: 'dcm-e11', text: 'Sering merasa bingung dengan tujuan hidup saya.', category: 'E. HUBUNGAN PRIBADI' },
        { id: 'dcm-e12', text: 'Merasa tidak ada orang yang benar-benar memahami saya.', category: 'E. HUBUNGAN PRIBADI' },
        { id: 'dcm-e13', text: 'Sering melamun atau berkhayal tentang hal yang mustahil.', category: 'E. HUBUNGAN PRIBADI' },
        { id: 'dcm-e14', text: 'Merasa takut menghadapi masa depan yang belum pasti.', category: 'E. HUBUNGAN PRIBADI' },
        { id: 'dcm-e15', text: 'Sulit untuk memaafkan kesalahan diri sendiri di masa lalu.', category: 'E. HUBUNGAN PRIBADI' },
        { id: 'dcm-e16', text: 'Merasa tidak puas dengan penampilan fisik saya.', category: 'E. HUBUNGAN PRIBADI' },
        { id: 'dcm-e17', text: 'Sering merasa kesepian dan ingin menarik diri.', category: 'E. HUBUNGAN PRIBADI' },
        { id: 'dcm-e18', text: 'Merasa terbebani oleh harapan orang lain pada saya.', category: 'E. HUBUNGAN PRIBADI' },
        { id: 'dcm-e19', text: 'Sulit untuk tetap konsisten dengan prinsip sendiri.', category: 'E. HUBUNGAN PRIBADI' },
        { id: 'dcm-e20', text: 'Merasa tidak sanggup menghadapi tekanan hidup.', category: 'E. HUBUNGAN PRIBADI' },

        // F. MUDA-MUDI
        { id: 'dcm-f1', text: 'Sering merasa malu jika berhadapan dengan lawan jenis.', category: 'F. MUDA-MUDI' },
        { id: 'dcm-f2', text: 'Merasa bingung bagaimana bersikap di depan lawan jenis.', category: 'F. MUDA-MUDI' },
        { id: 'dcm-f3', text: 'Ingin memiliki pacar tetapi merasa tidak ada yang suka.', category: 'F. MUDA-MUDI' },
        { id: 'dcm-f4', text: 'Sering patah hati atau kecewa dalam urusan asmara.', category: 'F. MUDA-MUDI' },
        { id: 'dcm-f5', text: 'Merasa terganggu oleh godaan dari lawan jenis.', category: 'F. MUDA-MUDI' },
        { id: 'dcm-f6', text: 'Bingung membedakan antara rasa suka dan cinta sejati.', category: 'F. MUDA-MUDI' },
        { id: 'dcm-f7', text: 'Sering merasa cemburu yang berlebihan pada seseorang.', category: 'F. MUDA-MUDI' },
        { id: 'dcm-f8', text: 'Takut mengungkapkan perasaan pada orang yang disukai.', category: 'F. MUDA-MUDI' },
        { id: 'dcm-f9', text: 'Merasa tertekan oleh pergaulan bebas di lingkungan.', category: 'F. MUDA-MUDI' },
        { id: 'dcm-f10', text: 'Sering memikirkan masalah pacaran hingga lupa belajar.', category: 'F. MUDA-MUDI' },
        { id: 'dcm-f11', text: 'Orang tua melarang berhubungan dengan lawan jenis.', category: 'F. MUDA-MUDI' },
        { id: 'dcm-f12', text: 'Sering merasa minder dibandingkan teman yang populer.', category: 'F. MUDA-MUDI' },
        { id: 'dcm-f13', text: 'Merasa tidak tahu etika pergaulan yang benar.', category: 'F. MUDA-MUDI' },
        { id: 'dcm-f14', text: 'Khawatir dengan perubahan fisik di masa remaja ini.', category: 'F. MUDA-MUDI' },
        { id: 'dcm-f15', text: 'Sering merasa bimbang dalam memilih teman dekat.', category: 'F. MUDA-MUDI' },
        { id: 'dcm-f16', text: 'Merasa terbebani oleh standar kecantikan/ketampanan.', category: 'F. MUDA-MUDI' },
        { id: 'dcm-f17', text: 'Sering merasa iri melihat teman yang sudah berpasangan.', category: 'F. MUDA-MUDI' },
        { id: 'dcm-f18', text: 'Sulit mengendalikan keinginan untuk selalu diperhatikan.', category: 'F. MUDA-MUDI' },
        { id: 'dcm-f19', text: 'Merasa tidak nyaman dengan pembicaraan seputar seks.', category: 'F. MUDA-MUDI' },
        { id: 'dcm-f20', text: 'Bingung menghadapi tuntutan pergaulan remaja masa kini.', category: 'F. MUDA-MUDI' },

        // G. KEHIDUPAN KELUARGA
        { id: 'dcm-g1', text: 'Hubungan dengan orang tua kurang harmonis/sering cekcok.', category: 'G. KEHIDUPAN KELUARGA' },
        { id: 'dcm-g2', text: 'Orang tua terlalu mengekang kebebasan saya.', category: 'G. KEHIDUPAN KELUARGA' },
        { id: 'dcm-g3', text: 'Sering merasa kurang perhatian dan kasih sayang di rumah.', category: 'G. KEHIDUPAN KELUARGA' },
        { id: 'dcm-g4', text: 'Orang tua sering bertengkar di depan anak-anak.', category: 'G. KEHIDUPAN KELUARGA' },
        { id: 'dcm-g5', text: 'Merasa dibeda-bedakan dengan saudara kandung lainnya.', category: 'G. KEHIDUPAN KELUARGA' },
        { id: 'dcm-g6', text: 'Keadaan rumah tangga yang berantakan (broken home).', category: 'G. KEHIDUPAN KELUARGA' },
        { id: 'dcm-g7', text: 'Orang tua terlalu sibuk sehingga jarang ada waktu bersama.', category: 'G. KEHIDUPAN KELUARGA' },
        { id: 'dcm-g8', text: 'Merasa tertekan oleh tuntutan orang tua yang terlalu tinggi.', category: 'G. KEHIDUPAN KELUARGA' },
        { id: 'dcm-g9', text: 'Sering merasa takut atau tidak nyaman berada di rumah.', category: 'G. KEHIDUPAN KELUARGA' },
        { id: 'dcm-g10', text: 'Hubungan dengan saudara (kakak/adik) sering tidak akur.', category: 'G. KEHIDUPAN KELUARGA' },
        { id: 'dcm-g11', text: 'Orang tua tidak memahami keinginan atau cita-cita saya.', category: 'G. KEHIDUPAN KELUARGA' },
        { id: 'dcm-g12', text: 'Sering merasa malu with kondisi keluarga saya.', category: 'G. KEHIDUPAN KELUARGA' },
        { id: 'dcm-g13', text: 'Ada anggota keluarga yang memiliki kebiasaan buruk.', category: 'G. KEHIDUPAN KELUARGA' },
        { id: 'dcm-g14', text: 'Merasa tidak betah tinggal di rumah karena suasana bising.', category: 'G. KEHIDUPAN KELUARGA' },
        { id: 'dcm-g15', text: 'Kurangnya komunikasi yang terbuka dalam keluarga.', category: 'G. KEHIDUPAN KELUARGA' },
        { id: 'dcm-g16', text: 'Orang tua terlalu keras dalam mendidik atau menghukum.', category: 'G. KEHIDUPAN KELUARGA' },
        { id: 'dcm-g17', text: 'Merasa dibebani terlalu banyak pekerjaan rumah tangga.', category: 'G. KEHIDUPAN KELUARGA' },
        { id: 'dcm-g18', text: 'Ingin hidup mandiri and lepas dari ketergantungan keluarga.', category: 'G. KEHIDUPAN KELUARGA' },
        { id: 'dcm-g19', text: 'Sering merasa tidak dihargai pendapatnya oleh orang tua.', category: 'G. KEHIDUPAN KELUARGA' },
        { id: 'dcm-g20', text: 'Khawatir dengan masa depan keluarga yang tidak pasti.', category: 'G. KEHIDUPAN KELUARGA' },

        // H. AGAMA DAN MORAL
        { id: 'dcm-h1', text: 'Merasa malas untuk melaksanakan ibadah wajib.', category: 'H. AGAMA DAN MORAL' },
        { id: 'dcm-h2', text: 'Sering melanggar norma atau aturan agama yang berlaku.', category: 'H. AGAMA DAN MORAL' },
        { id: 'dcm-h3', text: 'Merasa ragu dengan kebenaran ajaran agama tertentu.', category: 'H. AGAMA DAN MORAL' },
        { id: 'dcm-h4', text: 'Sering melakukan perbuatan yang dilarang oleh agama.', category: 'H. AGAMA DAN MORAL' },
        { id: 'dcm-h5', text: 'Merasa kurang mendapat pendidikan agama dari orang tua.', category: 'H. AGAMA DAN MORAL' },
        { id: 'dcm-h6', text: 'Sulit untuk bersikap jujur dalam perkataan and perbuatan.', category: 'H. AGAMA DAN MORAL' },
        { id: 'dcm-h7', text: 'Sering merasa berdosa tetapi sulit untuk berubah.', category: 'H. AGAMA DAN MORAL' },
        { id: 'dcm-h8', text: 'Merasa acuh tak acuh terhadap kegiatan keagamaan.', category: 'H. AGAMA DAN MORAL' },
        { id: 'dcm-h9', text: 'Terpengaruh oleh pergaulan yang mengabaikan nilai moral.', category: 'H. AGAMA DAN MORAL' },
        { id: 'dcm-h10', text: 'Bingung membedakan mana yang benar dan salah.', category: 'H. AGAMA DAN MORAL' },
        { id: 'dcm-h11', text: 'Sering merasa tertekan oleh aturan agama yang ketat.', category: 'H. AGAMA DAN MORAL' },
        { id: 'dcm-h12', text: 'Merasa iri melihat orang lain yang lebih taat beribadah.', category: 'H. AGAMA DAN MORAL' },
        { id: 'dcm-h13', text: 'Sering berkata kasar atau tidak sopan kepada orang lain.', category: 'H. AGAMA DAN MORAL' },
        { id: 'dcm-h14', text: 'Merasa tidak tenang karena sering berbohong.', category: 'H. AGAMA DAN MORAL' },
        { id: 'dcm-h15', text: 'Sulit untuk memaafkan kesalahan orang lain pada saya.', category: 'H. AGAMA DAN MORAL' },
        { id: 'dcm-h16', text: 'Merasa tidak ada gunanya berbuat baik di dunia ini.', category: 'H. AGAMA DAN MORAL' },
        { id: 'dcm-h17', text: 'Sering meremehkan nasihat-nasihat tentang kebaikan.', category: 'H. AGAMA DAN MORAL' },
        { id: 'dcm-h18', text: 'Merasa tidak memiliki pegangan hidup yang kuat.', category: 'H. AGAMA DAN MORAL' },
        { id: 'dcm-h19', text: 'Sering merasa godaan untuk melakukan maksiat sangat besar.', category: 'H. AGAMA DAN MORAL' },
        { id: 'dcm-h20', text: 'Ingin memperdalam agama tetapi tidak tahu caranya.', category: 'H. AGAMA DAN MORAL' },

        // I. PENYESUAIAN TERHADAP SEKOLAH
        { id: 'dcm-i1', text: 'Merasa tidak betah atau tidak nyaman berada di sekolah.', category: 'I. PENYESUAIAN TERHADAP SEKOLAH' },
        { id: 'dcm-i2', text: 'Sering merasa takut kepada guru atau staf sekolah.', category: 'I. PENYESUAIAN TERHADAP SEKOLAH' },
        { id: 'dcm-i3', text: 'Sulit mematuhi tata tertib atau peraturan sekolah.', category: 'I. PENYESUAIAN TERHADAP SEKOLAH' },
        { id: 'dcm-i4', text: 'Merasa fasilitas sekolah kurang mendukung proses belajar.', category: 'I. PENYESUAIAN TERHADAP SEKOLAH' },
        { id: 'dcm-i5', text: 'Sering merasa bosan with suasana kelas yang monoton.', category: 'I. PENYESUAIAN TERHADAP SEKOLAH' },
        { id: 'dcm-i6', text: 'Merasa tidak cocok with lingkungan pergaulan di sekolah.', category: 'I. PENYESUAIAN TERHADAP SEKOLAH' },
        { id: 'dcm-i7', text: 'Sering datang terlambat atau ingin membolos sekolah.', category: 'I. PENYESUAIAN TERHADAP SEKOLAH' },
        { id: 'dcm-i8', text: 'Merasa tertekan oleh beban tugas yang terlalu banyak.', category: 'I. PENYESUAIAN TERHADAP SEKOLAH' },
        { id: 'dcm-i9', text: 'Sulit untuk aktif dalam kegiatan ekstrakurikuler sekolah.', category: 'I. PENYESUAIAN TERHADAP SEKOLAH' },
        { id: 'dcm-i10', text: 'Merasa kurang mendapatkan perhatian dari guru pembimbing.', category: 'I. PENYESUAIAN TERHADAP SEKOLAH' },
        { id: 'dcm-i11', text: 'Sering merasa minder with prestasi teman sekelas.', category: 'I. PENYESUAIAN TERHADAP SEKOLAH' },
        { id: 'dcm-i12', text: 'Merasa salah memilih sekolah atau jurusan saat ini.', category: 'I. PENYESUAIAN TERHADAP SEKOLAH' },
        { id: 'dcm-i13', text: 'Hubungan with beberapa guru terasa kurang baik.', category: 'I. PENYESUAIAN TERHADAP SEKOLAH' },
        { id: 'dcm-i14', text: 'Merasa suasana sekolah terlalu kompetitif and melelahkan.', category: 'I. PENYESUAIAN TERHADAP SEKOLAH' },
        { id: 'dcm-i15', text: 'Sering merasa tidak dihargai usaha atau prestasi saya.', category: 'I. PENYESUAIAN TERHADAP SEKOLAH' },
        { id: 'dcm-i16', text: 'Takut menghadapi ujian atau penilaian di sekolah.', category: 'I. PENYESUAIAN TERHADAP SEKOLAH' },
        { id: 'dcm-i17', text: 'Merasa tidak punya teman akrab di lingkungan sekolah.', category: 'I. PENYESUAIAN TERHADAP SEKOLAH' },
        { id: 'dcm-i18', text: 'Sering merasa bingung with sistem administrasi sekolah.', category: 'I. PENYESUAIAN TERHADAP SEKOLAH' },
        { id: 'dcm-i19', text: 'Merasa kantin atau tempat istirahat kurang memadai.', category: 'I. PENYESUAIAN TERHADAP SEKOLAH' },
        { id: 'dcm-i20', text: 'Ingin segera lulus karena merasa tidak nyaman belajar.', category: 'I. PENYESUAIAN TERHADAP SEKOLAH' },

        // J. PENYESUAIAN TERHADAP KURIKULUM
        { id: 'dcm-j1', text: 'Sulit memahami materi pelajaran yang disampaikan guru.', category: 'J. PENYESUAIAN TERHADAP KURIKULUM' },
        { id: 'dcm-j2', text: 'Merasa kurikulum saat ini terlalu berat bagi kemampuan saya.', category: 'J. PENYESUAIAN TERHADAP KURIKULUM' },
        { id: 'dcm-j3', text: 'Tidak menyukai beberapa mata pelajaran tertentu.', category: 'J. PENYESUAIAN TERHADAP KURIKULUM' },
        { id: 'dcm-j4', text: 'Sering merasa bingung with cara mengajar guru di kelas.', category: 'J. PENYESUAIAN TERHADAP KURIKULUM' },
        { id: 'dcm-j5', text: 'Sulit berkonsentrasi saat penjelasan materi yang sulit.', category: 'J. PENYESUAIAN TERHADAP KURIKULUM' },
        { id: 'dcm-j6', text: 'Merasa waktu belajar di sekolah terlalu lama and melelahkan.', category: 'J. PENYESUAIAN TERHADAP KURIKULUM' },
        { id: 'dcm-j7', text: 'Tidak memiliki buku sumber atau referensi yang lengkap.', category: 'J. PENYESUAIAN TERHADAP KURIKULUM' },
        { id: 'dcm-j8', text: 'Sering gagal mendapatkan nilai di atas batas ketuntasan.', category: 'J. PENYESUAIAN TERHADAP KURIKULUM' },
        { id: 'dcm-j9', text: 'Merasa metode pembelajaran kurang menarik atau membosankan.', category: 'J. PENYESUAIAN TERHADAP KURIKULUM' },
        { id: 'dcm-j10', text: 'Sulit mengerjakan tugas-tugas mandiri yang diberikan.', category: 'J. PENYESUAIAN TERHADAP KURIKULUM' },
        { id: 'dcm-j11', text: 'Merasa materi pelajaran tidak relevan with masa depan.', category: 'J. PENYESUAIAN TERHADAP KURIKULUM' },
        { id: 'dcm-j12', text: 'Sering merasa cemas jika ada tugas kelompok yang sulit.', category: 'J. PENYESUAIAN TERHADAP KURIKULUM' },
        { id: 'dcm-j13', text: 'Tidak berani bertanya saat tidak paham materi pelajaran.', category: 'J. PENYESUAIAN TERHADAP KURIKULUM' },
        { id: 'dcm-j14', text: 'Merasa tertinggal jauh dibandingkan teman-teman lainnya.', category: 'J. PENYESUAIAN TERHADAP KURIKULUM' },
        { id: 'dcm-j15', text: 'Sulit mengatur waktu belajar yang efektif di rumah.', category: 'J. PENYESUAIAN TERHADAP KURIKULUM' },
        { id: 'dcm-j16', text: 'Merasa terlalu banyak hafalan yang harus dikuasai.', category: 'J. PENYESUAIAN TERHADAP KURIKULUM' },
        { id: 'dcm-j17', text: 'Sering merasa mengantuk saat pelajaran berlangsung.', category: 'J. PENYESUAIAN TERHADAP KURIKULUM' },
        { id: 'dcm-j18', text: 'Tidak menyukai sistem penilaian yang diterapkan saat ini.', category: 'J. PENYESUAIAN TERHADAP KURIKULUM' },
        { id: 'dcm-j19', text: 'Merasa kurang bimbingan dalam menghadapi materi sulit.', category: 'J. PENYESUAIAN TERHADAP KURIKULUM' },
        { id: 'dcm-j20', text: 'Ingin kurikulum yang lebih fleksibel and menyenangkan.', category: 'J. PENYESUAIAN TERHADAP KURIKULUM' }
    ],
    Potensi: [{ id: 'pot1', text: 'Saya senang memimpin dalam kegiatan kelompok', category: 'Kepemimpinan' }, { id: 'pot2', text: 'Saya mampu mempengaruhi orang lain untuk tujuan baik', category: 'Kepemimpinan' }, { id: 'pot3', text: 'Saya senang memecahkan masalah matematika/logika', category: 'Intelektual' }, { id: 'pot4', text: 'Saya cepat memahami materi baru yang bersifat teoritis', category: 'Intelektual' }, { id: 'pot5', text: 'Saya senang menggambar atau membuat kerajinan tangan', category: 'Kreativitas' }, { id: 'pot6', text: 'Saya sering memiliki ide-ide baru yang tidak terpikirkan orang lain', category: 'Kreativitas' }],
    Minat: [{ id: 'min1', text: 'Saya tertarik dengan pekerjaan di bidang teknologi', category: 'Teknologi' }, { id: 'min2', text: 'Saya senang mencoba perangkat lunak atau gadget baru', category: 'Teknologi' }, { id: 'min3', text: 'Saya senang membantu orang lain yang sedang kesulitan', category: 'Sosial' }, { id: 'min4', text: 'Saya tertarik menjadi tenaga kesehatan atau pengajar', category: 'Sosial' }, { id: 'min5', text: 'Saya senang tampil di atas panggung (menyanyi/akting)', category: 'Seni' }, { id: 'min6', text: 'Saya tertarik dengan dunia desain atau musik', category: 'Seni' }],
    Gaya: [
        { id: 'gb1', text: 'Ketika aku mengeja kata-kata, aku biasanya …', options: [{ v: 'A', t: 'menuliskan kata tersebut' }, { v: 'B', t: 'menyebutkan kata tersebut' }, { v: 'C', t: 'menuliskan kata tersebut dengan cara rnenggerak-gerakkan jari di udara' }] },
        { id: 'gb2', text: 'Aku lebih menyukai …', options: [{ v: 'A', t: 'Seni lukis atau gambar' }, { v: 'B', t: 'Seni musik' }, { v: 'C', t: 'Seni tari atau pahatan' }] },
        { id: 'gb3', text: 'Saat aku memilih makanan pada daftar menu, aku biasanya …', options: [{ v: 'A', t: 'Membayangkan makanannya akan seperti apa' }, { v: 'B', t: 'Menanyakan rekomendasi menu' }, { v: 'C', t: 'Membayangkan seperti apa rasa makanan itu' }] },
        { id: 'gb4', text: 'Aku lebih mudah mengingat dan memahami sesuatu dengan cara …', options: [{ v: 'A', t: 'Melihat sesuatu' }, { v: 'B', t: 'Mendengarkan sesuatu' }, { v: 'C', t: 'Melakukan sesuatu' }] },
        { id: 'gb5', text: 'Ketika aku mengingat sebuah film, aku biasanya lebih ingat …', options: [{ v: 'A', t: 'Seperti apa orang orang dan tempat yang ada di film tersebut' }, { v: 'B', t: 'Apa yang diucapkan para pemeran dan latar belakang musik yang diputar' }, { v: 'C', t: 'Apa yang dilakukan pemeran dan apa yang mereka rasakan' }] },
        { id: 'gb6', text: 'Aku dapat mengingat orang lain, karena …', options: [{ v: 'A', t: 'Penampilan mereka' }, { v: 'B', t: 'Apa yang mereka katakan kepadaku' }, { v: 'C', t: 'Bagaimana cara mereka memperlakukanku' }] },
        { id: 'gb7', text: 'Aku lebih suka …', options: [{ v: 'A', t: 'Menonton film / foto / melihat seni atau mengamati orang-orang sekitar' }, { v: 'B', t: 'Mendengarkan musik, radio atau bincang-bincang dengan teman-teman' }, { v: 'C', t: 'Berperan serta dalam olahraga/ menikmati makanan yang disajikan /menari' }] },
        { id: 'gb8', text: 'Saat mengisi waktu luang, aku biasanya …', options: [{ v: 'A', t: 'Menonton televisi atau menonton film' }, { v: 'B', t: 'Mengobrol dengan teman-teman' }, { v: 'C', t: 'Melakukan aktivitas fisik atau membuat sesuatu' }] },
        { id: 'gb9', text: 'Ketika bertemu orang baru kenal, aku akan …', options: [{ v: 'A', t: 'Membayangkan apa yang akan dilakukan' }, { v: 'B', t: 'Berbicara dengan mereka melalui telepon' }, { v: 'C', t: 'Mencoba melakukan sesuatu bersama, misalnya kegiatan atau makan bersama' }] },
        { id: 'gb10', text: 'Aku biasanya memperhatikan seseorang melalui ...', options: [{ v: 'A', t: 'Tampilannya dan pakaiannya' }, { v: 'B', t: 'Suara dan cara berbicaranya' }, { v: 'C', t: 'Tingkah lakunya' }] },
        { id: 'gb11', text: 'Aku merasa lebih mudah untuk mengingat seseorang dari …', options: [{ v: 'A', t: 'Wajah atau pakaiannya' }, { v: 'B', t: 'Nama' }, { v: 'C', t: 'Apa yang dilakukan' }] },
        { id: 'gb12', text: 'Ketika mencoba untuk konsentrasi aku sering terganggu dengan …', options: [{ v: 'A', t: 'Orang yang lalu-lalang dihadapanku' }, { v: 'B', t: 'Bunyi dan suara yang ada di sekitarku' }, { v: 'C', t: 'Gerakan atau aktivitas fisik yang ada di sekitarku' }] },
        { id: 'gb13', text: 'Aku biasanya mengatakan …', options: [{ v: 'A', t: 'aku paham apa maksud anda' }, { v: 'B', t: 'aku mendengar apa yang anda katakan' }, { v: 'C', t: 'aku tahu bagaimana yang Anda rasakan' }] },
        { id: 'gb14', text: 'Aku sangat menikmati waktu luang disaat ...', options: [{ v: 'A', t: 'Pergi ke perpustakaan atau museum atau lihat lukisan dan gambar' }, { v: 'B', t: 'Mendengarkan musik dan berbincang dengan teman-teman aku' }, { v: 'C', t: 'Berolahraga atau mengerjakan apa saja' }] },
        { id: 'gb15', text: 'Saat aku mau membeli pakaian, biasanya aku akan …', options: [{ v: 'A', t: 'Membayangkan apakah pakaian tersebut cocok untuk aku' }, { v: 'B', t: 'Meminta rekomendasi dengan karyawan toko' }, { v: 'C', t: 'Mencoba pakaian dan melihat kecocokannya' }] },
        { id: 'gb16', text: 'Saat aku mendatangi pertunjukan band musik, aku biasanya …', options: [{ v: 'A', t: 'Melihat anggota band dan para penonton' }, { v: 'B', t: 'Mendengarkan lirik dan nada' }, { v: 'C', t: 'Terbawa dalam suasana atau ikut bergerak / Joget' }] },
        { id: 'gb17', text: 'Aku lebih konsentrasi disaat …', options: [{ v: 'A', t: 'Fokus pada kata-kata atau gambar-gambar di depanku' }, { v: 'B', t: 'Membahas masalah dan memikirkan solusi yang mungkin dapat dilakukan' }, { v: 'C', t: 'Banyak bergerak atau bermain bolpoin atau pensil, atau menyentuh sesuatu' }] },
        { id: 'gb18', text: 'Aku memilih peralatan di rumah, berdasarkan …', options: [{ v: 'A', t: 'Warnanya dan bagaimana penampilannya' }, { v: 'B', t: 'Penjelasan dari salesnya' }, { v: 'C', t: 'Tekstur peralatan tersebut dan bagaimana rasanya saat menyentuhnya' }] },
        { id: 'gb19', text: 'Saat aku gagal ujian, biasanya aku akan …', options: [{ v: 'A', t: 'Menulis banyak catatan perbaikan' }, { v: 'B', t: 'Membahas catatanku sendiri atau dengan orang lain' }, { v: 'C', t: 'Membuat kemajuan belajar dengan memperbaiki jawaban' }] },
        { id: 'gb20', text: 'Dalam sebuah seminar atau di kelas, aku biasanya …', options: [{ v: 'A', t: 'Banyak mencatat apa yang disajikan pemateri' }, { v: 'B', t: 'Mendengarkan dengan baik dan tidak banyak mencatat' }, { v: 'C', t: 'Menggambar sesuatu atau menggerakkan anggota badan sambil mendengarkan' }] },
        { id: 'gb21', text: 'Jika aku marah, biasanya aku akan …', options: [{ v: 'A', t: 'Terus mengingat hal yang membuat aku marah' }, { v: 'B', t: 'Menceritakan ke orang sekitar tentang perasaanku' }, { v: 'C', t: 'Menunjukkan kemarahan aku, misalnya : menghentakkan kaki, membanting pintu, dan lainnya' }] },
        { id: 'gb22', text: 'Ketika aku cemas, aku akan …', options: [{ v: 'A', t: 'Membayangkan kemungkinan terburuk' }, { v: 'B', t: 'Memikirkan hal yang paling mengkhawatirkan' }, { v: 'C', t: 'Tidak bisa duduk tenang, terus menerus berkeliling, atau memegang sesuatu' }] },
        { id: 'gb23', text: 'Ketka aku merakit perabot atau alat baru, biasanya aku akan …', options: [{ v: 'A', t: 'Membaca petunjuk atau melihat diagram terlebih dahulu' }, { v: 'B', t: 'Mendengarkan seseorang menjelaskan langkah-langkahnya' }, { v: 'C', t: 'Langsung merakit dan mencoba sendiri' }] },
        { id: 'gb24', text: 'Ketika aku perlu petunjuk saat bepergian, biasanya aku akan …', options: [{ v: 'A', t: 'Melihat peta atau map' }, { v: 'B', t: 'Bertanya arah ke orang lain' }, { v: 'C', t: 'Menggunakan kompas dan mengikutinya' }] },
        { id: 'gb25', text: 'Saat aku ingin memasak sesuatu yang baru, biasanya aku akan …', options: [{ v: 'A', t: 'Mengikuti petunjuk resep tertulis' }, { v: 'B', t: 'Meminta penjelasan kepada teman / orang lain' }, { v: 'C', t: 'Mengikuti naluri, mencicipi selagi memasaknya' }] },
        { id: 'gb26', text: 'Jika aku memberi tahu seseorang tentang sesuatu, biasanya aku akan …', options: [{ v: 'A', t: 'Menuliskan petunjuk untuk mereka' }, { v: 'B', t: 'Memberikan penjelasan secara lisan' }, { v: 'C', t: 'Memperagakan terlebih dahulu, lalu meminta mereka mempraktekkannya' }] },
        { id: 'gb27', text: 'Saat merencanakan liburan, biasanya aku akan …', options: [{ v: 'A', t: 'Membaca banyak informasi tempat berlibur di internet atau brosur' }, { v: 'B', t: 'Meminta rekomendasi dari teman-teman' }, { v: 'C', t: 'Membayangkan akan seperti apa jika berada di sana' }] },
        { id: 'gb28', text: 'Jika aku ingin membeli kendaraan motor / mobil baru, aku akan …', options: [{ v: 'A', t: 'Membaca ulasan di internet, koran, dan majalah' }, { v: 'B', t: 'Membahas apa yang aku butuhkan dengan teman-teman' }, { v: 'C', t: 'Mencoba banyak jenis mobil yang berbeda' }] },
        { id: 'gb29', text: 'Aku dapat mengetahui seseorang berbohong, jika …', options: [{ v: 'A', t: 'Mereka menghindari kontak mata' }, { v: 'B', t: 'Perubahan suara mereka' }, { v: 'C', t: 'Mereka menunjukkan perilaku yang aneh' }] },
        { id: 'gb30', text: 'Jika aku mengeluh tentang barang yang ku beli ternyata rusak, aku akan …', options: [{ v: 'A', t: 'Menulis surat / pesan pengaduan' }, { v: 'B', t: 'Menyampaikan keluhan melalui telepon' }, { v: 'C', t: 'Mengembalikannya ke toko atau mengirimkannya ke kantor pusat' }] }
    ]
};

// Table Configurations for Generic Rendering
const TABLE_CONFIG = {
    'Siswa': { bodyId: 'table-siswa-body', cols: ['NISN', 'Nama', (i) => `${i['Tempat Lahir']}, ${i['Tanggal Lahir']}`, 'Jenis Kelamin', 'Agama', 'Nama Orang Tua', 'Kelas', (i) => `<span class="badge ${i.Status === 'Aktif' ? 'bg-success' : 'bg-secondary'}">${i.Status}</span>`] },
    'Guru': { bodyId: 'table-guru-body', cols: ['Nama', 'NIP', 'Mata Pelajaran'] },
    'WaliKelas': { bodyId: 'table-wali-body', cols: ['Nama', 'Kelas'] },
    'LayananBK': { bodyId: 'table-layanan-body', cols: ['Tanggal', 'Siswa', 'Jenis Layanan', 'Keterangan'] },
    'DCM': { bodyId: 'table-dcm-body', cols: ['Tanggal', 'Siswa', 'Hasil/Keterangan'] },
    'Potensi': { bodyId: 'table-potensi-body', cols: ['Tanggal', 'Siswa', 'Potensi Diri'] },
    'MinatBakat': { bodyId: 'table-minat-body', cols: ['Tanggal', 'Siswa', 'Minat', 'Bakat'] },
    'GayaBelajar': { bodyId: 'table-gaya-belajar-body', cols: ['Tanggal', 'Siswa', 'Tipe Gaya Belajar'] },
    'JawabanInstrumen': { bodyId: 'table-jawaban-body', cols: ['Tanggal', 'Nama', 'Kelas', 'Instrumen', (i) => `<button class="btn btn-sm btn-info" onclick="viewDetailJawaban('${i.ID}')">Lihat Detail</button>`] }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkLogin();
    refreshData();

    const events = [
        ['login-form', handleLogin], ['form-siswa', (e) => handleSaveGeneric(e, 'Siswa', 'modalSiswa', 'form-siswa', ['NISN', 'Nama', 'Tempat Lahir', 'Tanggal Lahir', 'Jenis Kelamin', 'Agama', 'Nama Orang Tua', 'Kelas', 'Status'], ['siswa-nisn', 'siswa-nama', 'siswa-tempat-lahir', 'siswa-tanggal-lahir', 'siswa-jk', 'siswa-agama', 'siswa-ortu', 'siswa-kelas', 'siswa-status'], 'siswa-id')],
        ['form-layanan', (e) => {
            e.preventDefault();
            const id = document.getElementById('layanan-id').value;
            const rowData = {
                'Tanggal': document.getElementById('layanan-tanggal').value,
                'Siswa': document.getElementById('layanan-siswa').value,
                'Keterangan': document.getElementById('layanan-keterangan').value,
                'Jenis Layanan': currentLayananType || 'Bimbingan Umum'
            };
            handleSaveGenericAction(id ? 'updateData' : 'addData', id ? { sheetName: 'LayananBK', id, rowData } : { sheetName: 'LayananBK', rowData }, 'modalLayanan', 'form-layanan');
        }],
        ['form-guru', (e) => handleSaveGeneric(e, 'Guru', 'modalGuru', 'form-guru', ['Nama', 'NIP', 'Mata Pelajaran'], ['guru-nama', 'guru-nip', 'guru-mapel'], 'guru-id')],
        ['form-wali', (e) => handleSaveGeneric(e, 'WaliKelas', 'modalWali', 'form-wali', ['Nama', 'Kelas'], ['wali-nama', 'wali-kelas'], 'wali-id')],
        ['form-dcm', (e) => handleSaveGeneric(e, 'DCM', 'modalDCM', 'form-dcm', ['Tanggal', 'Siswa', 'Hasil/Keterangan'], ['dcm-tanggal', 'dcm-siswa', 'dcm-hasil'], 'dcm-id')],
        ['form-potensi', (e) => handleSaveGeneric(e, 'Potensi', 'modalPotensi', 'form-potensi', ['Tanggal', 'Siswa', 'Potensi Diri'], ['potensi-tanggal', 'potensi-siswa', 'potensi-diri'], 'potensi-id')],
        ['form-minat', (e) => handleSaveGeneric(e, 'MinatBakat', 'modalMinat', 'form-minat', ['Tanggal', 'Siswa', 'Minat', 'Bakat'], ['minat-tanggal', 'minat-siswa', 'minat-bidang', 'bakat-bidang'], 'minat-id')],
        ['form-gaya-belajar', (e) => handleSaveGeneric(e, 'GayaBelajar', 'modalGayaBelajar', 'form-gaya-belajar', ['Tanggal', 'Siswa', 'Tipe Gaya Belajar'], ['gaya-belajar-tanggal', 'gaya-belajar-siswa', 'gaya-belajar-tipe'], 'gaya-belajar-id')],
        ['form-isi-instrumen', handleSaveJawaban], ['form-pertanyaan', handleSavePertanyaan], ['form-pengaturan', handleSaveSettings]
    ];
    events.forEach(([id, handler]) => document.getElementById(id)?.addEventListener('submit', handler));
});

// Auth & UI Flow
const checkLogin = () => {
    const role = localStorage.getItem('userRole'), userData = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (role && (role === 'admin' || userData)) { userRole = role; currentUser = userData; showApp(); } else showLogin();
};

const showLogin = () => {
    ['login-container'].forEach(id => document.getElementById(id).classList.remove('d-none'));
    ['app-container', 'admin-navbar', 'siswa-navbar'].forEach(id => document.getElementById(id).classList.add('d-none'));
};

const showApp = () => {
    document.getElementById('login-container').classList.add('d-none');
    document.getElementById('app-container').classList.remove('d-none');
    const isAdmin = userRole === 'admin';
    document.getElementById('admin-navbar').classList.toggle('d-none', !isAdmin);
    document.getElementById('siswa-navbar').classList.toggle('d-none', isAdmin);
    if (!isAdmin) document.getElementById('display-nama-siswa').innerText = currentUser.Nama;
    showSection(isAdmin ? 'dashboard' : 'siswa-dashboard');
    refreshData();
};

const logout = () => { localStorage.clear(); location.reload(); };

async function handleLogin(e) {
    e.preventDefault();
    const role = document.getElementById('login-role').value, password = document.getElementById('password').value, btn = e.target.querySelector('button[type="submit"]'), originalText = btn.innerHTML;
    btn.disabled = true; btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Memproses...';
    try {
        if (role === 'admin') {
            const res = await callAPI('login', { username: document.getElementById('username').value, password });
            if (res.success) { localStorage.setItem('userRole', 'admin'); userRole = 'admin'; showApp(); } else alert(res.message);
        } else {
            if (dataSiswa.length === 0) {
                alert('Data siswa belum dimuat atau kosong. Silakan tunggu sebentar atau hubungi Admin.');
                return;
            }
            const nisn = document.getElementById('login-nisn').value.trim(),
                siswa = dataSiswa.find(s => s.NISN && s.NISN.toString().trim() === nisn);

            if (siswa && password.trim() === nisn) {
                localStorage.setItem('userRole', 'siswa');
                localStorage.setItem('currentUser', JSON.stringify(siswa));
                userRole = 'siswa';
                currentUser = siswa;
                showApp();
            } else {
                if (!siswa) {
                    alert('NISN tidak terdaftar. Pastikan NISN sudah didaftarkan oleh Admin.');
                } else {
                    alert('Password salah. Gunakan NISN Anda sebagai password.');
                }
            }
        }
    } finally { btn.disabled = false; btn.innerHTML = originalText; }
}

function showSection(id, type = '') {
    currentSection = id; currentLayananType = type;
    document.querySelectorAll('.content-section').forEach(sec => sec.classList.add('d-none'));
    document.getElementById(id)?.classList.remove('d-none');
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));

    if (userRole === 'admin') {
        const renderMap = {
            'dashboard': updateDashboardCounts, 'data-siswa': () => renderTable('Siswa', dataSiswa), 'data-guru': () => renderTable('Guru', dataGuru),
            'data-wali-kelas': () => renderTable('WaliKelas', dataWali), 'data-jawaban': () => renderTable('JawabanInstrumen', dataJawaban), 'pengaturan': loadSettingsToForm, 'kelola-pertanyaan': renderTablePertanyaan,
            'instrumen-dcm': () => renderTable('DCM', dataDCM), 'instrumen-potensi': () => renderTable('Potensi', dataPotensi),
            'instrumen-minat': () => renderTable('MinatBakat', dataMinat), 'instrumen-gaya-belajar': () => renderTable('GayaBelajar', dataGayaBelajar),
            'analisis-instrumen': updateAnalisisFilters,
            'layanan-bk': () => { document.getElementById('layanan-title').innerText = `Layanan BK: ${type}`; renderTable('LayananBK', type === 'Semua' ? dataLayanan : dataLayanan.filter(l => l['Jenis Layanan'] === type)); }
        };
        if (renderMap[id]) renderMap[id]();
    } else {
        if (id === 'siswa-dashboard') updateSiswaStatus(); else if (id === 'hasil-saya') renderHasilSaya();
    }
}

// Data Operations
async function refreshData() {
    if (isRefreshing) return; isRefreshing = true;
    try {
        const res = await callAPI('getBatchData', { sheetNames: Object.keys(TABLE_CONFIG).concat(['JawabanInstrumen', 'PertanyaanInstrumen', 'Settings']) });
        if (res.success) {
            const d = res.data;
            dataSiswa = d.Siswa; dataLayanan = d.LayananBK; dataGuru = d.Guru; dataWali = d.WaliKelas; dataDCM = d.DCM; dataPotensi = d.Potensi; dataMinat = d.MinatBakat; dataGayaBelajar = d.GayaBelajar; dataJawaban = d.JawabanInstrumen; dataPertanyaan = d.PertanyaanInstrumen; appSettings = d.Settings;
            updateUIFromSettings(); updateSiswaSelect(); updateKelasSelect(); updateDashboardCounts();
            if (currentSection) showSection(currentSection, currentLayananType);
        }
    } finally { isRefreshing = false; }
}

function renderTable(name, data) {
    const config = TABLE_CONFIG[name], tbody = document.getElementById(config.bodyId);
    if (!tbody) return;
    tbody.innerHTML = data.map(item => `<tr>${config.cols.map(c => `<td>${typeof c === 'function' ? c(item) : (item[c] || '-')}</td>`).join('')}<td><button class="btn btn-sm btn-warning me-1" onclick="editItem('${name}', '${item.ID}')">Edit</button><button class="btn btn-sm btn-danger" onclick="deleteItem('${name}', '${item.ID}')">Hapus</button></td></tr>`).join('');
}

async function handleSaveGeneric(e, sheet, modalId, formId, fields, inputIds, idField) {
    e.preventDefault();
    const id = document.getElementById(idField).value, rowData = fields.reduce((obj, f, i) => ({ ...obj, [f]: document.getElementById(inputIds[i]).value }), {});
    await handleSaveGenericAction(id ? 'updateData' : 'addData', id ? { sheetName: sheet, id, rowData } : { sheetName: sheet, rowData }, modalId, formId);
}

async function handleSaveGenericAction(action, payload, modalId, formId) {
    const res = await callAPI(action, payload);
    if (res.success) {
        const modal = document.getElementById(modalId);
        if (modal) bootstrap.Modal.getInstance(modal).hide();
        const form = document.getElementById(formId);
        if (form) form.reset();
        await refreshData();
    }
}

// Instrumen & Analytics
function startInstrumen(type) {
    const questions = dataPertanyaan.filter(p => p.Instrumen === type).length ? dataPertanyaan.filter(p => p.Instrumen === type).map(p => ({ id: p.ID, text: p.Pertanyaan, category: p.Kategori })) : DEFAULT_QUESTIONS[type];
    document.getElementById('instrumen-form-container').classList.remove('d-none');
    document.getElementById('instrumen-form-title').innerText = `Isi Instrumen: ${type}`;

    let html = '';
    let currentCategory = '';

    questions.forEach((q, i) => {
        if (q.category && q.category !== currentCategory) {
            currentCategory = q.category;
            html += `<div class="category-header mt-4 mb-3 p-2 bg-primary text-white rounded"><h5>Bidang: ${currentCategory}</h5></div>`;
        }

        let optionsHtml = '';
        if (q.options && q.options.length > 0) {
            optionsHtml = `<div class="d-flex flex-column gap-2">`;
            q.options.forEach(opt => {
                optionsHtml += `
                <div class="form-check">
                    <input class="form-check-input" type="radio" name="q-${q.id}" id="${q.id}-${opt.v}" value="${opt.v}" required>
                    <label class="form-check-label" for="${q.id}-${opt.v}">${opt.v}. ${opt.t}</label>
                </div>`;
            });
            optionsHtml += `</div>`;
        } else {
            optionsHtml = `
            <div class="d-flex gap-4">
                <div class="form-check">
                    <input class="form-check-input" type="radio" name="q-${q.id}" id="${q.id}-ya" value="Ya" required>
                    <label class="form-check-label" for="${q.id}-ya">Ya</label>
                </div>
                <div class="form-check">
                    <input class="form-check-input" type="radio" name="q-${q.id}" id="${q.id}-tidak" value="Tidak" required>
                    <label class="form-check-label" for="${q.id}-tidak">Tidak</label>
                </div>
            </div>`;
        }

        html += `<div class="mb-3 p-3 border rounded bg-light shadow-sm">
            <p class="fw-bold mb-2">${i + 1}. ${q.text}</p>
            ${optionsHtml}
        </div>`;
    });

    document.getElementById('instrumen-questions-list').innerHTML = html;
    window.scrollTo(0, document.getElementById('instrumen-form-container').offsetTop);
}

async function handleSaveJawaban(e) {
    e.preventDefault();
    const type = document.getElementById('instrumen-form-title').innerText.split(': ')[1];
    const questions = dataPertanyaan.filter(p => p.Instrumen === type).length ? dataPertanyaan.filter(p => p.Instrumen === type) : DEFAULT_QUESTIONS[type];
    const jawaban = questions.reduce((obj, q) => ({ ...obj, [q.id || q.ID]: document.querySelector(`input[name="q-${q.id || q.ID}"]:checked`).value }), {});
    const res = await callAPI('addData', { sheetName: 'JawabanInstrumen', rowData: { NISN: currentUser.NISN, Nama: currentUser.Nama, Kelas: currentUser.Kelas, Instrumen: type, Tanggal: new Date().toISOString().split('T')[0], Jawaban: JSON.stringify(jawaban) } });
    if (res.success) { document.getElementById('instrumen-form-container').classList.add('d-none'); await refreshData(); showSection('siswa-dashboard'); }
}

function calculatePercentage(nisn, type) {
    const data = dataJawaban.find(j => j.NISN === nisn && j.Instrumen === type);
    if (!data) return null;
    const jaw = JSON.parse(data.Jawaban), qs = dataPertanyaan.filter(p => p.Instrumen === type).length ? dataPertanyaan.filter(p => p.Instrumen === type).map(p => ({ id: p.ID, category: p.Kategori })) : DEFAULT_QUESTIONS[type];

    if (type === 'Gaya') {
        const counts = { 'Visual': 0, 'Auditori': 0, 'Kinestetik': 0 };
        const total = Object.keys(jaw).length;
        if (total === 0) return counts;
        Object.values(jaw).forEach(val => {
            if (val === 'A') counts['Visual']++;
            else if (val === 'B') counts['Auditori']++;
            else if (val === 'C') counts['Kinestetik']++;
        });
        return Object.keys(counts).reduce((res, key) => { res[key] = Math.round((counts[key] / total) * 100); return res; }, {});
    }

    const cats = [...new Set(qs.map(q => q.category))];
    return cats.reduce((res, cat) => { const cQs = qs.filter(q => q.category === cat); res[cat] = Math.round((cQs.filter(q => jaw[q.id] === 'Ya').length / cQs.length) * 100); return res; }, {});
}

// Helper UI & Interactions
const updateUIFromSettings = () => { if (appSettings.SchoolName) document.querySelector('.navbar-brand').innerHTML = `<i class="fas fa-graduation-cap me-2"></i>${appSettings.SchoolName}`; };
const updateDashboardCounts = () => {
    ['count-siswa', 'count-layanan'].forEach(id => { const el = document.getElementById(id); if (el) el.innerText = (id === 'count-siswa' ? dataSiswa : dataLayanan).length; });
    ['Belajar', 'Sosial', 'Karier', 'Individu', 'Kelompok'].forEach(t => { const el = document.getElementById(`count-${t.toLowerCase()}`); if (el) el.innerText = dataLayanan.filter(l => l['Jenis Layanan'].includes(t)).length; });
};
const updateSiswaSelect = () => {
    document.querySelectorAll('.select-siswa, #layanan-siswa').forEach(s => { const val = s.value; s.innerHTML = '<option value="">Pilih Siswa...</option>' + dataSiswa.map(si => `<option value="${si.Nama}">${si.Nama} (${si.Kelas})</option>`).join(''); s.value = val; });
};

const updateKelasSelect = () => {
    const kelasList = [...new Set(dataSiswa.map(s => s.Kelas))].sort();
    const select = document.getElementById('analisis-filter-kelas');
    if (select) {
        select.innerHTML = '<option value="">Pilih Kelas...</option>' + kelasList.map(k => `<option value="${k}">${k}</option>`).join('');
    }
};

const toggleLoginFields = () => {
    const isSiswa = document.getElementById('login-role').value === 'siswa';
    document.getElementById('field-username').classList.toggle('d-none', isSiswa);
    document.getElementById('field-nisn').classList.toggle('d-none', !isSiswa);
};

const loadSettingsToForm = () => {
    ['setting-school-name', 'setting-academic-year'].forEach(id => document.getElementById(id).value = appSettings[id.includes('school') ? 'SchoolName' : 'AcademicYear'] || '');
    if (appSettings.KopSurat) { document.getElementById('kop-preview-img').src = appSettings.KopSurat; document.getElementById('kop-preview-container').classList.remove('d-none'); }
};

async function handleSaveSettings(e) {
    e.preventDefault();
    const s = { SchoolName: document.getElementById('setting-school-name').value, AcademicYear: document.getElementById('setting-academic-year').value };
    const pass = document.getElementById('setting-admin-pass').value; if (pass) s.AdminPass = pass;
    const res = await callAPI('updateSettings', { settings: s });
    if (res.success) { alert('Tersimpan!'); refreshData(); }
}

async function openModalSiswa() { document.getElementById('form-siswa').reset(); document.getElementById('siswa-id').value = ''; new bootstrap.Modal(document.getElementById('modalSiswa')).show(); }
async function openModalGuru() { document.getElementById('form-guru').reset(); document.getElementById('guru-id').value = ''; new bootstrap.Modal(document.getElementById('modalGuru')).show(); }
async function openModalWali() { document.getElementById('form-wali').reset(); document.getElementById('wali-id').value = ''; new bootstrap.Modal(document.getElementById('modalWali')).show(); }
async function openModalLayanan() { document.getElementById('form-layanan').reset(); document.getElementById('layanan-id').value = ''; new bootstrap.Modal(document.getElementById('modalLayanan')).show(); }
async function openModalDCM() { document.getElementById('form-dcm').reset(); document.getElementById('dcm-id').value = ''; new bootstrap.Modal(document.getElementById('modalDCM')).show(); }
async function openModalPotensi() { document.getElementById('form-potensi').reset(); document.getElementById('potensi-id').value = ''; new bootstrap.Modal(document.getElementById('modalPotensi')).show(); }
async function openModalMinat() { document.getElementById('form-minat').reset(); document.getElementById('minat-id').value = ''; new bootstrap.Modal(document.getElementById('modalMinat')).show(); }
async function openModalGayaBelajar() { document.getElementById('form-gaya-belajar').reset(); document.getElementById('gaya-belajar-id').value = ''; new bootstrap.Modal(document.getElementById('modalGayaBelajar')).show(); }

async function editItem(sheet, id) {
    const data = { Siswa: dataSiswa, Guru: dataGuru, WaliKelas: dataWali, LayananBK: dataLayanan, DCM: dataDCM, Potensi: dataPotensi, MinatBakat: dataMinat, GayaBelajar: dataGayaBelajar, PertanyaanInstrumen: dataPertanyaan }[sheet];
    const item = data.find(i => i.ID === id); if (!item) return;
    const config = {
        Siswa: { modal: 'modalSiswa', fields: ['siswa-id', 'siswa-nisn', 'siswa-nama', 'siswa-tempat-lahir', 'siswa-tanggal-lahir', 'siswa-jk', 'siswa-agama', 'siswa-ortu', 'siswa-kelas', 'siswa-status'], keys: ['ID', 'NISN', 'Nama', 'Tempat Lahir', 'Tanggal Lahir', 'Jenis Kelamin', 'Agama', 'Nama Orang Tua', 'Kelas', 'Status'] },
        Guru: { modal: 'modalGuru', fields: ['guru-id', 'guru-nama', 'guru-nip', 'guru-mapel'], keys: ['ID', 'Nama', 'NIP', 'Mata Pelajaran'] },
        WaliKelas: { modal: 'modalWali', fields: ['wali-id', 'wali-nama', 'wali-kelas'], keys: ['ID', 'Nama', 'Kelas'] },
        LayananBK: { modal: 'modalLayanan', fields: ['layanan-id', 'layanan-tanggal', 'layanan-jenis', 'layanan-siswa', 'layanan-keterangan'], keys: ['ID', 'Tanggal', 'Jenis Layanan', 'Siswa', 'Keterangan'] },
        DCM: { modal: 'modalDCM', fields: ['dcm-id', 'dcm-tanggal', 'dcm-siswa', 'dcm-hasil'], keys: ['ID', 'Tanggal', 'Siswa', 'Hasil/Keterangan'] },
        Potensi: { modal: 'modalPotensi', fields: ['potensi-id', 'potensi-tanggal', 'potensi-siswa', 'potensi-diri'], keys: ['ID', 'Tanggal', 'Siswa', 'Potensi Diri'] },
        MinatBakat: { modal: 'modalMinat', fields: ['minat-id', 'minat-tanggal', 'minat-siswa', 'minat-bidang', 'bakat-bidang'], keys: ['ID', 'Tanggal', 'Siswa', 'Minat', 'Bakat'] },
        GayaBelajar: { modal: 'modalGayaBelajar', fields: ['gaya-belajar-id', 'gaya-belajar-tanggal', 'gaya-belajar-siswa', 'gaya-belajar-tipe'], keys: ['ID', 'Tanggal', 'Siswa', 'Tipe Gaya Belajar'] },
        PertanyaanInstrumen: { modal: 'modalPertanyaan', fields: ['pertanyaan-id', 'pertanyaan-instrumen', 'pertanyaan-teks', 'pertanyaan-kategori'], keys: ['ID', 'Instrumen', 'Pertanyaan', 'Kategori'] }
    }[sheet];
    if (config) { config.fields.forEach((f, i) => document.getElementById(f).value = item[config.keys[i]]); new bootstrap.Modal(document.getElementById(config.modal)).show(); }
}

async function deleteItem(sheet, id) {
    if (confirm('Hapus data ini?')) { const res = await callAPI('deleteData', { sheetName: sheet, id }); if (res.success) refreshData(); }
}

function viewDetailJawaban(id) {
    const data = dataJawaban.find(j => j.ID === id);
    if (!data) return;

    const jaw = JSON.parse(data.Jawaban);
    const type = data.Instrumen;
    const questions = dataPertanyaan.filter(p => p.Instrumen === type).length ? dataPertanyaan.filter(p => p.Instrumen === type) : DEFAULT_QUESTIONS[type];

    document.getElementById('detail-jawaban-info').innerHTML = `
        <div class="row">
            <div class="col-md-6">
                <p class="mb-1"><strong>Nama:</strong> ${data.Nama}</p>
                <p class="mb-1"><strong>Kelas:</strong> ${data.Kelas}</p>
            </div>
            <div class="col-md-6 text-md-end">
                <p class="mb-1"><strong>Instrumen:</strong> ${type}</p>
                <p class="mb-1"><strong>Tanggal:</strong> ${data.Tanggal}</p>
            </div>
        </div>
    `;

    let html = '';
    questions.forEach((q, i) => {
        const val = jaw[q.id || q.ID] || '-';
        let label = val;
        if (type === 'Gaya') {
            const opt = q.options?.find(o => o.v === val);
            if (opt) label = `${val}. ${opt.t}`;
        }
        html += `<tr><td>${i + 1}</td><td>${q.text || q.Pertanyaan}</td><td>${label}</td></tr>`;
    });

    document.getElementById('detail-jawaban-body').innerHTML = html;
    new bootstrap.Modal(document.getElementById('modalDetailJawaban')).show();
}

// Analytics Rendering
function renderHasilSaya() {
    const container = document.getElementById('hasil-saya-content'); container.innerHTML = '';
    ['DCM', 'Potensi', 'Minat', 'Gaya'].forEach(type => {
        const res = calculatePercentage(currentUser.NISN, type); if (!res) return;
        const cardId = `chart-${type.toLowerCase()}`;
        container.innerHTML += `<div class="col-md-6 mb-4"><div class="card shadow-sm h-100"><div class="card-header bg-white"><strong>${type}</strong></div><div class="card-body"><canvas id="${cardId}"></canvas></div></div></div>`;
        setTimeout(() => {
            const chartType = type === 'Gaya' ? 'bar' : 'radar';
            new Chart(document.getElementById(cardId), {
                type: chartType,
                data: {
                    labels: Object.keys(res),
                    datasets: [{
                        label: '%',
                        data: Object.values(res),
                        backgroundColor: type === 'Gaya' ? ['rgba(54,162,235,0.5)', 'rgba(255,99,132,0.5)', 'rgba(75,192,192,0.5)'] : 'rgba(54,162,235,0.2)',
                        borderColor: type === 'Gaya' ? ['rgb(54,162,235)', 'rgb(255,99,132)', 'rgb(75,192,192)'] : 'rgb(54,162,235)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: chartType === 'bar' ? { y: { beginAtZero: true, max: 100 } } : { r: { suggestMin: 0, suggestMax: 100 } }
                }
            });
        }, 100);
    });
}

function updateAnalisisFilters() {
    const level = document.getElementById('analisis-level').value;
    document.getElementById('filter-siswa-container').classList.toggle('d-none', level !== 'individu');
    document.getElementById('filter-kelas-container').classList.toggle('d-none', level !== 'kelas');
    generateAnalisis();
}

function generateAnalisis() {
    const container = document.getElementById('analisis-result-container');
    const type = document.getElementById('analisis-instrumen-type').value;
    const level = document.getElementById('analisis-level').value;

    let results = null;
    let label = '';

    if (level === 'individu') {
        const nama = document.getElementById('analisis-filter-siswa').value;
        const siswa = dataSiswa.find(s => s.Nama === nama);
        if (!siswa) { container.innerHTML = '<div class="alert alert-info">Pilih siswa untuk melihat analisis.</div>'; return; }
        results = calculatePercentage(siswa.NISN, type);
        label = `Hasil ${type} - ${siswa.Nama}`;
    } else if (level === 'kelas') {
        const kelas = document.getElementById('analisis-filter-kelas').value;
        if (!kelas) { container.innerHTML = '<div class="alert alert-info">Pilih kelas untuk melihat analisis.</div>'; return; }
        const siswaDiKelas = dataSiswa.filter(s => s.Kelas === kelas);
        const allRes = siswaDiKelas.map(s => calculatePercentage(s.NISN, type)).filter(r => r !== null);

        if (allRes.length === 0) {
            container.innerHTML = '<div class="alert alert-info">Belum ada data untuk kelas ini.</div>';
            return;
        }

        const keys = Object.keys(allRes[0]);
        results = keys.reduce((acc, key) => {
            acc[key] = Math.round(allRes.reduce((sum, r) => sum + r[key], 0) / allRes.length);
            return acc;
        }, {});
        label = `Rata-rata ${type} - Kelas ${kelas} (${allRes.length} Siswa)`;
    }

    if (!results) {
        container.innerHTML = '<div class="alert alert-warning">Data tidak ditemukan. Pastikan instrumen sudah diisi.</div>';
        return;
    }

    container.innerHTML = `
        <div class="card shadow-sm">
            <div class="card-header bg-white d-flex justify-content-between align-items-center">
                <strong>${label}</strong>
                <button class="btn btn-sm btn-outline-primary" onclick="window.print()"><i class="fas fa-print me-1"></i>Cetak</button>
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-md-6">
                        <canvas id="analisis-chart"></canvas>
                    </div>
                    <div class="col-md-6">
                        <table class="table table-bordered mt-4">
                            <thead><tr><th>Kategori</th><th>Persentase</th></tr></thead>
                            <tbody>
                                ${Object.entries(results).map(([k, v]) => `<tr><td>${k}</td><td>${v}%</td></tr>`).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>`;

    setTimeout(() => {
        const chartType = type === 'Gaya' ? 'bar' : 'radar';
        new Chart(document.getElementById('analisis-chart'), {
            type: chartType,
            data: {
                labels: Object.keys(results),
                datasets: [{
                    label: '%',
                    data: Object.values(results),
                    backgroundColor: type === 'Gaya' ? ['rgba(54,162,235,0.5)', 'rgba(255,99,132,0.5)', 'rgba(75,192,192,0.5)'] : 'rgba(54,162,235,0.2)',
                    borderColor: type === 'Gaya' ? ['rgb(54,162,235)', 'rgb(255,99,132)', 'rgb(75,192,192)'] : 'rgb(54,162,235)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: chartType === 'bar' ? { y: { beginAtZero: true, max: 100 } } : { r: { suggestMin: 0, suggestMax: 100 } }
            }
        });
    }, 100);
}

function updateSiswaStatus() {
    const ans = dataJawaban.filter(j => j.NISN === currentUser.NISN);
    ['DCM', 'Potensi', 'Minat', 'Gaya'].forEach(t => {
        const filled = ans.some(j => j.Instrumen === t), el = document.getElementById(`status-${t.toLowerCase()}`);
        if (el) { el.innerText = filled ? 'Sudah' : 'Belum'; el.className = `badge bg-${filled ? 'success' : 'secondary'}`; }
    });
}

function renderTablePertanyaan() {
    const type = document.getElementById('filter-kelola-instrumen').value, tbody = document.getElementById('table-pertanyaan-body');
    const filtered = dataPertanyaan.filter(p => p.Instrumen === type);
    tbody.innerHTML = filtered.length ? filtered.map(p => `<tr><td>${p.Pertanyaan}</td><td>${p.Kategori}</td><td><button class="btn btn-sm btn-warning me-1" onclick="editItem('PertanyaanInstrumen','${p.ID}')">Edit</button><button class="btn btn-sm btn-danger" onclick="deleteItem('PertanyaanInstrumen','${p.ID}')">Hapus</button></td></tr>`).join('') : '<tr><td colspan="3">Default</td></tr>';
}

async function handleSavePertanyaan(e) {
    e.preventDefault(); const id = document.getElementById('pertanyaan-id').value, rowData = { Instrumen: document.getElementById('pertanyaan-instrumen').value, Pertanyaan: document.getElementById('pertanyaan-teks').value, Kategori: document.getElementById('pertanyaan-kategori').value };
    const res = await callAPI(id ? 'updateData' : 'addData', id ? { sheetName: 'PertanyaanInstrumen', id, rowData } : { sheetName: 'PertanyaanInstrumen', rowData });
    if (res.success) { bootstrap.Modal.getInstance(document.getElementById('modalPertanyaan')).hide(); refreshData(); }
}

// Mock API
function handleMockAPI(action, payload) {
    if (!window.mockDb) window.mockDb = Object.keys(TABLE_CONFIG).concat(['JawabanInstrumen', 'PertanyaanInstrumen']).reduce((acc, k) => ({ ...acc, [k]: JSON.parse(localStorage.getItem('mock' + k) || '[]') }), { Settings: { AdminPass: 'Lajoroni234', SchoolName: 'Demo BK' } });
    const db = window.mockDb;
    const responses = {
        getData: () => ({ success: true, data: db[payload.sheetName] || [] }),
        getBatchData: () => ({ success: true, data: payload.sheetNames.reduce((acc, n) => ({ ...acc, [n]: db[n] || [] }), {}) }),
        getSettings: () => ({ success: true, data: db.Settings }),
        updateSettings: () => { db.Settings = { ...db.Settings, ...payload.settings }; localStorage.setItem('mockSettings', JSON.stringify(db.Settings)); return { success: true }; },
        addData: () => { const n = { ...payload.rowData, ID: Date.now().toString() }; db[payload.sheetName].push(n); localStorage.setItem('mock' + payload.sheetName, JSON.stringify(db[payload.sheetName])); return { success: true }; },
        updateData: () => { const i = db[payload.sheetName].findIndex(x => x.ID === payload.id); if (i > -1) { db[payload.sheetName][i] = { ...db[payload.sheetName][i], ...payload.rowData }; localStorage.setItem('mock' + payload.sheetName, JSON.stringify(db[payload.sheetName])); return { success: true }; } return { success: false }; },
        deleteData: () => { db[payload.sheetName] = db[payload.sheetName].filter(x => x.ID !== payload.id); localStorage.setItem('mock' + payload.sheetName, JSON.stringify(db[payload.sheetName])); return { success: true }; }
    };
    return responses[action] ? responses[action]() : { success: false };
}

// API Base
async function callAPI(action, payload) {
    if (!GAS_URL.startsWith('https://script.google.com')) return handleMockAPI(action, payload);
    try {
        const res = await fetch(GAS_URL, { method: 'POST', mode: 'cors', redirect: 'follow', body: JSON.stringify({ action, payload }) });
        return res.ok ? await res.json() : { success: false };
    } catch (e) { console.error(e); return { success: false }; }
}
