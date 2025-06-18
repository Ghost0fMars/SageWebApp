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
      },
    });

    return res.status(201).json(seance);
  }

  if (req.method === "GET") {
    const { sequenceId } = req.query;

    if (!sequenceId) {
      return res.status(400).json({ message: "Paramètre sequenceId requis." });
    }

    const seances = await prisma.seance.findMany({
      where: { sequenceId },
      orderBy: { title: "asc" },
    });

    return res.status(200).json(seances);
  }

  if (req.method === "PATCH") {
  const { id, subtitle, objectif, consigne, detailed } = req.body;

  if (!id) {
    return res.status(400).json({ message: "ID de la séance manquant." });
  }

  const updated = await prisma.seance.update({
    where: { id },
    data: { subtitle, objectif, consigne, detailed },
  });

  return res.status(200).json(updated);
}


  res.setHeader('Allow', ['GET', 'POST', 'PATCH']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
