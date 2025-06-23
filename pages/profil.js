import Header from "@/components/Header";
import Image from "next/image";
import { useState } from "react";

export default function Profile() {
  const [formData, setFormData] = useState({
    firstName: "Étienne",
    lastName: "Lavallard",
    email: "etienne.lavallard@ac-aix-marseille.fr",
    phone: "06 95 62 90 79",
    subject: "Multidisciplinaire",
    school: "Académie Aix-Marseille",
    grade: "Professeur des écoles",
    bio: "Professeur des écoles passionné et créateur de SAGE, un assistant numérique intelligent pour l'enseignement primaire.",
    isVisible: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Profil sauvegardé :", formData);
    // TODO : envoyer les données au backend
  };

  return (
    <>
      <Header />

      <div className="container">
        {/* Bandeau titre */}
        <div className="bg-blue-600 text-white rounded-t-lg px-6 py-6 mb-8">
          <h1 className="text-3xl font-bold">Mon Profil Enseignant</h1>
          <p className="text-sm">Gérez vos informations personnelles et professionnelles</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Photo + bouton */}
          <div className="flex flex-col items-center">
            <Image
              src="/logo_sage_chouette.png"
              alt="Photo de profil"
              width={120}
              height={120}
              className="rounded-full border"
            />
            <button
              type="button"
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Changer la photo
            </button>
            <p className="text-gray-500 text-sm mt-2">
              JPG ou PNG. Max 2 Mo. Recommandé : 400×400px
            </p>
          </div>

          {/* Infos personnelles */}
          <section>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="text-purple-600">👤</span> Informations personnelles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-1 font-medium">Prénom</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full border rounded px-4 py-2"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Nom</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full border rounded px-4 py-2"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Email professionnel</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border rounded px-4 py-2"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Téléphone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full border rounded px-4 py-2"
                />
              </div>
            </div>
          </section>

          {/* Infos professionnelles */}
          <section>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="text-purple-600">📋</span> Informations professionnelles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-1 font-medium">Matière enseignée</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full border rounded px-4 py-2"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Établissement</label>
                <input
                  type="text"
                  name="school"
                  value={formData.school}
                  onChange={handleChange}
                  className="w-full border rounded px-4 py-2"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Grade</label>
                <input
                  type="text"
                  name="grade"
                  value={formData.grade}
                  onChange={handleChange}
                  className="w-full border rounded px-4 py-2"
                />
              </div>
            </div>
            <div className="mt-6">
              <label className="block mb-1 font-medium">Biographie professionnelle</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows="4"
                className="w-full border rounded px-4 py-2"
              ></textarea>
              <p className="text-sm text-gray-500 mt-1">
                Décrivez brièvement votre parcours, vos spécialités et votre vision pédagogique.
              </p>
            </div>
          </section>

          {/* Préférences */}
          <section>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="text-purple-600">🔒</span> Préférences de confidentialité
            </h2>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="isVisible"
                checked={formData.isVisible}
                onChange={handleChange}
                className="w-4 h-4"
              />
              <span>Rendre mon profil visible aux autres enseignants</span>
            </label>
          </section>

          <button
            type="submit"
            className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Sauvegarder le profil
          </button>
        </form>
      </div>
    </>
  );
}
