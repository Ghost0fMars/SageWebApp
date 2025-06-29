import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ message: "Non autorisé" });

  if (req.method === "GET") {
    try {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { profil: true },
      });

      if (!user || !user.profil) {
        return res.status(200).json({}); // Aucun profil encore créé
      }

      const {
        firstName,
        lastName,
        phone,
        subject,
        school,
        academy,
        grade,
        bio,
        isVisible,
        allowMessages,
        profileImage,
      } = user.profil;

      return res.status(200).json({
        firstName,
        lastName,
        email: user.email,
        phone,
        subject,
        school,
        academy,
        grade,
        bio,
        isVisible,
        allowMessages,
        profileImage,
      });
    } catch (error) {
      console.error("Erreur récupération profil :", error);
      return res.status(500).json({ message: "Erreur serveur", error });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Méthode ${req.method} non autorisée`);
  }
}
