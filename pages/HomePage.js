import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Schedule from "@/components/Schedule";
import { DragDropContext } from "react-beautiful-dnd";

export default function HomePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [cases, setCases] = useState({
    sidebar: [],
  });

  const refreshSeances = async () => {
    if (!session?.user?.id) return;

    const { sequenceId } = router.query;
    const query = sequenceId ? `?sequenceId=${sequenceId}` : "";
    const res = await fetch(`/api/seances${query}`);
    const data = await res.json();

    if (!Array.isArray(data)) {
      console.error("❌ L'API /api/seances a renvoyé une erreur :", data);
      return;
    }

    const grouped = data.reduce((acc, seance) => {
      const key = seance.position || "sidebar";
      if (!acc[key]) acc[key] = [];
      acc[key].push(seance);
      return acc;
    }, {});
    setCases(grouped);
  };

  useEffect(() => {
    refreshSeances();

    const handler = () => refreshSeances();
    window.addEventListener("refresh-seances", handler);

    return () => window.removeEventListener("refresh-seances", handler);
  }, [session, router.query]);

  const handleDrag = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceId = source.droppableId;
    const destId = destination.droppableId;

    if (sourceId === destId && source.index === destination.index) return;

    let movedItem;

    setCases((prev) => {
      const sourceList = Array.from(prev[sourceId] || []);
      const destList = Array.from(prev[destId] || []);

      [movedItem] = sourceList.splice(source.index, 1);
      destList.splice(destination.index, 0, movedItem);

      return {
        ...prev,
        [sourceId]: sourceList,
        [destId]: destList,
      };
    });

    if (movedItem) {
      fetch(`/api/seances/${movedItem.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ position: destId }),
      })
        .then((res) => res.json())
        .then((updated) => {
          console.log("✅ Position MAJ :", updated);
          refreshSeances();
        })
        .catch((err) => {
          console.error("❌ Erreur PATCH :", err);
        });
    } else {
      console.error("❌ movedItem introuvable");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8]">
      <Header />

      <DragDropContext onDragEnd={handleDrag}>
        <main className="main-content flex gap-8 px-6 mt-8 relative">
          <div className="w-[240px] relative z-[50]">
            <Sidebar 
              seances={cases["sidebar"] || []}
              onClearSidebar={() => {
                setCases((prev) => ({ ...prev, sidebar: [] }));
              }}
            />

          </div>

          <div className="flex-1 z-0 relative">
            <Schedule cases={cases} />
          </div>
        </main>
      </DragDropContext>
    </div>
  );
}
