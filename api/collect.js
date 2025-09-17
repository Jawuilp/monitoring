// Endpoint para guardar y consultar datos de monitoreo con PostgreSQL
import pool from './db.js';

export default async (req, res) => {
  try {
    if (req.method === 'POST') {
      const { url, ip, duration } = req.body || {};
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