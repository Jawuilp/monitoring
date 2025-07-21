// Endpoint para guardar y consultar datos de monitoreo 
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;

export default async (req, res) => {
  if (req.method === 'POST') {
    const { url, ip, duration } = req.body;
    try {
      const client = await MongoClient.connect(uri);
      const db = client.db('mytracker');
      await db.collection('visits').insertOne({
        url,
        ip,
        duration,
        date: new Date()
      });
      client.close();
      res.json({ ok: true });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  } else if (req.method === 'GET') {
    try {
      const client = await MongoClient.connect(uri);
      const db = client.db('mytracker');
      const visits = await db.collection('visits').find({}).sort({ date: -1 }).limit(50).toArray();
      client.close();
      res.json(visits);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  } else {
    res.status(405).end();
  }
};