'use client';

import * as React from 'react';
import { useEffect, useState, FormEvent } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { callGASAction, getGASStats } from './actions';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
const instrumentData: Record<string, { title: string, questions: any[] }> = {
  'dcm': {
    title: 'Daftar Cek Masalah (DCM)',
    questions: [
      { id: 'q1', text: 'Sering merasa pusing atau sakit kepala?', type: 'radio', options: ['Ya', 'Tidak'] },
      { id: 'q2', text: 'Merasa sulit berkonsentrasi saat belajar?', type: 'radio', options: ['Ya', 'Tidak'] },
      { id: 'q3', text: 'Kurang percaya diri saat tampil di depan umum?', type: 'radio', options: ['Ya', 'Tidak'] },
      { id: 'q4', text: 'Sering merasa cemas tanpa alasan yang jelas?', type: 'radio', options: ['Ya', 'Tidak'] },
      { id: 'q5', text: 'Kesulitan dalam mengatur waktu belajar?', type: 'radio', options: ['Ya', 'Tidak'] },
    ]
  },
  'gaya-belajar': {
    title: 'Gaya Belajar',
    questions: [
      { id: 'q1', text: 'Saya lebih mudah mengingat sesuatu jika saya...', type: 'radio', options: ['Melihat gambarnya', 'Mendengar penjelasannya', 'Mempraktekkannya langsung'] },
      { id: 'q2', text: 'Saat membaca buku, saya biasanya...', type: 'radio', options: ['Fokus pada teks dan ilustrasi', 'Membaca dengan bersuara', 'Sambil menggerakkan jari atau tubuh'] },
      { id: 'q3', text: 'Dalam diskusi kelompok, saya cenderung...', type: 'radio', options: ['Melihat ekspresi wajah teman', 'Mendengarkan dengan seksama', 'Banyak menggunakan gerakan tangan'] },
    ]
  },
  'minat-bakat': {
    title: 'Tes Minat Bakat',
    questions: [
      { id: 'q1', text: 'Bidang apa yang paling kamu sukai?', type: 'radio', options: ['Seni', 'Olahraga', 'Sains', 'Sosial', 'Teknologi'] },
      { id: 'q2', text: 'Apa cita-citamu di masa depan?', type: 'text' },
      { id: 'q3', text: 'Apakah kamu lebih suka bekerja sendiri atau dalam tim?', type: 'radio', options: ['Sendiri', 'Tim'] },
      { id: 'q4', text: 'Hobi apa yang paling sering kamu lakukan?', type: 'text' },
    ]
  }
};

const backendTypeMap: Record<string, string> = {
  'dcm': 'DCM',
  'gaya-belajar': 'GayaBelajar',
  'minat-bakat': 'MinatBakat'
};

