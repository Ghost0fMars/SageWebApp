import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';

export default function Sequence() {
  const router = useRouter();
  const { id } = router.query;

  const [sequence, setSequence] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      const res = await fetch(`/api/sequences/${id}`);
      const data = await res.json();

      setSequence(data);
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
        <h1>{sequence?.title}</h1>
        <p><strong>Compétence :</strong> {sequence?.content?.competence}</p>

        {sequence?.seances?.length === 0 ? (
          <p>Aucune séance trouvée pour cette séquence.</p>
        ) : (
          sequence.seances.map((seance) => (
            <div className="tile-seance">
              <Link href={`/seance/${seance.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <h3 style={{ marginBottom: '0.5rem', textDecoration: 'none' }}>
                  {seance.title} {seance.subtitle}
                </h3>
              </Link>
            </div>
          ))
        )}
      </div>
    </>
  );
}
