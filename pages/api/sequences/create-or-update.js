import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ message: "Unauthorized" });

  if (req.method === "POST") {
    const { title, domaine, sousDomaine, competence, progression } = req.body;
    const userId = session.user.id;

    // Vérifie si une Sequence existe déjà pour ce titre + utilisateur
    const existing = await prisma.sequence.findFirst({
      where: { title, userId },
    });

    let sequence;
    if (existing) {
      sequence = await prisma.sequence.update({
        where: { id: existing.id },
        data: {
          content: { domaine, sousDomaine, competence, progression },
        },
      });
    } else {
      sequence = await prisma.sequence.create({
        data: {
          title,
          userId,
          content: { domaine, sousDomaine, competence, progression },
        },
      });
    }

    return res.status(200).json({ sequenceId: sequence.id });
  }

  res.setHeader('Allow', ['POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
