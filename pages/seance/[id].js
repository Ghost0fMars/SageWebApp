import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Header from "@/components/Header";

// ✅ Import Quill dynamiquement (Next.js SSR safe)
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

// Config Quill : seulement les outils utiles
const quillModules = {
  toolbar: [
    [{ header: [1, 2, false] }], // titres H1, H2
    ["bold", "italic", "underline"], // mise en forme
    [{ list: "ordered" }, { list: "bullet" }], // listes
    ["clean"], // bouton "effacer la mise en forme"
  ],
};

export default function SeanceDetails() {
  const router = useRouter();
  const { id } = router.query;

  const [seance, setSeance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // Champs éditables
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [objectif, setObjectif] = useState("");
  const [consigne, setConsigne] = useState("");
  const [detailed, setDetailed] = useState("");

  // Onglets
  const [activeTab, setActiveTab] = useState("infos");

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      const res = await fetch(`/api/seances/${id}`);
      const data = await res.json();

      setSeance(data);
      setTitle(data.title || "");
      setSubtitle(data.subtitle || "");
      setObjectif(data.objectif || "");
      setConsigne(data.consigne || "");
      setDetailed(data.detailed || "");
      setLoading(false);
    };

    fetchData();
  }, [id]);

  const handleSave = async () => {
    const res = await fetch(`/api/seances/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        subtitle,
        objectif,
        consigne,
        detailed,
      }),
    });

    if (res.ok) {
      const updated = await res.json();
      setSeance(updated);
      setIsEditing(false);
    } else {
      alert("❌ Erreur lors de la sauvegarde");
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="container">
          <h1>Chargement...</h1>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="container">
        {isEditing ? (
          <div className="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow-md">
            <h1 className="text-2xl font-bold mb-6 flex items-center">
              ✏️ Modifier la séance
            </h1>

            {/* Onglets */}
            <div className="flex border-b mb-4">
              <button
                onClick={() => setActiveTab("infos")}
                className={`px-4 py-2 ${
                  activeTab === "infos"
                    ? "border-b-2 border-blue-500 font-semibold"
                    : "text-gray-500"
                }`}
              >
                Infos générales
              </button>
              <button
                onClick={() => setActiveTab("contenu")}
                className={`px-4 py-2 ${
                  activeTab === "contenu"
                    ? "border-b-2 border-blue-500 font-semibold"
                    : "text-gray-500"
                }`}
              >
                Contenu détaillé
              </button>
            </div>

            {/* Contenu des onglets */}
            {activeTab === "infos" && (
              <div className="space-y-4">
                <div>
                  <label className="block font-medium mb-1">Titre</label>
                  <input
                    className="w-full border rounded-lg p-2"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1">Sous-titre</label>
                  <input
                    className="w-full border rounded-lg p-2"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1">Objectif</label>
                  <textarea
                    className="w-full border rounded-lg p-2"
                    value={objectif}
                    onChange={(e) => setObjectif(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1">Consigne</label>
                  <textarea
                    className="w-full border rounded-lg p-2"
                    value={consigne}
                    onChange={(e) => setConsigne(e.target.value)}
                  />
                </div>
              </div>
            )}

            {activeTab === "contenu" && (
              <div>
                <label className="block font-medium mb-2">Contenu détaillé</label>
                <ReactQuill
                  value={detailed}
                  onChange={setDetailed}
                  className="bg-white rounded-lg border"
                  theme="snow"
                  modules={quillModules}
                />
              </div>
            )}

            {/* Boutons */}
            <div className="mt-6 flex gap-4">
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600"
              >
                💾 Sauvegarder
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded-lg shadow hover:bg-gray-500"
              >
                ❌ Annuler
              </button>
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold">
              {seance?.title}
              {seance?.subtitle ? ` ${seance.subtitle}` : ""}
            </h1>

            <p className="mt-4">
              <strong>Objectif :</strong> {seance?.objectif || "Non défini"}
            </p>
            <p>
              <strong>Consigne :</strong> {seance?.consigne || "Non définie"}
            </p>

            <div
              className="mt-6 p-4 border rounded-lg bg-gray-50 prose contenu-seance"
              dangerouslySetInnerHTML={{
                __html:
                  seance?.detailed ||
                  "<p>Pas de contenu détaillé disponible.</p>",
              }}
            />

            <button
              onClick={() => setIsEditing(true)}
              className="mt-6 px-4 py-2 bg-yellow-400 text-black rounded-lg shadow hover:bg-yellow-500"
            >
              ✏️ Modifier
            </button>
          </div>
        )}
      </div>
    </>
  );
}
