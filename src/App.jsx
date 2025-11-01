import { useState, useEffect } from 'react';

export default function App() {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const script = '<script src="https://toolting.vercel.app/observer.js"></script>';
  const [copied, setCopied] = useState(false);

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

  return (
    <div className="min-h-screen font-['Inter']">
      <header className="bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg">
        <div className="max-w-7xl mx-auto py-5 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <span className="material-icons text-white text-3xl">analytics</span>
            <h1 className="text-2xl font-bold text-white">Analytics Dashboard</h1>
          </div>
          <nav className="flex items-center space-x-6">
            <a className="text-white font-medium hover:text-blue-100 transition-colors flex items-center" href="/">
              <span className="material-icons mr-1 text-sm">home</span>
              Inicio
            </a>
            <a className="text-white font-medium hover:text-blue-100 transition-colors flex items-center" href="/view">
              <span className="material-icons mr-1 text-sm">visibility</span>
              Visualización
            </a>
          </nav>
        </div>
      </header>
      <main className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-4xl font-bold leading-tight text-gray-900 mb-2">Mis Analytics Personales</h2>
            <p className="text-gray-600">Panel de control de monitoreo en tiempo real</p>
          </div>
          
          {/* Tarjetas de estadísticas */}
          {!loading && !error && visits.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Total Visitas</p>
                    <h3 className="text-3xl font-bold mt-1">{visits.length}</h3>
                  </div>
                  <span className="material-icons text-5xl opacity-30">bar_chart</span>
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">URLs Únicas</p>
                    <h3 className="text-3xl font-bold mt-1">{new Set(visits.map(v => v.url)).size}</h3>
                  </div>
                  <span className="material-icons text-5xl opacity-30">language</span>
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">IPs Únicas</p>
                    <h3 className="text-3xl font-bold mt-1">{new Set(visits.map(v => v.ip_address).filter(Boolean)).size}</h3>
                  </div>
                  <span className="material-icons text-5xl opacity-30">devices</span>
                </div>
              </div>
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm font-medium">Duración Promedio</p>
                    <h3 className="text-3xl font-bold mt-1">
                      {Math.round(visits.filter(v => v.duration_seconds).reduce((acc, v) => acc + v.duration_seconds, 0) / visits.filter(v => v.duration_seconds).length || 0)}s
                    </h3>
                  </div>
                  <span className="material-icons text-5xl opacity-30">schedule</span>
                </div>
              </div>
            </div>
          )}
          
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Script para instalar</h3>
            <div className="bg-gray-100 rounded-md p-4 flex items-center justify-between">
              <code className="text-sm text-gray-700">{script}</code>
              <button
                className="flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium"
                onClick={handleCopy}
              >
                <span className="material-icons mr-1">content_copy</span>
                {copied ? 'Copiado' : 'Copiar'}
              </button>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-t-lg">
              <h3 className="text-xl font-bold text-white flex items-center">
                <span className="material-icons mr-2">visibility</span>
                Últimas Visitas
              </h3>
              <p className="text-blue-100 text-sm mt-1">Monitoreo en tiempo real de las visitas a tus sitios web</p>
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
                      {visits.slice(0, 10).map((v, i) => (
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