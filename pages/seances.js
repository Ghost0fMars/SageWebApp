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
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    const fetchSeances = async () => {
      if (!sequenceId) return;
      setLoading(true);
      const res = await fetch(`/api/seances?sequenceId=${sequenceId}`);
      const data = await res.json();
      setSeances(data);
      setLoading(false);
    };
    fetchSeances();
  }, [sequenceId]);

  const handleUpdate = (index, value) => {
    const updated = [...seances];

    const objectifMatch = value.match(/<p><strong>Objectif :<\/strong>(.*?)<\/p>/);
    const consigneMatch = value.match(/<p><strong>Consigne :<\/strong>(.*?)<\/p>/);

    updated[index].objectif = objectifMatch ? objectifMatch[1].trim() : '';
    updated[index].consigne = consigneMatch ? consigneMatch[1].trim() : '';

    setSeances(updated);
  };

  const handleSaveAll = async () => {
    try {
      await Promise.all(
        seances.map(seance =>
          fetch(`/api/seances/${seance.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              subtitle: seance.subtitle,
              objectif: seance.objectif,
              consigne: seance.consigne,
            }),
          })
        )
      );

      await fetch('/api/seances-tiles', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sequenceId }),
      });

      alert("Toutes les séances ont été sauvegardées et exportées en tuiles !");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la sauvegarde des séances.");
    }
  };

  const handleGenerateDetailed = async () => {
    if (!sequenceId) {
      alert("Aucun sequenceId détecté !");
      return;
    }

    setGenerating(true);

    try {
      const sequenceRes = await fetch(`/api/sequences/${sequenceId}`);
      const sequenceData = await sequenceRes.json();

      const progression = sequenceData.content?.progression || "";
      const domaine = sequenceData.content?.domaine || "";
      const sousDomaine = sequenceData.content?.sousDomaine || "";

      if (!progression) {
        alert("Impossible de générer : la progression est vide !");
        return;
      }

      const res = await fetch("/api/genere-seances", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sequence: progression, domaine, sousDomaine }),
      });

      const data = await res.json();

      if (res.status !== 200) {
        console.error("❌ Erreur API :", data);
        alert("Erreur API : " + data.error);
        return;
      }

      const seanceBlocks = data.resultat.split(/Séance \d+ :/i).filter(Boolean);

      await Promise.all(
        seances.map((seance, i) =>
          fetch(`/api/seances/${seance.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              objectif: seanceBlocks[i] || "Objectif généré indisponible",
              consigne: "",
            }),
          })
        )
      );

      window.location.reload();

    } catch (err) {
      console.error(err);
      alert("Erreur lors de la génération automatique.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <>
      <Header />
      <div className="container">
        <h1>Séances <span className="accent">détaillées</span></h1>

        {seances.length > 0 && (
          <button
            className="button"
            onClick={handleGenerateDetailed}
            disabled={generating}
            style={{ marginBottom: '1rem' }}
          >
            {generating ? "Génération en cours..." : "Générer séances détaillées"}
          </button>
        )}

        {loading && <p>Chargement des séances...</p>}
        {!loading && seances.length === 0 && <p>Aucune séance trouvée.</p>}

        {!loading && seances.map((seance) => (
          <div key={seance.id} style={{ marginBottom: '2rem' }}>
            <h2>{seance.title} {seance.subtitle || seance.objectif?.split('.')[0] || "Titre non défini"}</h2>

            <ReactQuill
              theme="snow"
              value={`<p><strong>Objectif :</strong> ${seance.objectif || ''}</p><p><strong>Consigne :</strong> ${seance.consigne || ''}</p>`}
              onChange={(value) => handleUpdate(seances.indexOf(seance), value)}
              style={{
                height: '300px',
                overflowY: 'auto',
                marginBottom: '1rem',
              }}
            />
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
