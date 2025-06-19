import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Header from '@/components/Header';

export default function SeanceDetails() {
  const router = useRouter();
  const { id } = router.query;

  const [seance, setSeance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      const res = await fetch(`/api/seances/${id}`);
      const data = await res.json();

      setSeance(data);
      setLoading(false);
    };

    fetchData();
  }, [id]);

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
        <h1>
            {seance?.title}
            {seance?.subtitle ? ` ${seance.subtitle}` : ''}
        </h1>


<p><strong>Objectif :</strong> {seance?.objectif || "Non défini"}</p>
<p><strong>Consigne :</strong> {seance?.consigne || "Non définie"}</p>

<div
  style={{
    marginTop: '2rem',
    padding: '1rem',
    border: '1px solid #ddd',
    borderRadius: '8px',
    background: '#f9f9f9',
  }}
  dangerouslySetInnerHTML={{
    __html: seance?.detailed || "<p>Pas de contenu détaillé disponible.</p>"
  }}
/>

      </div>
    </>
  );
}
