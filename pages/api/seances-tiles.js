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
  const { sequenceId, userId } = req.body;

  console.log("✅ Reçu sequenceId:", sequenceId, "pour userId:", userId);

  if (!sequenceId || !userId) {
    return res.status(400).json({ message: "❌ sequenceId et userId requis" });
  }

    const seances = await prisma.seance.findMany({
    where: { sequenceId: sequenceId },
  });

  console.log("🔍 Seances trouvées:", seances);

  const createdTiles = [];

  for (const s of seances) {
    const exists = await prisma.tile.findFirst({
      where: { seanceId: s.id, userId },
    });

    if (!exists) {
      const tile = await prisma.tile.create({
        data: {
          userId: userId,
          titre: s.title,
          objectif: s.objectif,
          seanceId: s.id,
          position: "sidebar",
          couleur: "yellow",
        },
      });
      createdTiles.push(tile);
    }
  }

  return res.status(201).json({ tiles: createdTiles });
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

// ✅ Pour indiquer à Next.js qu'on gère le corps et qu'on désactive la gestion automatique
export const config = {
  api: {
    bodyParser: true,
    externalResolver: true,
  },
};