// --- UI App ---
export default function MySiBKApp() {
  const [view, setView] = useState<'login' | 'dashboard' | 'instrument'>('login');
  const [activeInstrument, setActiveInstrument] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [message, setMessage] = useState('');

  // Login State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      setView('dashboard');
      fetchStats();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchStats = async () => {
    try {
      const result = await getGASStats();
      if (result.success) setStats(result.data);
    } catch (err) {
      console.error('Stats error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    setError('');
    try {
      const result = await callGASAction({ action: 'login', username, password });
      if (result.success) {
        localStorage.setItem('user', JSON.stringify(result.user));
        setUser(result.user);
        setView('dashboard');
        fetchStats();
      } else {
        setError(result.message || 'Login gagal');
      }
    } catch (err) {
      setError('Terjadi kesalahan koneksi.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setView('login');
    setStats(null);
    setUsername('');
    setPassword('');
  };

  const openInstrument = (type: string) => {
    setActiveInstrument(type);
    setResponses({});
    setMessage('');
    setView('instrument');
  };

  const handleInstrumentSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user || !activeInstrument) return;
    setActionLoading(true);
    setMessage('');
    try {
      const result = await callGASAction({
        action: 'submitInstrument',
        username: user.username,
        instrumentType: backendTypeMap[activeInstrument] || activeInstrument,
        responses,
      });
      if (result.success) {
        setMessage('Berhasil dikirim! Kembali ke dashboard...');
        setTimeout(() => {
          setView('dashboard');
          fetchStats();
        }, 2000);
      } else {
        setMessage('Gagal: ' + result.message);
      }
    } catch (err) {
      setMessage('Terjadi kesalahan saat mengirim.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading && view !== 'login') return <div className="p-8 text-center">Memuat Aplikasi...</div>;

  // --- 1. LOGIN VIEW ---
  if (view === 'login') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
        <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
          <h1 className="mb-6 text-center text-3xl font-bold text-blue-600">MySiBK</h1>
          {error && <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-100">{error}</div>}
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
            <button
              type="submit"
              disabled={actionLoading}
              className="w-full rounded-lg bg-blue-600 p-3 font-bold text-white hover:bg-blue-700 disabled:bg-blue-300 transition"
            >
              {actionLoading ? 'Masuk...' : 'Masuk'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- 2. INSTRUMENT VIEW ---
  if (view === 'instrument' && activeInstrument) {
    const data = instrumentData[activeInstrument];
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="mx-auto max-w-3xl rounded-xl bg-white p-6 shadow-md">
          <button onClick={() => setView('dashboard')} className="mb-4 text-blue-600 hover:underline">← Kembali</button>
          <h1 className="mb-8 text-2xl font-bold text-gray-800">{data.title}</h1>
          {message && <div className={`mb-6 p-4 rounded-lg text-center ${message.includes('Gagal') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>{message}</div>}
          <form onSubmit={handleInstrumentSubmit} className="space-y-6">
            {data.questions.map((q: any, idx: number) => (
              <div key={q.id} className="space-y-2">
                <p className="font-medium text-gray-700">{idx + 1}. {q.text}</p>
                {q.type === 'radio' ? (
                  <div className="space-y-2 pl-4">
                    {q.options.map((opt: string) => (
                      <label key={opt} className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name={q.id}
                          value={opt}
                          required
                          checked={responses[q.id] === opt}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setResponses({ ...responses, [q.id]: e.target.value })}
                          className="h-4 w-4 text-blue-600"
                        />
                        <span className="text-gray-600">{opt}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <input
                    type="text"
                    required
                    value={responses[q.id] || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setResponses({ ...responses, [q.id]: e.target.value })}
                    className="w-full rounded-lg border p-2 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}
              </div>
            ))}
            <button type="submit" disabled={actionLoading} className="w-full rounded-lg bg-blue-600 p-3 font-bold text-white hover:bg-blue-700 disabled:bg-blue-300 transition">
              {actionLoading ? 'Mengirim...' : 'Kirim Jawaban'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- 3. DASHBOARD VIEW ---
  const dcmData = stats?.DCM?.percentages ? Object.entries(stats.DCM.percentages).map(([key, value]) => ({ name: key, percentage: value })) : [];
  const gayaBelajarData = stats?.GayaBelajar?.percentages ? Object.entries(stats.GayaBelajar.percentages).map(([key, value]) => ({ name: key, value })) : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">MySiBK</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm hidden md:block">Halo, <b>{user?.username}</b></span>
          <button onClick={handleLogout} className="text-sm font-medium text-red-600 hover:bg-red-50 px-3 py-1 rounded-md border border-red-100">Keluar</button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <MenuCard title="DCM" desc="Daftar Cek Masalah" onClick={() => openInstrument('dcm')} color="bg-red-50" />
          <MenuCard title="Minat Bakat" desc="Tes Potensi Diri" onClick={() => openInstrument('minat-bakat')} color="bg-green-50" />
          <MenuCard title="Gaya Belajar" desc="Analisis Cara Belajar" onClick={() => openInstrument('gaya-belajar')} color="bg-blue-50" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h3 className="text-gray-700 font-bold mb-4 text-sm uppercase">Statistik Masalah (DCM)</h3>
            <div className="h-64">
              {dcmData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dcmData} layout="vertical">
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" width={80} fontSize={10} />
                    <Tooltip />
                    <Bar dataKey="percentage" fill="#ef4444" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                  Belum ada data.
                </div>
              )}
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h3 className="text-gray-700 font-bold mb-4 text-sm uppercase">Gaya Belajar</h3>
            <div className="h-64">
              {gayaBelajarData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart><Pie
                    data={gayaBelajarData}
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    label={(p: any) => p.name}
                    dataKey="value"
                  >
                    {gayaBelajarData.map((_: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                  Belum ada data.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function MenuCard({ title, desc, onClick, color }: { title: string, desc: string, onClick: () => void, color: string }) {
  return (
    <div
      onClick={onClick}
      className={`block rounded-xl p-6 shadow-sm transition hover:shadow-md border border-gray-100 cursor-pointer ${color}`}
    >
      <h3 className="mb-1 text-lg font-bold text-gray-800">{title}</h3>
      <p className="text-xs text-gray-600">{desc}</p>
    </div>
  );
}