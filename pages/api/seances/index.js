import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { titre, domaine, couleur, userId } = req.body;
    const seance = await prisma.seance.create({
      data: { titre, domaine, couleur, userId },
    });
    res.status(201).json(seance);
  } else if (req.method === 'GET') {
    const seances = await prisma.seance.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json(seances);
  } else {
    res.setHeader('Allow', ['POST', 'GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
