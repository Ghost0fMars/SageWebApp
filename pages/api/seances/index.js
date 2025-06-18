import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { sequenceId } = req.query;

    // ✅ Fallback : si pas de sequenceId, on renvoie TOUTES les Seances (ou celles du user)
    const where = sequenceId ? { sequenceId } : {};

    const seances = await prisma.seance.findMany({
      where,
      orderBy: { title: 'asc' },
    });

    return res.status(200).json(seances);
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
