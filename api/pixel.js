// Endpoint tipo pixel (GET) que registra visita y devuelve un GIF 1x1
import pool from './db.js';

// GIF 1x1 transparente
const GIF_1PX = Buffer.from(
  'R0lGODlhAQABAPAAAP///wAAACwAAAAAAQABAAACAkQBADs=',
  'base64'
);

export default async (req, res) => {
  // CORS básico (aunque es una imagen, habilitamos por si se solicita cross-site)
  const allowedOrigins = [
    'https://jawuil.dev',
    'https://toolting.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000'
  ];

  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Max-Age', '86400');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    // Extraer datos de la query
    const { u: url, d: dStr } = req.query || {};
    const duration = Number(dStr);

    // Derivar IP del cliente
    const xfwd = (req.headers['x-forwarded-for'] || '') + '';
    const clientIp = xfwd.split(',')[0].trim() || req.headers['x-real-ip'] || req.socket?.remoteAddress || '0.0.0.0';

    if (url && Number.isFinite(duration)) {
      try {
        const query = 'INSERT INTO visits (url, ip_address, duration_seconds, visit_timestamp) VALUES ($1, $2, $3, NOW())';
        await pool.query(query, [url, clientIp, duration]);
      } catch (e) {
        // No romper el pixel por errores de DB
        console.error('Error DB en pixel:', e.message);
      }
    }

    // Responder con la imagen 1x1 y headers adecuados para evitar caché
    res.setHeader('Content-Type', 'image/gif');
    res.setHeader('Content-Length', GIF_1PX.length);
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
    res.status(200).end(GIF_1PX);
  } catch (e) {
    // Ante cualquier error, devolver igualmente el GIF 1x1 para no romper la página
    res.setHeader('Content-Type', 'image/gif');
    res.setHeader('Content-Length', GIF_1PX.length);
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
    res.status(200).end(GIF_1PX);
  }
};
