import React from 'react';

// Dashboard component
const Dashboard: React.FC = () => {
  // Data dummy untuk tampilan
  const stats = [
    { label: 'Total Siswa', value: '1,240', icon: 'fa-users', color: 'primary' },
    { label: 'Layanan Bulan Ini', value: '45', icon: 'fa-hand-holding-heart', color: 'success' },
    { label: 'Siswa Bermasalah', value: '12', icon: 'fa-exclamation-triangle', color: 'warning' },
    { label: 'Konseling Selesai', value: '38', icon: 'fa-check-circle', color: 'info' },
  ];

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">Dashboard Admin</h2>
        <div className="text-muted small">
          <i className="fas fa-calendar-alt me-2"></i>
          {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="row g-3 mb-4">
        {stats.map((stat, index) => (
          <div key={index} className="col-md-3">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className={`bg-${stat.color} bg-opacity-10 p-3 rounded-3 me-3`}>
                    <i className={`fas ${stat.icon} text-${stat.color} fs-4`}></i>
                  </div>
                  <div>
                    <h6 className="text-muted mb-1 small">{stat.label}</h6>
                    <h4 className="fw-bold mb-0">{stat.value}</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4">
        {/* Recent Activity */}
        <div className="col-md-8">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-0 py-3">
              <h5 className="fw-bold mb-0">Aktivitas Layanan Terbaru</h5>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th className="border-0 ps-4">Siswa</th>
                      <th className="border-0">Jenis Layanan</th>
                      <th className="border-0">Tanggal</th>
                      <th className="border-0">Status</th>
                      <th className="border-0">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="ps-4">
                        <div className="fw-bold">Budi Santoso</div>
                        <div className="small text-muted">X-IPA-1</div>
                      </td>
                      <td>Bimbingan Belajar</td>
                      <td>04 Mei 2026</td>
                      <td><span className="badge bg-success bg-opacity-10 text-success">Selesai</span></td>
                      <td><button className="btn btn-sm btn-light"><i className="fas fa-eye"></i></button></td>
                    </tr>
                    <tr>
                      <td className="ps-4">
                        <div className="fw-bold">Ani Wijaya</div>
                        <div className="small text-muted">XI-IPS-2</div>
                      </td>
                      <td>Konseling Individu</td>
                      <td>04 Mei 2026</td>
                      <td><span className="badge bg-warning bg-opacity-10 text-warning">Pending</span></td>
                      <td><button className="btn btn-sm btn-light"><i className="fas fa-eye"></i></button></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="col-md-4">
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white border-0 py-3">
              <h5 className="fw-bold mb-0">Aksi Cepat</h5>
            </div>
            <div className="card-body">
              <div className="d-grid gap-2">
                <button className="btn btn-primary text-start p-3">
                  <i className="fas fa-plus-circle me-2"></i> Tambah Layanan Baru
                </button>
                <button className="btn btn-outline-primary text-start p-3">
                  <i className="fas fa-file-export me-2"></i> Export Laporan Bulanan
                </button>
                <button className="btn btn-outline-secondary text-start p-3">
                  <i className="fas fa-cog me-2"></i> Pengaturan Sistem
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
