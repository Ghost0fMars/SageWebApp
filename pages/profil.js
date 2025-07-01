import Header from "@/components/Header";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function Profile() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    messagerie: "",
    phone: "",
    subject: "",
    school: "",
    grade: "",
    bio: "",
    isVisible: true,
    photoUrl: "",
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Charger le profil existant
    fetch("/api/user/profil")
      .then((res) => res.json())
      .then((data) => {
        if (data) setFormData((prev) => ({ ...prev, ...data }));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        // On ignore la clé "photo"
        if (
          key !== "photo" &&
          value !== undefined &&
          value !== null &&
          value !== "" &&
          value !== "undefined"
        ) {
          form.append(key, value);
        }
      });

      const res = await fetch("/api/user/profil", {
        method: "POST",
        body: form,
      });
      if (res.ok) {
        setMessage("Profil sauvegardé !");
      } else {
        setMessage("Erreur lors de la sauvegarde.");
      }
    } catch (err) {
      setMessage("Erreur réseau.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span>Chargement...</span>
      </div>
    );
  }

  return (
    <>
      <Header />

      <div className="container">
        {/* Bandeau titre */}
        <div className="bg-blue-600 text-white rounded-t-lg px-6 py-6 mb-8">
          <h1 className="text-3xl font-bold">Mon Profil Enseignant</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col items-center">
            <Image
              src="/Logo.png"
              alt="Photo de profil"
              width={120}
              height={120}
              className="rounded-full border"
            />
          </div>

          {/* Infos personnelles */}
          <section>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="text-purple-600"></span> Informations personnelles
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
                  name="messagerie"
                  value={formData.messagerie}
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
              <span className="text-purple-600"></span> Informations professionnelles
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
            </div>
          </section>

          <button
            type="submit"
            className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Sauvegarder le profil
          </button>
          {message && <p className="mt-4">{message}</p>}
        </form>
      </div>
    </>
  );
}