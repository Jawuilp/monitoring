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
              <a className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all flex items-center space-x-2 font-medium shadow-sm" href="/">
                <span className="material-icons text-lg">dashboard</span>
                <span>Dashboard</span>
              </a>
              <a className="bg-white border-2 border-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:border-blue-500 hover:text-blue-600 transition-all flex items-center space-x-2 font-medium" href="/view">
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
            <h2 className="text-3xl font-bold text-gray-900 mb-1">Dashboard Principal</h2>
            <p className="text-gray-600">Vista general de tus métricas y visitas</p>
          </div>
          
          {/* Tarjetas de estadísticas */}
          {!loading && !error && visits.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide">Total Visitas</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-2">{visits.length}</h3>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <span className="material-icons text-blue-600 text-3xl">trending_up</span>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide">URLs Únicas</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-2">{new Set(visits.map(v => v.url)).size}</h3>
                  </div>
                  <div className="bg-green-100 p-3 rounded-lg">
                    <span className="material-icons text-green-600 text-3xl">language</span>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide">IPs Únicas</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-2">{new Set(visits.map(v => v.ip_address).filter(Boolean)).size}</h3>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <span className="material-icons text-purple-600 text-3xl">devices</span>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide">Promedio</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-2">
                      {Math.round(visits.filter(v => v.duration_seconds).reduce((acc, v) => acc + v.duration_seconds, 0) / visits.filter(v => v.duration_seconds).length || 0)}s
                    </h3>
                  </div>
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <span className="material-icons text-orange-600 text-3xl">schedule</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            <div className="flex items-center space-x-2 mb-4">
              <span className="material-icons text-blue-600">code</span>
              <h3 className="text-lg font-bold text-gray-900">Script de Instalación</h3>
            </div>
            <div className="bg-gray-900 rounded-lg p-4 flex items-center justify-between">
              <code className="text-sm text-green-400 font-mono">{script}</code>
              <button
                className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all font-medium ml-4"
                onClick={handleCopy}
              >
                <span className="material-icons text-lg">content_copy</span>
                <span>{copied ? 'Copiado!' : 'Copiar'}</span>
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">Copia este script y pégalo en el HTML de tu sitio web</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="material-icons text-blue-600">visibility</span>
                  <h3 className="text-lg font-bold text-gray-900">Últimas Visitas</h3>
                </div>
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">{visits.length} total</span>
              </div>
              <p className="text-gray-500 text-sm mt-1">Registro detallado de todas las visitas</p>
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
                    <p className="font-medium text-red-600">{error}</p>
                    <p className="text-sm mt-2">No pudimos cargar las últimas visitas.</p>
                    {error.includes('CORS') && (
                      <div className="mt-2 text-xs bg-yellow-50 p-2 rounded">
                        <p className="text-yellow-800">Tip: Asegúrate que tu dominio esté configurado en la API</p>
                      </div>
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
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-sm">
                    <thead>
                      <tr className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                        <th className="py-4 px-6 text-left text-sm font-bold uppercase tracking-wide">URL</th>
                        <th className="py-4 px-6 text-left text-sm font-bold uppercase tracking-wide">Fecha y Hora</th>
                        <th className="py-4 px-6 text-left text-sm font-bold uppercase tracking-wide">Dirección IP</th>
                        <th className="py-4 px-6 text-center text-sm font-bold uppercase tracking-wide">Duración</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {displayedVisits.map((v, i) => (
                        <tr key={i} className="hover:bg-blue-50 transition-colors border-b border-gray-100">
                          <td className="py-4 px-6 text-sm break-all max-w-xs">
                            <a href={v.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 font-medium hover:underline">
                              {v.url}
                            </a>
                          </td>
                          <td className="py-4 px-6 text-sm text-gray-700 whitespace-nowrap font-medium">
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
                            <span className="bg-gray-100 px-3 py-1 rounded-full text-gray-700">
                              {v.ip_address || 'N/A'}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-sm text-center">
                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">
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
                        className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-all font-medium shadow-sm"
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