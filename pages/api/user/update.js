import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ message: "Non autorisé" });

  if (req.method === "POST") {
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
    } = req.body;

    try {
      // Récupération du user à partir de l'email de session
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
      });

      if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });

      // Création ou mise à jour du profil lié
      const profil = await prisma.profil.upsert({
        where: { userId: user.id },
        update: {
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
        },
        create: {
          userId: user.id,
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
        },
      });

      return res.status(200).json(profil);
    } catch (error) {
      console.error("Erreur mise à jour profil :", error);
      return res.status(500).json({ message: "Erreur serveur", error });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Méthode ${req.method} non autorisée`);
  }
}
