// Endpoint neutral para guardar y consultar datos de monitoreo con PostgreSQL
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
      // Manejar sendBeacon que puede enviar texto plano
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
      
      const { url, duration } = data || {};
      if (!url || typeof duration !== 'number') {
        return res.status(400).json({ error: 'Datos incompletos o inválidos. Se requiere url y duration (number).' });
      }

      // Derivar IP del cliente desde los headers (detrás de proxies/CDN)
      const xfwd = (req.headers['x-forwarded-for'] || '') + '';
      const clientIp = xfwd.split(',')[0].trim() || req.headers['x-real-ip'] || req.socket?.remoteAddress || '0.0.0.0';

      try {
        const query = 'INSERT INTO visits (url, ip_address, duration_seconds, visit_timestamp) VALUES ($1, $2, $3, NOW())';
        await pool.query(query, [url, clientIp, duration]);
        // Responder 204 No Content (ideal para sendBeacon y menos "ruido" para bloqueadores)
        res.status(204).end();
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
