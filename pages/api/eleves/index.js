import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId requis' });
    const eleves = await prisma.eleve.findMany({ where: { userId } });
    res.status(200).json(eleves);
  }
  else if (req.method === 'POST') {
    const data = req.body;
    try {
      const eleve = await prisma.eleve.create({ data });
      res.status(201).json(eleve);
    } catch (e) {
      res.status(500).json({ error: 'Erreur lors de la création' });
    }
  }
  else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Méthode ${req.method} non autorisée`);
  }
}