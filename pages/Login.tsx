import React, { useState } from 'react';

/**
 * Login component for BK application
 */
const Login: React.FC = () => {
  const [role, setRole] = useState<'admin' | 'siswa'>('admin');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [nisn, setNisn] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (role === 'admin') {
      // Default admin password is 'Lajoroni234'
      // In a real app, this would check against an API
      const defaultPass = 'Lajoroni234';
      if (username.toLowerCase() === 'admin' && password === defaultPass) {
        alert('Login Admin Berhasil!');
        localStorage.setItem('userRole', 'admin');
        window.location.href = '#dashboard'; // Mock routing
      } else {
        setError(username.toLowerCase() !== 'admin' ? 'Username harus "admin"' : 'Password Admin salah.');
      }
    } else {
      // Siswa login logic (mock)
      if (nisn && password === nisn) {
        alert('Login Siswa Berhasil!');
        localStorage.setItem('userRole', 'siswa');
        localStorage.setItem('currentUser', JSON.stringify({ Nama: 'Siswa Demo', NISN: nisn }));
        window.location.href = '#siswa-dashboard';
      } else {
        setError('NISN atau Password salah. Gunakan NISN sebagai password.');
      }
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center align-items-center vh-100">
        <div className="col-md-4">
          <div className="card shadow-lg border-0">
            <div className="card-body p-5">
              <div className="text-center mb-4">
                <i className="fas fa-graduation-cap fa-3x text-primary mb-3"></i>
                <h3 className="fw-bold">Login BK</h3>
                <p className="text-muted">Aplikasi Layanan BK</p>
              </div>

              {error && (
                <div className="alert alert-danger small py-2" role="alert">
                  <i className="fas fa-exclamation-circle me-2"></i>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label small fw-bold">Masuk Sebagai</label>
                                    <select
                                        className="form-select"
                                        value={role}
                                        onChange={(e) => setRole(e.target.value as 'admin' | 'siswa')}
                                    >
                                        <option value="admin">Admin BK</option>
                                        <option value="siswa">Siswa</option>
                                    </select>
                                </div>

                                {role === 'admin' ? (
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold">Username</label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-light border-end-0">
                                                <i className="fas fa-user text-muted"></i>
                                            </span>
                                            <input
                                                type="text"
                                                className="form-control bg-light border-start-0"
                                                placeholder="Username admin"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold">NISN</label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-light border-end-0">
                                                <i className="fas fa-id-card text-muted"></i>
                                            </span>
                                            <input
                                                type="text"
                                                className="form-control bg-light border-start-0"
                                                placeholder="Masukkan NISN Anda"
                                                value={nisn}
                                                onChange={(e) => setNisn(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="mb-4">
                                    <label className="form-label small fw-bold">Password</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light border-end-0">
                                            <i className="fas fa-lock text-muted"></i>
                                        </span>
                                        <input
                                            type="password"
                                            className="form-control bg-light border-start-0"
                                            placeholder="Masukkan password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <button type="submit" className="btn btn-primary w-100 py-2 fw-bold shadow-sm">
                                    Login Sekarang
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
