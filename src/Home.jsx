import { useEffect, useState } from 'react';

export default function Home() {
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

  return (
    <div style={{ fontFamily: 'Arial', padding: '20px', maxWidth: 700, margin: 'auto' }}>
      <h1>Mis Analytics Personales</h1>
      <div>
        <h2>Script para instalar:</h2>
        <pre style={{ background: '#eee', padding: '10px', borderRadius: 4 }}>
          {`<script src="https://tudominio.vercel.app/tracker.js"></script>`}
        </pre>
      </div>
      <h2>Últimas visitas:</h2>
      {loading && <p>Cargando visitas...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {!loading && !error && visits.length === 0 && <p>No hay visitas registradas.</p>}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {visits.map((visit, i) => (
          <li key={i} style={{ marginBottom: 10, background: '#f9f9f9', padding: 10, borderRadius: 4 }}>
            <div><strong>URL:</strong> {visit.url}</div>
            <div><strong>Duración:</strong> {visit.duration}s</div>
            <div><strong>IP:</strong> {visit.ip}</div>
            <div><strong>Fecha:</strong> {visit.date ? new Date(visit.date).toLocaleString() : 'Sin fecha'}</div>
          </li>
        ))}
      </ul>
    </div>
  );
} 