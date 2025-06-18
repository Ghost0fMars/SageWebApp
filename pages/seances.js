import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Header from '@/components/Header';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

export default function Seances() {
  const router = useRouter();
  const { sequenceId } = router.query;

  const [seances, setSeances] = useState([]);
  const [sequence, setSequence] = useState(null); // ✅ Pour récupérer la compétence
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  // ✅ Charger séances + séquence
  useEffect(() => {
    const fetchData = async () => {
      if (!sequenceId) return;

      setLoading(true);

      // Fetch séances
      const resSeances = await fetch(`/api/seances?sequenceId=${sequenceId}`);
      const dataSeances = await resSeances.json();
      setSeances(dataSeances);

      // Fetch séquence pour compétence
      const resSequence = await fetch(`/api/sequences/${sequenceId}`);
      const dataSequence = await resSequence.json();
      setSequence(dataSequence);

      setLoading(false);
    };

    fetchData();
  }, [sequenceId]);

  // ✅ Mettre à jour localement
  const handleUpdate = (index, value) => {
    const updated = [...seances];
    const objectifMatch = value.match(/<p><strong>Objectif :<\/strong>(.*?)<\/p>/);
    const consigneMatch = value.match(/<p><strong>Consigne :<\/strong>(.*?)<\/p>/);

    updated[index].objectif = objectifMatch ? objectifMatch[1].trim() : '';
    updated[index].consigne = consigneMatch ? consigneMatch[1].trim() : '';
    updated[index].detailed = value; // ✅ Permet de garder le texte complet

    setSeances(updated);
  };

  // ✅ Sauvegarder toutes les séances
  const handleSaveAll = async () => {
    try {
      await Promise.all(
        seances.map(seance =>
          fetch(`/api/seances/${seance.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: seance.id,
              subtitle: seance.subtitle,
              objectif: seance.objectif,
              consigne: seance.consigne,
              detailed: seance.detailed,
            }),
          })
        )
      );
      alert("Toutes les séances ont été sauvegardées !");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la sauvegarde.");
    }
  };

  // ✅ Générer UNE séance avec Objectif + Compétence
  const handleGenerateOne = async (seance) => {
    if (!seance?.id) return;
    if (!sequence?.content?.competence) {
      alert("Compétence introuvable !");
      return;
    }

    setGenerating(true);

    try {
      // Appel API pour générer
      const res = await fetch("/api/genere-seance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          objectif: seance.objectif,
          competence: sequence.content.competence,
        }),
      });

      const data = await res.json();
      if (res.status !== 200) throw new Error(data.error);

      // PATCH DB
      await fetch(`/api/seances/${seance.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: seance.id,
          detailed: data.resultat,
        }),
      });

      // ✅ Mettre à jour l'état local pour Quill : INSTANTANÉ
      const updated = seances.map((s) =>
        s.id === seance.id ? { ...s, detailed: data.resultat } : s
      );
      setSeances(updated);

    } catch (err) {
      console.error(err);
      alert("Erreur lors de la génération : " + err.message);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <>
      <Header />
      <div className="container">
        <h1>Séances <span className="accent">détaillées</span></h1>

        {loading && <p>Chargement...</p>}
        {!loading && seances.length === 0 && <p>Aucune séance trouvée.</p>}

        {!loading && seances.map((seance, index) => (
          <div key={seance.id} style={{ marginBottom: '2rem' }}>
            <h2>{seance.title} {seance.subtitle || "Sans titre"}</h2>

            <ReactQuill
              theme="snow"
              value={
                seance.detailed
                  || `<p><strong>Objectif :</strong> ${seance.objectif || ''}</p><p><strong>Consigne :</strong> ${seance.consigne || ''}</p>`
              }
              onChange={(value) => handleUpdate(index, value)}
              style={{ height: '400px', overflowY: 'auto', marginBottom: '1rem' }}
            />

            <button
              className="button"
              onClick={() => handleGenerateOne(seance)}
              disabled={generating}
              style={{ marginBottom: '1rem' }}
            >
              {generating ? "Génération..." : "Générer cette séance"}
            </button>
          </div>
        ))}

        {seances.length > 0 && (
          <button className="button" onClick={handleSaveAll}>
            Sauvegarder toutes les séances
          </button>
        )}
      </div>
    </>
  );
}
