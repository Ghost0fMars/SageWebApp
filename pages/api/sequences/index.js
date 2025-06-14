import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const userId = session.user.id;

  if (req.method === "GET") {
    const sequences = await prisma.sequence.findMany({
      where: { userId },
    });
    return res.status(200).json(sequences);
  }

  if (req.method === "POST") {
    const { title, content } = req.body;
    try {
      const sequence = await prisma.sequence.create({
        data: {
          title,
          content,
          userId, // ✅ On associe à l'utilisateur connecté
        },
      });
      return res.status(201).json(sequence);
    } catch (error) {
      console.error("Erreur POST:", error);
      return res.status(500).json({ message: "Erreur lors de la création de la séquence" });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end(`Méthode ${req.method} non autorisée`);
}
