import { useState, useEffect } from 'react';

export default function App() {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const script = '<script src="https://monitoring-beige.vercel.app/tracker.js"></script>';
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const apiUrl = window.location.hostname === 'localhost' 
      ? '/api/collect' 
      : 'https://monitoring-beige.vercel.app/api/collect';
    
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
    <div className="min-h-screen bg-gray-100 font-['Inter']">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-900">Analytics</h1>
          <nav>
            <a className="text-base font-medium text-gray-500 hover:text-gray-900" href="/view">Visualización</a>
          </nav>
        </div>
      </header>
      <main className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold leading-tight text-gray-900">Mis Analytics Personales</h2>
          </div>
          <div className="bg-white rounded-lg shadow p-6 mb-8">
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
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Últimas visitas</h3>
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
                <ul className="w-full mt-2 space-y-2">
                  {visits.slice(0, 10).map((v, i) => (
                    <li key={i} className="bg-gray-50 border border-gray-200 rounded px-4 py-2 flex flex-col md:flex-row md:items-center md:justify-between text-sm">
                      <span className="font-semibold text-gray-900 break-all">{v.url}</span>
                      <span className="text-gray-500">{new Date(v.date).toLocaleString()}</span>
                      <span className="text-gray-400">IP: {v.ip}</span>
                      <span className="text-gray-400">Duración: {v.duration}s</span>
                    </li>
                  ))}
                </ul>
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