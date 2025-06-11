import prisma from '@/lib/prisma';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'PATCH') {
    const { position } = req.body;
    try {
      const updated = await prisma.seance.update({
        where: { id },
        data: { position },
      });
      return res.status(200).json(updated);
    } catch (error) {
      console.error('Erreur PATCH:', error);
      return res.status(500).json({ error: "Erreur de mise à jour de la position" });
    }
  }

  if (req.method === 'DELETE') {
    try {
      await prisma.seance.delete({
        where: { id },
      });
      return res.status(204).end();
    } catch (error) {
      console.error('Erreur DELETE:', error);
      return res.status(500).json({ error: "Erreur lors de la suppression" });
    }
  }

  res.setHeader('Allow', ['PATCH', 'DELETE']);
  res.status(405).end(`Méthode ${req.method} non autorisée`);
}