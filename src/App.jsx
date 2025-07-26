import { useState, useEffect } from 'react';

export default function App() {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/collect?action=get')
      .then(res => {
        if (!res.ok) throw new Error('Error al obtener datos');
        return res.json();
      })
      .then(data => {
        setVisits(Array.isArray(data) ? data : (data.visits || []));
        setLoading(false);
      })
      .catch(e => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-2">
      <nav className="w-full flex justify-start gap-4 px-8 mb-8">
        <a href="/" className="bg-blue-600 text-white font-bold py-2 px-6 rounded shadow hover:bg-blue-700 transition">Analytics</a>
        <a href="/view" className="bg-blue-200 text-blue-800 font-bold py-2 px-6 rounded shadow hover:bg-blue-300 transition">Visualización</a>
      </nav>
      <main className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
        <h1 className="text-4xl font-extrabold text-blue-600 mb-4 text-center">Mis Analytics Personales</h1>
        <h2 className="text-2xl font-semibold text-blue-700 mb-2">Script para instalar:</h2>
        <pre className="bg-gray-100 rounded px-4 py-3 mb-6 w-full overflow-x-auto text-base"><code>{`<script src=\"https://monitoring-beige.vercel.app/tracker.js\"></script>`}</code></pre>
        <h2 className="text-2xl font-semibold text-blue-700 mb-2">Últimas visitas:</h2>
        {loading && <p className="text-lg text-gray-600">Cargando datos...</p>}
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">Error: {error}</div>}
        {!loading && !error && visits.length === 0 && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">No se detectan webs.</div>
        )}
        {!loading && !error && visits.length > 0 && (
          <ul className="w-full mt-2 space-y-2">
            {visits.slice(0, 10).map((v, i) => (
              <li key={i} className="bg-blue-50 border border-blue-200 rounded px-4 py-2 flex flex-col md:flex-row md:items-center md:justify-between text-sm">
                <span className="font-semibold text-blue-800 break-all">{v.url}</span>
                <span className="text-gray-600">{new Date(v.date).toLocaleString()}</span>
                <span className="text-gray-500">IP: {v.ip}</span>
                <span className="text-gray-500">Duración: {v.duration}s</span>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
} 