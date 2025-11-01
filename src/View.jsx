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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-md bg-opacity-90">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-lg">
                <span className="material-icons text-white text-2xl">analytics</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Analytics Dashboard</h1>
                <p className="text-xs text-gray-500">Monitoreo en tiempo real</p>
              </div>
            </div>
            <nav className="flex items-center space-x-2">
              <a className="bg-white border-2 border-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:border-blue-500 hover:text-blue-600 transition-all flex items-center space-x-2 font-medium" href="/">
                <span className="material-icons text-lg">dashboard</span>
                <span>Dashboard</span>
              </a>
              <a className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all flex items-center space-x-2 font-medium shadow-sm" href="/view">
                <span className="material-icons text-lg">bar_chart</span>
                <span>Análisis</span>
              </a>
            </nav>
          </div>
        </div>
      </header>
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-1">Análisis de URLs</h2>
            <p className="text-gray-600">Estadísticas agrupadas por sitio web</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center space-x-2">
                <span className="material-icons text-blue-600">insert_chart</span>
                <h3 className="text-lg font-bold text-gray-900">Visitas por URL</h3>
              </div>
              <p className="text-gray-500 text-sm mt-1">Cantidad de visitas agrupadas por sitio web</p>
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
                <div className="space-y-3">
                  {Object.entries(visitasPorUrl)
                    .sort((a, b) => b[1] - a[1])
                    .map(([url, count]) => {
                      const percentage = (count / visits.length) * 100;
                      return (
                        <div key={url} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-all border border-gray-200">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-3 flex-1 min-w-0">
                              <span className="material-icons text-blue-600">language</span>
                              <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 font-medium truncate">
                                {url}
                              </a>
                            </div>
                            <div className="flex items-center space-x-4 ml-4">
                              <div className="text-right">
                                <div className="flex items-center space-x-2">
                                  <span className="text-2xl font-bold text-gray-900">{count}</span>
                                  <span className="text-xs text-gray-500">visitas</span>
                                </div>
                                <p className="text-xs text-gray-500">{percentage.toFixed(1)}% del total</p>
                              </div>
                              <button
                                onClick={() => verificarSitio(url)}
                                disabled={checking[url]}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
                              >
                                <span className="material-icons text-sm">{checking[url] ? 'hourglass_empty' : 'check_circle'}</span>
                                <span>{checking[url] ? 'Verificando...' : 'Verificar'}</span>
                              </button>
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2.5 rounded-full transition-all" style={{ width: `${percentage}%` }}></div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {status[url] === 'activo' && (
                              <span className="inline-flex items-center space-x-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                                <span className="material-icons" style={{ fontSize: '14px' }}>check_circle</span>
                                <span>Activo</span>
                              </span>
                            )}
                            {status[url] === 'inactivo' && (
                              <span className="inline-flex items-center space-x-1 bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold">
                                <span className="material-icons" style={{ fontSize: '14px' }}>cancel</span>
                                <span>Inactivo</span>
                              </span>
                            )}
                            {!status[url] && (
                              <span className="inline-flex items-center space-x-1 bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-xs font-semibold">
                                <span className="material-icons" style={{ fontSize: '14px' }}>help</span>
                                <span>Sin verificar</span>
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
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