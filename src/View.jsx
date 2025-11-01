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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <header className="bg-slate-800/50 border-b border-slate-700/50 sticky top-0 z-50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-2.5 rounded-xl shadow-lg shadow-cyan-500/20">
                <span className="material-icons text-white text-2xl">analytics</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Analytics Dashboard</h1>
                <p className="text-xs text-slate-400">Monitoreo en tiempo real</p>
              </div>
            </div>
            <nav className="flex items-center space-x-2">
              <a className="bg-slate-700/50 border border-slate-600 text-slate-300 px-4 py-2 rounded-lg hover:bg-slate-600/50 hover:text-white transition-all flex items-center space-x-2 font-medium" href="/">
                <span className="material-icons text-lg">dashboard</span>
                <span>Dashboard</span>
              </a>
              <a className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all flex items-center space-x-2 font-medium shadow-lg shadow-cyan-500/30" href="/view">
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
            <h2 className="text-3xl font-bold text-white mb-1">Análisis de URLs</h2>
            <p className="text-slate-400">Estadísticas agrupadas por sitio web</p>
          </div>
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-xl border border-slate-700/50 overflow-hidden">
            <div className="p-6 border-b border-slate-700/50">
              <div className="flex items-center space-x-2">
                <span className="material-icons text-cyan-400">insert_chart</span>
                <h3 className="text-lg font-bold text-white">Visitas por URL</h3>
              </div>
              <p className="text-slate-400 text-sm mt-1">Cantidad de visitas agrupadas por sitio web</p>
            </div>
            <div className="p-6">
              {loading && (
                <div className="flex items-center justify-center text-center text-slate-400">
                  <div className="flex flex-col items-center">
                    <span className="material-icons text-5xl text-slate-500 mb-2">hourglass_empty</span>
                    <p className="font-medium text-white">Cargando datos...</p>
                  </div>
                </div>
              )}
              {error && (
                <div className="flex items-center justify-center text-center text-slate-400">
                  <div className="flex flex-col items-center">
                    <span className="material-icons text-5xl text-red-400 mb-2">error_outline</span>
                    <p className="font-medium text-red-400">{error}</p>
                    <p className="text-sm text-slate-300">No pudimos cargar las visitas. Por favor, inténtalo de nuevo más tarde.</p>
                    {errorDetail && (
                      <pre className="bg-red-500/20 text-xs text-red-400 rounded p-2 mt-2 max-w-xl overflow-x-auto border border-red-500/30">{errorDetail}</pre>
                    )}
                  </div>
                </div>
              )}
              {!loading && !error && visits.length === 0 && (
                <div className="flex items-center justify-center text-center text-slate-400">
                  <div className="flex flex-col items-center">
                    <span className="material-icons text-5xl text-yellow-400 mb-2">info</span>
                    <p className="font-medium text-white">No se detectan webs</p>
                    <p className="text-sm text-slate-300">Aún no se han registrado visitas.</p>
                  </div>
                </div>
              )}
              {!loading && !error && visits.length > 0 && (
                <div className="space-y-4">
                  {Object.entries(visitasPorUrl)
                    .sort((a, b) => b[1] - a[1])
                    .map(([url, count]) => {
                      const percentage = (count / visits.length) * 100;
                      return (
                        <div key={url} className="bg-slate-900/50 rounded-xl p-5 hover:bg-slate-700/30 transition-all border border-slate-700/50 hover:border-cyan-500/50">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3 flex-1 min-w-0">
                              <span className="material-icons text-cyan-400">language</span>
                              <a href={url} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 font-medium truncate">
                                {url}
                              </a>
                            </div>
                            <div className="flex items-center space-x-4 ml-4">
                              <div className="text-right">
                                <div className="flex items-center space-x-2">
                                  <span className="text-3xl font-black text-white">{count}</span>
                                  <span className="text-xs text-slate-400">visitas</span>
                                </div>
                                <p className="text-xs text-slate-500">{percentage.toFixed(1)}% del total</p>
                              </div>
                              <button
                                onClick={() => verificarSitio(url)}
                                disabled={checking[url]}
                                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1 shadow-lg shadow-cyan-500/30"
                              >
                                <span className="material-icons text-sm">{checking[url] ? 'hourglass_empty' : 'check_circle'}</span>
                                <span>{checking[url] ? 'Verificando...' : 'Verificar'}</span>
                              </button>
                            </div>
                          </div>
                          <div className="w-full bg-slate-700/50 rounded-full h-3 mb-3">
                            <div className="bg-gradient-to-r from-cyan-500 to-blue-600 h-3 rounded-full transition-all shadow-lg shadow-cyan-500/30" style={{ width: `${percentage}%` }}></div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {status[url] === 'activo' && (
                              <span className="inline-flex items-center space-x-1 bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-semibold border border-emerald-500/30">
                                <span className="material-icons" style={{ fontSize: '14px' }}>check_circle</span>
                                <span>Activo</span>
                              </span>
                            )}
                            {status[url] === 'inactivo' && (
                              <span className="inline-flex items-center space-x-1 bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-xs font-semibold border border-red-500/30">
                                <span className="material-icons" style={{ fontSize: '14px' }}>cancel</span>
                                <span>Inactivo</span>
                              </span>
                            )}
                            {!status[url] && (
                              <span className="inline-flex items-center space-x-1 bg-slate-700/50 text-slate-400 px-3 py-1 rounded-full text-xs font-semibold border border-slate-600">
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