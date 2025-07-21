import { useEffect, useState } from 'react';

export default function View() {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // Ejemplo: contar visitas por URL
  const visitasPorUrl = visits.reduce((acc, v) => {
    acc[v.url] = (acc[v.url] || 0) + 1;
    return acc;
  }, {});

  return (
    <div style={{ fontFamily: 'Arial', padding: '20px', maxWidth: 700, margin: 'auto' }}>
      <h1>Visualización de Datos</h1>
      {loading && <p>Cargando datos...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {!loading && !error && visits.length === 0 && <p>No hay datos para mostrar.</p>}
      <h2>Visitas por URL</h2>
      <ul>
        {Object.entries(visitasPorUrl).map(([url, count]) => (
          <li key={url}><strong>{url}</strong>: {count} visitas</li>
        ))}
      </ul>
    </div>
  );
} 