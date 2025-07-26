import { useEffect, useState } from 'react';

export default function View() {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState({});
  const [checking, setChecking] = useState({});
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

  const visitasPorUrl = visits.reduce((acc, v) => {
    acc[v.url] = (acc[v.url] || 0) + 1;
    return acc;
  }, {});

  const verificarSitio = async (url) => {
    setChecking(prev => ({ ...prev, [url]: true }));
    try {
      let res = await fetch(url, { method: 'HEAD', mode: 'no-cors' });
      setStatus(prev => ({ ...prev, [url]: 'activo' }));
    } catch {
      setStatus(prev => ({ ...prev, [url]: 'inactivo' }));
    }
    setChecking(prev => ({ ...prev, [url]: false }));
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-10 px-2 bg-bg-light dark:bg-bg-dark transition-colors duration-300">
      <nav className="w-full flex justify-between items-center max-w-4xl mb-8">
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
      <main className="w-full max-w-4xl bg-card-light dark:bg-card-dark rounded-xl shadow p-8 flex flex-col items-center transition-colors duration-300">
        <h1 className="text-3xl font-bold text-primary-light dark:text-primary-dark mb-4 text-center">Visualización de Datos</h1>
        {loading && <p className="text-base text-gray-500 dark:text-gray-400">Cargando datos...</p>}
        {error && <div className="w-full bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded mb-4 text-center">{error}</div>}
        {!loading && !error && visits.length === 0 && (
          <div className="w-full bg-yellow-100 dark:bg-yellow-900 border border-yellow-400 dark:border-yellow-700 text-yellow-700 dark:text-yellow-200 px-4 py-3 rounded mb-4 text-center">No se detectan webs.</div>
        )}
        {!loading && !error && visits.length > 0 && (
          <div className="w-full mt-2">
            <h2 className="text-lg font-semibold text-primary-light dark:text-primary-dark mb-2">Visitas por URL</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-card-light dark:bg-card-dark rounded shadow border border-accent-light dark:border-accent-dark">
                <thead>
                  <tr className="bg-accent-light dark:bg-accent-dark text-primary-light dark:text-primary-dark">
                    <th className="py-3 px-4 text-left">URL</th>
                    <th className="py-3 px-4">Visitas</th>
                    <th className="py-3 px-4">Estado</th>
                    <th className="py-3 px-4">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(visitasPorUrl).map(([url, count]) => (
                    <tr key={url} className="border-b last:border-b-0 border-accent-light dark:border-accent-dark">
                      <td className="py-2 px-4 break-all">{url}</td>
                      <td className="py-2 px-4 text-center">{count}</td>
                      <td className="py-2 px-4 text-center">
                        {status[url] === 'activo' && <span className="text-green-600 dark:text-green-400 font-bold">Activo</span>}
                        {status[url] === 'inactivo' && <span className="text-red-600 dark:text-red-400 font-bold">Inactivo</span>}
                        {!status[url] && <span className="text-gray-500 dark:text-gray-400">Sin verificar</span>}
                      </td>
                      <td className="py-2 px-4 text-center">
                        <button
                          onClick={() => verificarSitio(url)}
                          disabled={checking[url]}
                          className={`bg-accent-light dark:bg-accent-dark text-primary-light dark:text-primary-dark font-bold py-1 px-4 rounded shadow border border-primary-light dark:border-primary-dark transition-opacity ${checking[url] ? 'opacity-60 cursor-not-allowed' : 'hover:opacity-90'}`}
                        >
                          {checking[url] ? 'Verificando...' : 'Verificar estado'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
} 