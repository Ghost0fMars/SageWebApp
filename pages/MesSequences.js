import Header from "@/components/Header";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function MesSequences() {
  const { data: session, status } = useSession();
  const [sequences, setSequences] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated") {
      const fetchSequences = async () => {
        const res = await fetch("/api/sequences");
        const data = await res.json();
        setSequences(data);
        setLoading(false);
      };
      fetchSequences();
    }
  }, [status]);

  if (status === "loading" || loading) {
    return (
      <>
        <Header />
        <div className="container">
          <h1>Mes séquences</h1>
          <p>Chargement en cours...</p>
        </div>
      </>
    );
  }

  if (status === "unauthenticated") {
    return (
      <>
        <Header />
        <div className="container">
          <h1>Mes séquences</h1>
          <p>Connecte-toi pour voir tes séquences.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="container">
        <h1>Mes séquences</h1>
        {sequences.length === 0 ? (
          <p>Aucune séquence enregistrée.</p>
        ) : (
          <ul>
            {sequences.map((seq) => (
              <li key={seq.id} style={{ marginBottom: "2rem" }}>
                <h3>{seq.title}</h3>
                <p><strong>Compétence :</strong> {seq.content.competence}</p>
                <div
                  style={{ background: "#f9f9f9", padding: "1rem", borderRadius: "8px" }}
                  dangerouslySetInnerHTML={{ __html: seq.content.seancesDetaillees }}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
