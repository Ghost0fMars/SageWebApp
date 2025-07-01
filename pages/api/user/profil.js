export const config = {
  api: {
    bodyParser: false,
    sizeLimit: "100mb",
  },
};

import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { PrismaClient } from "@prisma/client";
import { IncomingForm } from "formidable";
import fs from "fs";

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
        return res.status(200).json({});
      }

      const {
        firstName,
        lastName,
        messagerie,
        phone,
        subject,
        school,
        grade,
        bio,
        isVisible,
        photoUrl,
      } = user.profil;

      return res.status(200).json({
        firstName,
        lastName,
        messagerie,
        phone,
        subject,
        school,
        grade,
        bio,
        isVisible,
        photoUrl,
      });
    } catch (error) {
      console.error("Erreur récupération profil :", error);
      return res.status(500).json({ message: "Erreur serveur", error });
    }
  } else if (req.method === "POST") {
    const form = new IncomingForm();
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

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

  const existingProfil = await prisma.profil.findUnique({
    where: { userId: user.id },
  });

  // Si une nouvelle photo est uploadée, on la prend, sinon on garde l'ancienne
  let photoUrl = existingProfil?.photoUrl || null;
if (files.photo && files.photo.newFilename && files.photo.newFilename !== "undefined") {
  photoUrl = `/uploads/${files.photo.newFilename}`;
} else if (fields.photoUrl && fields.photoUrl !== "undefined") {
  photoUrl = Array.isArray(fields.photoUrl) ? fields.photoUrl[0] : fields.photoUrl;
}

// Correction : si photoUrl contient "undefined", on remet le logo ou null
if (!photoUrl || photoUrl.includes("undefined")) {
  photoUrl = null; // ou "/Logo.png" si tu veux le logo par défaut dans la base
}

  const profilData = {
    firstName: Array.isArray(fields.firstName) ? fields.firstName[0] : fields.firstName,
    lastName: Array.isArray(fields.lastName) ? fields.lastName[0] : fields.lastName,
    messagerie: Array.isArray(fields.messagerie) ? fields.messagerie[0] : fields.messagerie,
    phone: Array.isArray(fields.phone) ? fields.phone[0] : fields.phone,
    subject: Array.isArray(fields.subject) ? fields.subject[0] : fields.subject,
    school: Array.isArray(fields.school) ? fields.school[0] : fields.school,
    grade: Array.isArray(fields.grade) ? fields.grade[0] : fields.grade,
    bio: Array.isArray(fields.bio) ? fields.bio[0] : fields.bio,
    isVisible: fields.isVisible === "true" || fields.isVisible === true,
    photoUrl,
    userId: user.id,
  };

  if (existingProfil) {
    await prisma.profil.update({
      where: { userId: user.id },
      data: profilData,
    });
  } else {
    await prisma.profil.create({
      data: profilData,
    });
  }

  return res.status(200).json({ message: "Profil sauvegardé", photoUrl });
});

  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Méthode ${req.method} non autorisée`);
  }
}