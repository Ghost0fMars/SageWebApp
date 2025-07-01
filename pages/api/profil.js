import prisma from '@/lib/prisma'; // ✅ import par défaut
import formidable from "formidable";
import fs from "fs";
import { getServerSession } from "next-auth"; // selon ta config

export const config = {
  api: {
    bodyParser: false,
    sizeLimit: "100mb", // augmente la limite à 10 Mo (ou plus si besoin)
  },
};

export default async function handler(req, res) {
  const session = await getServerSession(req, res); // à adapter selon ta config
  if (!session || !session.user?.email) {
    return res.status(401).json({ error: "Non autorisé" });
  }
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });

  if (req.method === "POST") {
    const form = new formidable.IncomingForm();
   
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Erreur lors de l'upload" });
      }

      const photoUrl = fields.photoUrl || null;

      const existingProfil = await prisma.profil.findUnique({ where: { userId: user.id } });

      if (existingProfil) {
        await prisma.profil.update({
          where: { userId: user.id },
          data: {
            ...fields,
            isVisible: fields.isVisible === "true",
            photoUrl,
            userId: user.id,
          },
        });
      } else {
        await prisma.profil.create({
          data: {
            ...fields,
            isVisible: fields.isVisible === "true",
            photoUrl,
            userId: user.id,
          },
        });
      }

      return res.status(200).json({ message: "Profil sauvegardé", photoUrl });
    });
  } else if (req.method === "GET") {
    const profil = await prisma.profil.findUnique({ where: { userId: user.id } });
    return res.status(200).json(profil || {});
  } else {
    res.status(405).json({ error: "Méthode non autorisée" });
  }
}