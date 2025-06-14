import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Schedule from "@/components/Schedule";
import { DragDropContext } from "react-beautiful-dnd";

export default function HomePage() {
  const [cases, setCases] = useState({});

  // Nouvelle fonction pour forcer le rafraîchissement des séances
  const refreshSeances = async () => {
    const res = await fetch('/api/seances-tiles');
    const data = await res.json();

    // Regroupe les séances par position
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

    // Rafraîchir les séances après ajout
    const handler = () => refreshSeances();
    window.addEventListener("refresh-seances", handler);

    return () => window.removeEventListener("refresh-seances", handler);
  }, []);

  const handleDrag = (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;

    const sourceId = source.droppableId;
    const destId = destination.droppableId;

    if (sourceId === destId && source.index === destination.index) return;

    setCases(prev => {
      const sourceList = Array.from(prev[sourceId] || []);
      const destList = Array.from(prev[destId] || []);

      const [movedItem] = sourceList.splice(source.index, 1);

      // Évite la duplication
      if (!destList.find(item => item.id === movedItem.id)) {
        destList.splice(destination.index, 0, movedItem);
      }

      // Mise à jour en base de la position (corrigé : /api/seances/ au pluriel)
      fetch(`/api/seances/${movedItem.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ position: destId })
      });

      return {
        ...prev,
        [sourceId]: sourceList,
        [destId]: destList
      };
    });
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8]">
      <Header />

      <DragDropContext onDragEnd={handleDrag}>
        <main className="main-content flex gap-8 px-6 mt-8 relative">
          {/* Sidebar */}
          <div className="w-[240px] relative z-[50]">
            <Sidebar seances={cases.sidebar || []} refreshSeances={refreshSeances} />
          </div>

          {/* Emploi du temps */}
          <div className="flex-1 z-0 relative">
            <Schedule cases={cases} />
          </div>
        </main>
      </DragDropContext>
    </div>
  );
}