// ✅ pages/api/seances-tiles.js
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req, res) {
  const userId = req.query.userId || req.body.userId;

  if (!userId) {
    return res.status(400).json({ message: "❌ userId est requis" });
  }

  if (req.method === 'GET') {
    const tiles = await prisma.tile.findMany({
      where: { userId },
    });
    return res.status(200).json(tiles);
  }

  else if (req.method === 'POST') {
    const { titre, objectif, position, couleur } = req.body;

    if (!titre || !position) {
      return res.status(400).json({ message: "❌ titre et position sont requis" });
    }

      const tile = await prisma.tile.create({
      data: {
        userId: userId,
        titre: titre,
        objectif: objectif,
        position: position,
        couleur: couleur,
      },
    });

    return res.status(201).json(tile);
  }

  else if (req.method === 'PATCH') {
    const { id } = req.query;
    const updates = req.body;

    const tile = await prisma.tile.update({
      where: { id },
      data: updates,
    });

    return res.status(200).json(tile);
  }

  else if (req.method === 'DELETE') {
    const { id } = req.query;

    await prisma.tile.delete({
      where: { id },
    });

    return res.status(200).json({ message: "Tile supprimée" });
  }

  else {
    res.status(405).json({ message: "Méthode non autorisée" });
  }
}
