// Endpoint para guardar y consultar datos de monitoreo 
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;

export default async (req, res) => {
  let client;
  try {
    if (!uri) {
      return res.status(500).json({ error: 'MONGODB_URI no está definida en las variables de entorno.' });
    }
    if (req.method === 'POST') {
      const { url, ip, duration } = req.body || {};
      if (!url || !ip || typeof duration !== 'number') {
        return res.status(400).json({ error: 'Datos incompletos o inválidos. Se requiere url, ip y duration (number).' });
      }
      try {
        client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        const db = client.db('mytracker');
        await db.collection('visits').insertOne({
          url,
          ip,
          duration,
          date: new Date()
        });
        res.json({ ok: true });
      } catch (e) {
        res.status(500).json({ error: 'Error al insertar en la base de datos', detail: e.message });
      } finally {
        if (client) await client.close().catch(() => {});
      }
    } else if (req.method === 'GET') {
      try {
        client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        const db = client.db('mytracker');
        const visits = await db.collection('visits').find({}).sort({ date: -1 }).limit(50).toArray();
        res.json(visits);
      } catch (e) {
        res.status(500).json({ error: 'Error al consultar la base de datos', detail: e.message });
      } finally {
        if (client) await client.close().catch(() => {});
      }
    } else {
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).json({ error: `Método ${req.method} no permitido. Usa GET o POST.` });
    }
  } catch (e) {
    res.status(500).json({ error: 'Error inesperado en el endpoint', detail: e.message });
    if (client) await client.close().catch(() => {});
  }
};