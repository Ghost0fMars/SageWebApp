// ✅ pages/api/sequence.js
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  // Vérifier la session utilisateur
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const userId = session.user.id;

  if (req.method === "POST") {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "Title et content requis" });
    }

    // ✅ Créer ou mettre à jour la séquence pour cet utilisateur
    const sequence = await prisma.sequence.upsert({
      where: { title },
      update: { content, userId },
      create: { title, content, userId },
    });

    // ✅ Supprimer toutes les Seances existantes pour cette séquence
    await prisma.seance.deleteMany({
      where: { sequenceId: sequence.id },
    });

    // ✅ Découper et créer les nouvelles Seances
    const text = content.seancesDetaillees || "";
    const seanceBlocks = text.split(/Séance \d+ :/i).filter(Boolean);

    for (let i = 0; i < seanceBlocks.length; i++) {
      const s = seanceBlocks[i];
      const lines = s.split("\n").map(l => l.trim()).filter(Boolean);
      const seanceTitle = `Séance ${i + 1}`;
      const objectif = lines.find(line => /Objectif/i.test(line)) || "Objectif non précisé";

      await prisma.seance.create({
        data: {
          title: seanceTitle,
          objectif,
          sequenceId: sequence.id,
          userId: userId, // 👈 important pour filtrer les séances par utilisateur
        },
      });
    }

    return res.status(200).json({
      message: "Séquence ET séances sauvegardées avec succès",
      sequence,
    });
  }

  res.setHeader("Allow", ["POST"]);
  res.status(405).end(`Méthode ${req.method} non autorisée`);
}
