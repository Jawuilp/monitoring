// Endpoint para guardar y consultar datos de monitoreo con PostgreSQL
import pool from './db.js';

export default async (req, res) => {
  // Configurar CORS headers
  const allowedOrigins = [
    'https://jawuil.dev',
    'https://monitoring-beige.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000'
  ];
  
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    // Permitir cualquier origen para desarrollo (puedes cambiar esto en producción)
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Max-Age', '86400');
  
  // Manejar preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  try {
    if (req.method === 'POST') {
      // Manejar sendBeacon que envía texto plano
      let data = req.body;
      
      // Si el body es un string (sendBeacon), intentar parsearlo
      if (typeof data === 'string') {
        try {
          data = JSON.parse(data);
        } catch (e) {
          console.error('Error parseando JSON:', e);
          return res.status(400).json({ error: 'Formato de datos inválido', detail: e.message });
        }
      }
      
      const { url, ip, duration } = data || {};
      if (!url || !ip || typeof duration !== 'number') {
        return res.status(400).json({ error: 'Datos incompletos o inválidos. Se requiere url, ip y duration (number).' });
      }

      try {
        const query = 'INSERT INTO visits (url, ip_address, duration_seconds, visit_timestamp) VALUES ($1, $2, $3, NOW())';
        await pool.query(query, [url, ip, duration]);
        res.status(201).json({ ok: true });
      } catch (e) {
        res.status(500).json({ error: 'Error al insertar en la base de datos', detail: e.message });
      }

    } else if (req.method === 'GET') {
      try {
        const query = 'SELECT url, ip_address, duration_seconds, visit_timestamp AS date FROM visits ORDER BY visit_timestamp DESC LIMIT 50';
        const { rows } = await pool.query(query);
        res.status(200).json(rows);
      } catch (e) {
        res.status(500).json({ error: 'Error al consultar la base de datos', detail: e.message });
      }

    } else {
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).json({ error: `Método ${req.method} no permitido. Usa GET o POST.` });
    }
  } catch (e) {
    res.status(500).json({ error: 'Error inesperado en el endpoint', detail: e.message });
  }
};