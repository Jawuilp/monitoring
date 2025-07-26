import { useState, useEffect } from 'react';

export default function App() {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dark, setDark] = useState(false);
  const script = '<script src="https://monitoring-beige.vercel.app/tracker.js"></script>';
  const [copied, setCopied] = useState(false);

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

  const handleCopy = () => {
    navigator.clipboard.writeText(script);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="min-h-screen bg-[#e7f0e6] dark:bg-[#18181b] flex flex-col items-center justify-center transition-colors duration-300">
      <div className="w-full max-w-4xl mx-auto rounded-2xl shadow-lg bg-white dark:bg-[#23232b] p-0 md:p-8 mt-8 mb-8">
        <nav className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex gap-4">
            <a href="/" className="font-semibold text-lg text-gray-900 dark:text-gray-100">Analytics</a>
            <a href="/view" className="font-semibold text-lg text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition">Visualización</a>
          </div>
          <button
            className="px-3 py-1 rounded bg-gray-100 dark:bg-[#23232b] text-xs font-bold text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-700 transition"
            onClick={() => setDark(d => !d)}
            aria-label="Cambiar modo de color"
          >
            {dark ? '🌙 Modo Oscuro' : '☀️ Modo Claro'}
          </button>
        </nav>
        <main className="p-4 md:p-8 flex flex-col gap-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Mis Analytics Personales</h1>
          {/* Card Script */}
          <section className="bg-gray-100 dark:bg-[#18181b] rounded-xl p-4 md:p-6 flex flex-col gap-2 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Script para instalar</h2>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-blue-600 dark:text-blue-400 text-sm font-medium px-2 py-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16h8M8 12h8m-7 8h6a2 2 0 002-2V7a2 2 0 00-2-2h-6a2 2 0 00-2 2v11a2 2 0 002 2z" /></svg>
                {copied ? 'Copiado' : 'Copiar'}
              </button>
            </div>
            <pre className="bg-gray-200 dark:bg-[#23232b] rounded px-4 py-3 w-full overflow-x-auto text-base text-gray-800 dark:text-gray-200"><code>{script}</code></pre>
          </section>
          {/* Card Últimas visitas */}
          <section className="bg-gray-100 dark:bg-[#18181b] rounded-xl p-4 md:p-6 flex flex-col gap-2 shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Últimas visitas</h2>
            {loading && <p className="text-base text-gray-500 dark:text-gray-400">Cargando datos...</p>}
            {error && (
              <div className="flex flex-col items-center justify-center py-8">
                <span className="text-4xl text-red-400 mb-2">&#9888;</span>
                <span className="font-semibold text-gray-700 dark:text-gray-200 mb-1">Error al obtener datos</span>
                <span className="text-gray-500 dark:text-gray-400 text-sm">No pudimos cargar las últimas visitas. Por favor, inténtalo de nuevo más tarde.</span>
              </div>
            )}
            {!loading && !error && visits.length === 0 && (
              <div className="flex flex-col items-center justify-center py-8">
                <span className="text-4xl text-yellow-400 mb-2">&#9888;</span>
                <span className="font-semibold text-gray-700 dark:text-gray-200 mb-1">No se detectan webs</span>
                <span className="text-gray-500 dark:text-gray-400 text-sm">Aún no se han registrado visitas.</span>
              </div>
            )}
            {!loading && !error && visits.length > 0 && (
              <ul className="w-full mt-2 space-y-2">
                {visits.slice(0, 10).map((v, i) => (
                  <li key={i} className="bg-white dark:bg-[#23232b] border border-gray-200 dark:border-gray-700 rounded px-4 py-2 flex flex-col md:flex-row md:items-center md:justify-between text-sm shadow-sm">
                    <span className="font-semibold text-gray-900 dark:text-gray-100 break-all">{v.url}</span>
                    <span className="text-gray-500 dark:text-gray-400">{new Date(v.date).toLocaleString()}</span>
                    <span className="text-gray-400 dark:text-gray-500">IP: {v.ip}</span>
                    <span className="text-gray-400 dark:text-gray-500">Duración: {v.duration}s</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </main>
      </div>
    </div>
  );
} 