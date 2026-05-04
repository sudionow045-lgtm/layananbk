import React from 'react';

const Home: React.FC = () => {
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8 text-center">
          <h1 className="display-4 mb-4">Selamat Datang di Layanan BK</h1>
          <p className="lead mb-5">
            Sistem Informasi Bimbingan Konseling untuk memudahkan siswa dan admin dalam manajemen layanan BK.
          </p>
          
          <div className="row g-4">
            <div className="col-md-6">
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body">
                  <i className="fas fa-user-graduate fa-3x mb-3 text-primary"></i>
                  <h5 className="card-title">Untuk Siswa</h5>
                  <p className="card-text text-muted">
                    Akses layanan bimbingan belajar, sosial, karier, dan konseling secara mandiri.
                  </p>
                  <button className="btn btn-outline-primary">Masuk sebagai Siswa</button>
                </div>
              </div>
            </div>
            
            <div className="col-md-6">
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body">
                  <i className="fas fa-user-shield fa-3x mb-3 text-success"></i>
                  <h5 className="card-title">Untuk Admin</h5>
                  <p className="card-text text-muted">
                    Kelola data siswa, guru, wali kelas, dan pantau perkembangan layanan BK.
                  </p>
                  <button className="btn btn-outline-success">Masuk sebagai Admin</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
