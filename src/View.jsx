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
    <div className="min-h-screen bg-[#e7f0e6] dark:bg-[#18181b] flex flex-col items-center justify-center transition-colors duration-300">
      <div className="w-full max-w-5xl mx-auto rounded-2xl shadow-lg bg-white dark:bg-[#23232b] p-0 md:p-8 mt-8 mb-8">
        <nav className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex gap-4">
            <a href="/" className="font-semibold text-lg text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition">Analytics</a>
            <a href="/view" className="font-semibold text-lg text-gray-900 dark:text-gray-100">Visualización</a>
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Visualización de Datos</h1>
          {/* Card de visitas */}
          <section className="bg-gray-100 dark:bg-[#18181b] rounded-xl p-4 md:p-6 flex flex-col gap-2 shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Visitas por URL</h2>
            {loading && <p className="text-base text-gray-500 dark:text-gray-400">Cargando datos...</p>}
            {error && (
              <div className="flex flex-col items-center justify-center py-8">
                <span className="text-4xl text-red-400 mb-2">&#9888;</span>
                <span className="font-semibold text-gray-700 dark:text-gray-200 mb-1">Error al obtener datos</span>
                <span className="text-gray-500 dark:text-gray-400 text-sm">No pudimos cargar las visitas. Por favor, inténtalo de nuevo más tarde.</span>
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
              <div className="overflow-x-auto mt-2">
                <table className="min-w-full bg-white dark:bg-[#23232b] rounded shadow border border-gray-200 dark:border-gray-700">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-[#18181b] text-gray-900 dark:text-gray-100">
                      <th className="py-3 px-4 text-left">URL</th>
                      <th className="py-3 px-4">Visitas</th>
                      <th className="py-3 px-4">Estado</th>
                      <th className="py-3 px-4">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(visitasPorUrl).map(([url, count]) => (
                      <tr key={url} className="border-b last:border-b-0 border-gray-200 dark:border-gray-700">
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
                            className={`bg-gray-200 dark:bg-[#23232b] text-gray-700 dark:text-gray-200 font-bold py-1 px-4 rounded shadow border border-gray-300 dark:border-gray-700 transition-opacity ${checking[url] ? 'opacity-60 cursor-not-allowed' : 'hover:opacity-90'}`}
                          >
                            {checking[url] ? 'Verificando...' : 'Verificar estado'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
} 