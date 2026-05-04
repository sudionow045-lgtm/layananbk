import React from 'react';

/**
 * LayananBK component to display service types
 */
const LayananBK: React.FC = () => {
  const categories = [
    { title: 'Bimbingan Belajar', desc: 'Membantu siswa dalam kesulitan belajar.', icon: 'fa-book-reader', color: 'primary' },
    { title: 'Bimbingan Sosial', desc: 'Membantu interaksi dan adaptasi sosial.', icon: 'fa-users', color: 'success' },
    { title: 'Bimbingan Karier', desc: 'Perencanaan masa depan dan pekerjaan.', icon: 'fa-briefcase', color: 'warning' },
    { title: 'Konseling Individu', desc: 'Layanan tatap muka satu lawan satu.', icon: 'fa-user-friends', color: 'info' },
    { title: 'Konseling Kelompok', desc: 'Penyelesaian masalah dalam kelompok.', icon: 'fa-comments', color: 'danger' },
  ];

  return (
    <div className="container py-4">
      <div className="text-center mb-5">
        <h2 className="fw-bold">Jenis Layanan BK</h2>
        <p className="text-muted">Pilih jenis layanan yang ingin dikelola atau diberikan kepada siswa.</p>
      </div>

      <div className="row g-4 justify-content-center">
        {categories.map((cat, index) => (
          <div key={index} className="col-md-4">
            <div className="card h-100 border-0 shadow-sm hover-shadow transition">
              <div className="card-body p-4 text-center">
                <div className={`bg-${cat.color} bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3`} style={{ width: '80px', height: '80px' }}>
                  <i className={`fas ${cat.icon} text-${cat.color} fs-2`}></i>
                </div>
                <h5 className="fw-bold mb-3">{cat.title}</h5>
                <p className="text-muted small mb-4">{cat.desc}</p>
                <button className={`btn btn-outline-${cat.color} btn-sm px-4 rounded-pill`}>
                  Kelola Data
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .hover-shadow:hover {
          transform: translateY(-5px);
          box-shadow: 0 1rem 3rem rgba(0,0,0,.1) !important;
        }
        .transition {
          transition: all 0.3s ease;
        }
      `}</style>
    </div>
  );
};

export default LayananBK;
