import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ message: "Unauthorized" });

  if (req.method === "POST") {
    let body = req.body;
    if (typeof body === "string") {
      body = JSON.parse(body); // ✅ robustesse
    }

    const { title, subtitle, objectif, consigne, sequenceId, semaine } = body;

    if (!sequenceId || !title) {
      return res.status(400).json({ message: "Données manquantes." });
    }

    try {
      const seance = await prisma.seance.create({
        data: {
          title,
          subtitle,
          objectif,
          consigne,
          sequenceId,
          position: "sidebar", // ✅ Toujours par défaut
          semaine: semaine ? new Date(semaine) : null, // ✅ Blindage ici
        },
      });

      return res.status(201).json(seance);
    } catch (error) {
      console.error("❌ Erreur CREATE :", error);
      return res.status(500).json({ error: "Erreur lors de la création de la séance" });
    }
  }

  if (req.method === "GET") {
    const { sequenceId } = req.query;

    const where = sequenceId ? { sequenceId } : {};

    const seances = await prisma.seance.findMany({
      where,
      orderBy: { title: "asc" },
    });

    return res.status(200).json(seances);
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
