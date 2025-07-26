import { useState, useEffect } from 'react';

export default function App() {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dark, setDark] = useState(false);

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

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [dark]);

  return (
    <div className="min-h-screen flex flex-col items-center py-10 px-2 bg-bg-light dark:bg-bg-dark transition-colors duration-300">
      <nav className="w-full flex justify-between items-center max-w-3xl mb-8">
        <div className="flex gap-2">
          <a href="/" className="px-4 py-2 rounded font-semibold text-primary-light dark:text-primary-dark hover:bg-accent-light dark:hover:bg-accent-dark transition">Analytics</a>
          <a href="/view" className="px-4 py-2 rounded font-semibold text-primary-light dark:text-primary-dark hover:bg-accent-light dark:hover:bg-accent-dark transition">Visualización</a>
        </div>
        <button
          className="px-3 py-1 rounded bg-accent-light dark:bg-accent-dark text-xs font-bold text-primary-light dark:text-primary-dark border border-primary-light dark:border-primary-dark transition"
          onClick={() => setDark(d => !d)}
          aria-label="Cambiar modo de color"
        >
          {dark ? '🌙 Modo Oscuro' : '☀️ Modo Claro'}
        </button>
      </nav>
      <main className="w-full max-w-2xl bg-card-light dark:bg-card-dark rounded-xl shadow p-8 flex flex-col items-center transition-colors duration-300">
        <h1 className="text-3xl font-bold text-primary-light dark:text-primary-dark mb-4 text-center">Mis Analytics Personales</h1>
        <h2 className="text-lg font-semibold text-primary-light dark:text-primary-dark mb-2">Script para instalar:</h2>
        <pre className="bg-accent-light dark:bg-accent-dark rounded px-4 py-3 mb-6 w-full overflow-x-auto text-base"><code>{`<script src=\"https://monitoring-beige.vercel.app/tracker.js\"></script>`}</code></pre>
        <h2 className="text-lg font-semibold text-primary-light dark:text-primary-dark mb-2">Últimas visitas:</h2>
        {loading && <p className="text-base text-gray-500 dark:text-gray-400">Cargando datos...</p>}
        {error && <div className="w-full bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded mb-4 text-center">{error}</div>}
        {!loading && !error && visits.length === 0 && (
          <div className="w-full bg-yellow-100 dark:bg-yellow-900 border border-yellow-400 dark:border-yellow-700 text-yellow-700 dark:text-yellow-200 px-4 py-3 rounded mb-4 text-center">No se detectan webs.</div>
        )}
        {!loading && !error && visits.length > 0 && (
          <ul className="w-full mt-2 space-y-2">
            {visits.slice(0, 10).map((v, i) => (
              <li key={i} className="bg-accent-light dark:bg-accent-dark border border-accent-light dark:border-accent-dark rounded px-4 py-2 flex flex-col md:flex-row md:items-center md:justify-between text-sm">
                <span className="font-semibold text-primary-light dark:text-primary-dark break-all">{v.url}</span>
                <span className="text-gray-500 dark:text-gray-400">{new Date(v.date).toLocaleString()}</span>
                <span className="text-gray-400 dark:text-gray-500">IP: {v.ip}</span>
                <span className="text-gray-400 dark:text-gray-500">Duración: {v.duration}s</span>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
} 