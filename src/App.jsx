import { useState, useEffect } from 'react';

export default function App() {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const script = '<script src="https://toolting.vercel.app/observer.js"></script>';
  const [copied, setCopied] = useState(false);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const apiUrl = window.location.hostname === 'localhost' 
      ? '/api/data'
      : 'https://toolting.vercel.app/api/data';
    
    fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then(async res => {
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.error || `Error HTTP ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        console.log('Visitas cargadas:', data?.length || 0);
        setVisits(Array.isArray(data) ? data : (data.visits || []));
        setLoading(false);
      })
      .catch(e => {
        console.error('Error al cargar visitas:', e);
        if (e.message.includes('Failed to fetch')) {
          setError('No se pudo conectar con el servidor');
        } else if (e.message.includes('CORS')) {
          setError('Error de permisos CORS - Verifica la configuración del servidor');
        } else {
          setError(e.message);
        }
        setLoading(false);
      });
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(script);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const displayedVisits = showAll ? visits : visits.slice(0, 10);

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
              <a className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all flex items-center space-x-2 font-medium shadow-lg shadow-cyan-500/30" href="/">
                <span className="material-icons text-lg">dashboard</span>
                <span>Dashboard</span>
              </a>
              <a className="bg-slate-700/50 border border-slate-600 text-slate-300 px-4 py-2 rounded-lg hover:bg-slate-600/50 hover:text-white transition-all flex items-center space-x-2 font-medium" href="/view">
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
            <h2 className="text-3xl font-bold text-white mb-1">Dashboard Principal</h2>
            <p className="text-gray-400">Vista general de tus métricas y visitas</p>
          </div>
          
          {/* Tarjetas de estadísticas */}
          {!loading && !error && visits.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-xl border border-slate-700/50 p-6 hover:shadow-2xl hover:scale-105 transition-all duration-300">
                <div className="flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Sessions</p>
                    <div className="bg-cyan-500/20 p-2 rounded-lg">
                      <span className="material-icons text-cyan-400 text-2xl">trending_up</span>
                    </div>
                  </div>
                  <h3 className="text-5xl font-black text-white mb-2">{visits.length}</h3>
                  <div className="flex items-center space-x-1 text-xs">
                    <span className="text-green-400 font-semibold">↑ 12%</span>
                    <span className="text-slate-500">vs last week</span>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-xl border border-slate-700/50 p-6 hover:shadow-2xl hover:scale-105 transition-all duration-300">
                <div className="flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Unique URLs</p>
                    <div className="bg-emerald-500/20 p-2 rounded-lg">
                      <span className="material-icons text-emerald-400 text-2xl">language</span>
                    </div>
                  </div>
                  <h3 className="text-5xl font-black text-white mb-2">{new Set(visits.map(v => v.url)).size}</h3>
                  <div className="flex items-center space-x-1 text-xs">
                    <span className="text-green-400 font-semibold">↑ 8%</span>
                    <span className="text-slate-500">vs last week</span>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-xl border border-slate-700/50 p-6 hover:shadow-2xl hover:scale-105 transition-all duration-300">
                <div className="flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Unique IPs</p>
                    <div className="bg-purple-500/20 p-2 rounded-lg">
                      <span className="material-icons text-purple-400 text-2xl">devices</span>
                    </div>
                  </div>
                  <h3 className="text-5xl font-black text-white mb-2">{new Set(visits.map(v => v.ip_address).filter(Boolean)).size}</h3>
                  <div className="flex items-center space-x-1 text-xs">
                    <span className="text-green-400 font-semibold">↑ 5%</span>
                    <span className="text-slate-500">vs last week</span>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-xl border border-slate-700/50 p-6 hover:shadow-2xl hover:scale-105 transition-all duration-300">
                <div className="flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Avg. Time</p>
                    <div className="bg-orange-500/20 p-2 rounded-lg">
                      <span className="material-icons text-orange-400 text-2xl">schedule</span>
                    </div>
                  </div>
                  <h3 className="text-5xl font-black text-white mb-2">
                    {Math.round(visits.filter(v => v.duration_seconds).reduce((acc, v) => acc + v.duration_seconds, 0) / visits.filter(v => v.duration_seconds).length || 0)}s
                  </h3>
                  <div className="flex items-center space-x-1 text-xs">
                    <span className="text-red-400 font-semibold">↓ 2%</span>
                    <span className="text-slate-500">vs last week</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-xl border border-slate-700/50 p-6 mb-6">
            <div className="flex items-center space-x-2 mb-4">
              <span className="material-icons text-cyan-400">code</span>
              <h3 className="text-lg font-bold text-white">Script de Instalación</h3>
            </div>
            <div className="bg-slate-950 rounded-lg p-4 flex items-center justify-between border border-slate-700">
              <code className="text-sm text-green-400 font-mono">{script}</code>
              <button
                className="flex items-center space-x-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg transition-all font-medium ml-4 shadow-lg shadow-cyan-500/30"
                onClick={handleCopy}
              >
                <span className="material-icons text-lg">content_copy</span>
                <span>{copied ? 'Copiado!' : 'Copiar'}</span>
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-2">Copia este script y pégalo en el HTML de tu sitio web</p>
          </div>
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-xl border border-slate-700/50 overflow-hidden">
            <div className="p-6 border-b border-slate-700/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="material-icons text-cyan-400">visibility</span>
                  <h3 className="text-lg font-bold text-white">Últimas Visitas</h3>
                </div>
                <span className="bg-cyan-500/20 text-cyan-400 px-3 py-1 rounded-full text-xs font-semibold border border-cyan-500/30">{visits.length} total</span>
              </div>
              <p className="text-slate-400 text-sm mt-1">Registro detallado de todas las visitas</p>
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
                    <p className="text-sm mt-2 text-slate-300">No pudimos cargar las últimas visitas.</p>
                    {error.includes('CORS') && (
                      <div className="mt-2 text-xs bg-yellow-500/20 p-2 rounded border border-yellow-500/30">
                        <p className="text-yellow-400">Tip: Asegúrate que tu dominio esté configurado en la API</p>
                      </div>
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
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-slate-900/50 rounded-lg overflow-hidden">
                    <thead>
                      <tr className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white">
                        <th className="py-4 px-6 text-left text-xs font-bold uppercase tracking-wider">URL</th>
                        <th className="py-4 px-6 text-left text-xs font-bold uppercase tracking-wider">Fecha y Hora</th>
                        <th className="py-4 px-6 text-left text-xs font-bold uppercase tracking-wider">Dirección IP</th>
                        <th className="py-4 px-6 text-center text-xs font-bold uppercase tracking-wider">Duración</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/50">
                      {displayedVisits.map((v, i) => (
                        <tr key={i} className="hover:bg-slate-700/30 transition-colors border-b border-slate-700/30">
                          <td className="py-4 px-6 text-sm break-all max-w-xs">
                            <a href={v.url} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 font-medium hover:underline">
                              {v.url}
                            </a>
                          </td>
                          <td className="py-4 px-6 text-sm text-slate-300 whitespace-nowrap font-medium">
                            {new Date(v.date).toLocaleString('es-ES', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit',
                              second: '2-digit'
                            })}
                          </td>
                          <td className="py-4 px-6 text-sm font-mono">
                            <span className="bg-slate-700/50 px-3 py-1 rounded-full text-slate-300 border border-slate-600">
                              {v.ip_address || 'N/A'}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-sm text-center">
                            <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full font-semibold border border-emerald-500/30">
                              {v.duration_seconds ? `${v.duration_seconds}s` : 'N/A'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {visits.length > 10 && (
                    <div className="mt-6 text-center">
                      <button
                        onClick={() => setShowAll(!showAll)}
                        className="inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg transition-all font-medium shadow-lg shadow-cyan-500/30"
                      >
                        <span className="material-icons">{showAll ? 'expand_less' : 'expand_more'}</span>
                        <span>{showAll ? 'Ver menos' : `Ver todas (${visits.length})`}</span>
                      </button>
                    </div>
                  )}
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