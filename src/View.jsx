import { useEffect, useState } from 'react';

export default function View() {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState({}); // Estado de cada URL
  const [checking, setChecking] = useState({}); // Estado de carga por URL

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

  // Contar visitas por URL
  const visitasPorUrl = visits.reduce((acc, v) => {
    acc[v.url] = (acc[v.url] || 0) + 1;
    return acc;
  }, {});

  // Verificar si un sitio está activo
  const verificarSitio = async (url) => {
    setChecking(prev => ({ ...prev, [url]: true }));
    try {
      // Usar fetch con modo no-cors para evitar bloqueos, pero no se puede leer status real
      // Por eso, intentamos con HEAD y fallback a GET
      let res = await fetch(url, { method: 'HEAD', mode: 'no-cors' });
      // Si no hay error, consideramos activo (no-cors no permite leer status, pero si falla lanza error)
      setStatus(prev => ({ ...prev, [url]: 'activo' }));
    } catch {
      setStatus(prev => ({ ...prev, [url]: 'inactivo' }));
    }
    setChecking(prev => ({ ...prev, [url]: false }));
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '32px', maxWidth: 900, margin: 'auto', background: '#f7f9fa', borderRadius: 12, boxShadow: '0 2px 12px #0001' }}>
      <h1 style={{ textAlign: 'center', color: '#2b5876', marginBottom: 24 }}>Visualización de Datos</h1>
      {loading && <p>Cargando datos...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {!loading && !error && visits.length === 0 && <p>No hay datos para mostrar.</p>}
      {!loading && !error && visits.length > 0 && (
        <>
          <h2 style={{ color: '#2b5876', marginTop: 0 }}>Visitas por URL</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 8, overflow: 'hidden', boxShadow: '0 1px 4px #0001' }}>
            <thead>
              <tr style={{ background: 'linear-gradient(90deg, #2b5876 0%, #4e4376 100%)', color: '#fff' }}>
                <th style={{ padding: 12, textAlign: 'left' }}>URL</th>
                <th style={{ padding: 12 }}>Visitas</th>
                <th style={{ padding: 12 }}>Estado</th>
                <th style={{ padding: 12 }}>Acción</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(visitasPorUrl).map(([url, count]) => (
                <tr key={url} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: 10, wordBreak: 'break-all' }}>{url}</td>
                  <td style={{ padding: 10, textAlign: 'center' }}>{count}</td>
                  <td style={{ padding: 10, textAlign: 'center' }}>
                    {status[url] === 'activo' && <span style={{ color: 'green', fontWeight: 'bold' }}>Activo</span>}
                    {status[url] === 'inactivo' && <span style={{ color: 'red', fontWeight: 'bold' }}>Inactivo</span>}
                    {!status[url] && <span style={{ color: '#888' }}>Sin verificar</span>}
                  </td>
                  <td style={{ padding: 10, textAlign: 'center' }}>
                    <button
                      onClick={() => verificarSitio(url)}
                      disabled={checking[url]}
                      style={{
                        background: 'linear-gradient(90deg, #2b5876 0%, #4e4376 100%)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 6,
                        padding: '6px 16px',
                        cursor: checking[url] ? 'not-allowed' : 'pointer',
                        fontWeight: 'bold',
                        boxShadow: '0 1px 4px #0002',
                        opacity: checking[url] ? 0.6 : 1
                      }}
                    >
                      {checking[url] ? 'Verificando...' : 'Verificar estado'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
} 