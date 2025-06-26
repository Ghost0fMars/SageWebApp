import { prisma } from "@/lib/prisma";
import formidable from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    const form = new formidable.IncomingForm();
    form.uploadDir = "./public/uploads";
    form.keepExtensions = true;

    if (!fs.existsSync(form.uploadDir)) {
      fs.mkdirSync(form.uploadDir, { recursive: true });
    }

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Erreur lors de l'upload" });
      }

      const photoUrl = files.photo ? `/uploads/${files.photo.newFilename}` : fields.photoUrl || null;

      // Vérifie s'il existe déjà un profil unique (par ex. pour un seul user)
      const existingProfil = await prisma.profil.findFirst();

      if (existingProfil) {
        // Update
        await prisma.profil.update({
          where: { id: existingProfil.id },
          data: {
            ...fields,
            isVisible: fields.isVisible === "true",
            allowMessages: fields.allowMessages === "true",
            photoUrl,
          },
        });
      } else {
        // Create
        await prisma.profil.create({
          data: {
            ...fields,
            isVisible: fields.isVisible === "true",
            allowMessages: fields.allowMessages === "true",
            photoUrl,
          },
        });
      }

      return res.status(200).json({ message: "Profil sauvegardé", photoUrl });
    });
  } else if (req.method === "GET") {
    const profil = await prisma.profil.findFirst();
    return res.status(200).json(profil || {});
  } else {
    res.status(405).json({ error: "Méthode non autorisée" });
  }
}
