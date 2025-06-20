import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ message: "Unauthorized" });

  if (req.method === "POST") {
    const { title, subtitle, objectif, consigne, sequenceId } = req.body;

    if (!sequenceId || !title) {
      return res.status(400).json({ message: "Données manquantes." });
    }

    const seance = await prisma.seance.create({
      data: {
        title,
        subtitle,
        objectif,
        consigne,
        sequenceId,
        position: "sidebar", // ✅ Par défaut dans la sidebar
      },
    });

    return res.status(201).json(seance);
  }

  if (req.method === "GET") {
    const { sequenceId } = req.query;

    // ✅ Plus d'erreur 400 : si pas de sequenceId, on prend TOUTES les séances
    const where = sequenceId ? { sequenceId } : {};

    const seances = await prisma.seance.findMany({
      where,
      orderBy: { title: "asc" },
    });

    return res.status(200).json(seances);
  }

  // ✅ PATCH ne devrait PAS être ici : il est déjà dans [id].js → on le retire pour éviter conflit.
  // Si tu veux PATCH plusieurs d'un coup → on en parle.

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
