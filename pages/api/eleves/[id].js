import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    // Récupérer un élève par son id
    try {
      const eleve = await prisma.eleve.findUnique({ where: { id } });
      if (!eleve) return res.status(404).json({ error: 'Élève non trouvé' });
      res.status(200).json(eleve);
    } catch (error) {
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }

  else if (req.method === 'PATCH' || req.method === 'PUT') {
    // Mettre à jour un élève
    try {
      const data = req.body;
      const eleve = await prisma.eleve.update({
        where: { id },
        data,
      });
      res.status(200).json(eleve);
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la mise à jour' });
    }
  }

  else if (req.method === 'DELETE') {
    // Supprimer un élève
    try {
      await prisma.eleve.delete({ where: { id } });
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la suppression' });
    }
  }

  else {
    res.setHeader('Allow', ['GET', 'PATCH', 'PUT', 'DELETE']);
    res.status(405).end(`Méthode ${req.method} non autorisée`);
  }
}