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

  // ✅ Charger les Seances liées à la Sequence
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

  const handleUpdate = (index, field, value) => {
    const updated = [...seances];
    updated[index][field] = value;
    setSeances(updated);
  };

  const handleSaveAll = async () => {
    try {
      // ✅ PATCH chaque Seance pour sauvegarder objectif final
      await Promise.all(
        seances.map(seance =>
          fetch(`/api/seances/${seance.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              objectif: seance.objectif,
            }),
          })
        )
      );

      // ✅ Crée les Tiles une fois les séances sauvegardées
      await fetch('/api/seances-tiles', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sequenceId,
        }),
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
      // ✅ Recharger la Sequence pour récupérer progression + domaine + sousDomaine
      const sequenceRes = await fetch(`/api/sequences/${sequenceId}`);
      const sequenceData = await sequenceRes.json();

      const progression = sequenceData.content?.progression || "";
      const domaine = sequenceData.content?.domaine || "";
      const sousDomaine = sequenceData.content?.sousDomaine || "";

      if (!progression) {
        alert("Impossible de générer : la progression est vide !");
        return;
      }

      console.log("✅ Génération détaillée pour :", { progression, domaine, sousDomaine });

      // ✅ Appel à l'API IA
      const res = await fetch("/api/genere-seances", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sequence: progression,
          domaine,
          sousDomaine,
        }),
      });

      const data = await res.json();

      if (res.status !== 200) {
        console.error("❌ Erreur API :", data);
        alert("Erreur API : " + data.error);
        return;
      }

      // ✅ Découper le texte généré
      const seanceBlocks = data.resultat.split(/Séance \d+ :/i).filter(Boolean);

      // ✅ PATCH chaque Seance avec son détail généré
      await Promise.all(
        seances.map((seance, i) =>
          fetch(`/api/seances/${seance.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              objectif: seanceBlocks[i] || "Objectif généré indisponible",
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

        {!loading && seances.map((seance, index) => (
          <div key={seance.id} style={{ marginBottom: '2rem' }}>
            <h2>{seance.title}</h2>
            <ReactQuill
              theme="snow"
              value={seance.objectif}
              onChange={(value) => handleUpdate(index, "objectif", value)}
              style={{
                height: '200px',
                overflowY: 'auto',
                marginBottom: '1rem'
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
