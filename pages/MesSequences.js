import Header from "@/components/Header";
import SequenceTile from "@/components/SequenceTile";
import Link from "next/link";
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
          <h1 className="text-2xl font-bold mb-4">Mes séquences</h1>
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
          <h1 className="text-2xl font-bold mb-4">Mes séquences</h1>
          <p>Connecte-toi pour voir tes séquences.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="container">
        <h1 className="text-2xl font-bold mb-6">Mes séquences</h1>

        {sequences.length === 0 ? (
          <p>Aucune séquence enregistrée.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sequences.map((seq) => {
             console.log("Séquence =>", seq); // ✅ AJOUTE CE LOG ICI

            return (
              <Link key={seq.id} href={`/sequence/${seq.id}`} className="no-underline">
                <SequenceTile
                  title={seq.title}
                  domaine={seq.content?.domaine}
                  sousDomaine={seq.content?.sousDomaine}
                  objectif={seq.content?.competence}
              />
             </Link>
         );
      })}

          </div>
        )}
      </div>
    </>
  );
}
