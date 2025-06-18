import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import { Document, Packer, Paragraph, TextRun } from 'docx';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

export default function Seances() {
  const router = useRouter();
  const { sequenceId } = router.query;

  const [seances, setSeances] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Charger les Seances réelles
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
      alert("Toutes les séances ont été sauvegardées !");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la sauvegarde des séances.");
    }
  };

  return (
    <>
      <Header />
      <div className="container">
        <h1>Séances <span className="accent">détaillées</span></h1>

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
