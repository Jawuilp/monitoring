import { useEffect, useState } from 'react';

export default function View() {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState({});
  const [checking, setChecking] = useState({});

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
    <div className="min-h-screen flex flex-col items-center justify-start bg-gray-50 py-10 px-2">
      <h1 className="text-4xl font-bold text-blue-600 mb-6 text-center">Visualización de Datos</h1>
      {loading && <p className="text-lg text-gray-600">Cargando datos...</p>}
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">Error: {error}</div>}
      {!loading && !error && visits.length === 0 && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">No se detectan webs.</div>
      )}
      {!loading && !error && visits.length > 0 && (
        <div className="w-full max-w-4xl">
          <h2 className="text-2xl font-semibold text-blue-700 mb-4">Visitas por URL</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded shadow">
              <thead>
                <tr className="bg-gradient-to-r from-blue-600 to-blue-400 text-white">
                  <th className="py-3 px-4 text-left">URL</th>
                  <th className="py-3 px-4">Visitas</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4">Acción</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(visitasPorUrl).map(([url, count]) => (
                  <tr key={url} className="border-b last:border-b-0">
                    <td className="py-2 px-4 break-all">{url}</td>
                    <td className="py-2 px-4 text-center">{count}</td>
                    <td className="py-2 px-4 text-center">
                      {status[url] === 'activo' && <span className="text-green-600 font-bold">Activo</span>}
                      {status[url] === 'inactivo' && <span className="text-red-600 font-bold">Inactivo</span>}
                      {!status[url] && <span className="text-gray-500">Sin verificar</span>}
                    </td>
                    <td className="py-2 px-4 text-center">
                      <button
                        onClick={() => verificarSitio(url)}
                        disabled={checking[url]}
                        className={`bg-gradient-to-r from-blue-600 to-blue-400 text-white font-bold py-1 px-4 rounded shadow transition-opacity ${checking[url] ? 'opacity-60 cursor-not-allowed' : 'hover:opacity-90'}`}
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
    </div>
  );
} 