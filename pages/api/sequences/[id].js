import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { id } = req.query;
  const userId = session.user.id;

  // ✅ GET : Séquence + toutes ses séances liées
  if (req.method === "GET") {
    const sequence = await prisma.sequence.findUnique({
      where: { id },
      include: {
        seances: {
          orderBy: { title: "asc" }, // trier par titre pour ordre logique
        },
      },
    });

    if (!sequence || sequence.userId !== userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    return res.status(200).json(sequence);
  }

  // ✅ PATCH (inchangé)
  if (req.method === "PATCH") {
    const { title, content } = req.body;

    const existing = await prisma.sequence.findUnique({
      where: { id },
    });

    if (!existing || existing.userId !== userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const updated = await prisma.sequence.update({
      where: { id },
      data: { title, content },
    });

    await prisma.seance.deleteMany({
      where: { sequenceId: id },
    });

    const text = content.seancesDetaillees || "";
    const seanceBlocks = text.split(/Séance \d+ :/i).filter(Boolean);

    for (let i = 0; i < seanceBlocks.length; i++) {
      const s = seanceBlocks[i];
      const lines = s.split('\n').map(l => l.trim()).filter(Boolean);
      const seanceTitle = `Séance ${i + 1}`;
      const objectif = lines.find(line => /Objectif/i.test(line)) || "Objectif non précisé";

      await prisma.seance.create({
        data: {
          title: seanceTitle,
          objectif,
          sequenceId: id,
        },
      });
    }

    return res.status(200).json(updated);
  }

  // ✅ DELETE (inchangé)
  if (req.method === "DELETE") {
    const existing = await prisma.sequence.findUnique({
      where: { id },
    });

    if (!existing || existing.userId !== userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await prisma.seance.deleteMany({
      where: { sequenceId: id },
    });

    await prisma.sequence.delete({
      where: { id },
    });

    return res.status(204).end();
  }

  res.setHeader("Allow", ["GET", "PATCH", "DELETE"]);
  res.status(405).end(`Méthode ${req.method} non autorisée`);
}
