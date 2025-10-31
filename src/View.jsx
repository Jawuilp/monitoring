import { useEffect, useState } from 'react';

export default function View() {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errorDetail, setErrorDetail] = useState(null);
  const [status, setStatus] = useState({});
  const [checking, setChecking] = useState({});

  useEffect(() => {
    const apiUrl = window.location.hostname === 'localhost'
      ? '/api/event'
      : 'https://toolting.vercel.app/api/event';
    
    fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then(async res => {
        if (!res.ok) {
          let detail = '';
          try {
            const data = await res.json();
            detail = data.error || data.detail || JSON.stringify(data);
          } catch {
            detail = await res.text();
          }
          throw new Error(detail || `Error HTTP ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        console.log('Datos recibidos:', data);
        setVisits(Array.isArray(data) ? data : (data.visits || []));
        setLoading(false);
      })
      .catch(e => {
        console.error('Error al obtener visitas:', e);
        if (e.message.includes('Failed to fetch') || e.message.includes('NetworkError')) {
          setError('Error de conexión');
          setErrorDetail('No se pudo conectar con el servidor. Verifica tu conexión o que el servidor esté activo.');
        } else if (e.message.includes('CORS')) {
          setError('Error de permisos CORS');
          setErrorDetail('El servidor no permite solicitudes desde este dominio. Contacta al administrador.');
        } else {
          setError('Error al obtener datos');
          setErrorDetail(e.message);
        }
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
    <div className="min-h-screen bg-gray-100 font-['Inter']">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-900">Analytics</h1>
          <nav>
            <a className="text-base font-medium text-gray-500 hover:text-gray-900" href="/">Analytics</a>
          </nav>
        </div>
      </header>
      <main className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold leading-tight text-gray-900">Visualización de Datos</h2>
          </div>
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Visitas por URL</h3>
            </div>
            <div className="p-6">
              {loading && (
                <div className="flex items-center justify-center text-center text-gray-500">
                  <div className="flex flex-col items-center">
                    <span className="material-icons text-5xl text-gray-400 mb-2">hourglass_empty</span>
                    <p className="font-medium">Cargando datos...</p>
                  </div>
                </div>
              )}
              {error && (
                <div className="flex items-center justify-center text-center text-gray-500">
                  <div className="flex flex-col items-center">
                    <span className="material-icons text-5xl text-red-400 mb-2">error_outline</span>
                    <p className="font-medium">{error}</p>
                    <p className="text-sm">No pudimos cargar las visitas. Por favor, inténtalo de nuevo más tarde.</p>
                    {errorDetail && (
                      <pre className="bg-red-50 text-xs text-red-700 rounded p-2 mt-2 max-w-xl overflow-x-auto">{errorDetail}</pre>
                    )}
                  </div>
                </div>
              )}
              {!loading && !error && visits.length === 0 && (
                <div className="flex items-center justify-center text-center text-gray-500">
                  <div className="flex flex-col items-center">
                    <span className="material-icons text-5xl text-yellow-400 mb-2">info</span>
                    <p className="font-medium">No se detectan webs</p>
                    <p className="text-sm">Aún no se han registrado visitas.</p>
                  </div>
                </div>
              )}
              {!loading && !error && visits.length > 0 && (
                <div className="overflow-x-auto mt-2">
                  <table className="min-w-full bg-white rounded shadow border border-gray-200">
                    <thead>
                      <tr className="bg-gray-100 text-gray-900">
                        <th className="py-3 px-4 text-left">URL</th>
                        <th className="py-3 px-4">Visitas</th>
                        <th className="py-3 px-4">Estado</th>
                        <th className="py-3 px-4">Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(visitasPorUrl).map(([url, count]) => (
                        <tr key={url} className="border-b last:border-b-0 border-gray-200">
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
                              className={`bg-gray-200 text-gray-700 font-bold py-1 px-4 rounded shadow border border-gray-300 transition-opacity ${checking[url] ? 'opacity-60 cursor-not-allowed' : 'hover:opacity-90'}`}
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
            </div>
          </div>
        </div>
      </main>
      {/* Material Icons CDN */}
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
    </div>
  );
} 