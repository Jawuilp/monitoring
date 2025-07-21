// Endpoint para guardar datos de monitoreo 
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;

export default async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();

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
};