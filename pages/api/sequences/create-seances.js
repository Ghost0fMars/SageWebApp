import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const userId = session.user.id;

  if (req.method === "POST") {
    const { title, domaine, sousDomaine, nbSeances = 5 } = req.body;

    // Créer la Sequence
    const sequence = await prisma.sequence.upsert({
      where: { title },
      update: { content: { domaine, sousDomaine }, userId },
      create: { title, content: { domaine, sousDomaine }, userId },
    });

    // Supprimer les séances existantes pour cette séquence
    await prisma.seance.deleteMany({ where: { sequenceId: sequence.id } });

    // Générer X séances simples
    for (let i = 0; i < nbSeances; i++) {
      await prisma.seance.create({
        data: {
          title: `Séance ${i + 1}`,
          objectif: "Objectif à définir...",
          position: "sidebar",
          sequenceId: sequence.id,
        },
      });
    }

    return res.status(200).json({ sequenceId: sequence.id });
  }

  res.setHeader("Allow", ["POST"]);
  res.status(405).end(`Method ${req.method} not allowed`);
}
