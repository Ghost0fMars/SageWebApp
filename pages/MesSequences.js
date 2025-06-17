import Header from "@/components/Header";
import SequenceTile from "@/components/SequenceTile";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function MesSequences() {
  const { data: session, status } = useSession();
  const [sequences, setSequences] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleDelete = async (id) => {
  if (!confirm("Confirmer la suppression ?")) return;

  try {
    const res = await fetch(`/api/sequences/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setSequences(sequences.filter((seq) => seq.id !== id));
    } else {
      alert("Erreur lors de la suppression");
    }
  } catch (err) {
    console.error(err);
    alert("Erreur réseau");
  }
  };


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

            {sequences.map((seq) => (
  <div key={seq.id} className="flex items-start justify-between p-2 rounded-md">
    <Link href={`/sequence/${seq.id}`} className="no-underline flex-1 block">
      <SequenceTile
        title={seq.title}
        domaine={seq.content?.domaine}
        sousDomaine={seq.content?.sousDomaine}
        objectif={seq.content?.competence}
      />
    </Link>

    <button
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        handleDelete(seq.id);
      }}
      className="ml-4 bg-red-500 text-white rounded px-2 py-1 hover:bg-red-600"
      title="Supprimer cette séquence"
    >
      ✕
    </button>
  </div>
))}

          </div>
        )}
      </div>
    </>
  );
}
