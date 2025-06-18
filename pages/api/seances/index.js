import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ message: "Unauthorized" });

  if (req.method === "POST") {
    const { title, objectif, sequenceId } = req.body;

    if (!sequenceId || !title) {
      return res.status(400).json({ message: "Données manquantes." });
    }

    const seance = await prisma.seance.create({
      data: {
        title,
        objectif,
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

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
