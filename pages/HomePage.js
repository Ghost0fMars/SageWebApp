// pages/HomePage.js
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Schedule from "@/components/Schedule";
import { DragDropContext } from "react-beautiful-dnd";

export default function HomePage() {
  const [cases, setCases] = useState({});
  const userId = "session.user.id"; 

  const refreshTiles = async () => {
    const res = await fetch(`/api/seances-tiles?userId=${userId}`);
    const data = await res.json();

    const grouped = data.reduce((acc, tile) => {
      const key = tile.position || "sidebar";
      if (!acc[key]) acc[key] = [];
      acc[key].push(tile);
      return acc;
    }, {});
    setCases(grouped);
  };

  useEffect(() => {
    refreshTiles();

    const handler = () => refreshTiles();
    window.addEventListener("refresh-seances", handler);

    return () => window.removeEventListener("refresh-seances", handler);
  }, []);

  const handleDrag = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceId = source.droppableId;
    const destId = destination.droppableId;

    if (sourceId === destId && source.index === destination.index) return;

    setCases(prev => {
      const sourceList = Array.from(prev[sourceId] || []);
      const destList = Array.from(prev[destId] || []);

      const [movedItem] = sourceList.splice(source.index, 1);

      if (!destList.find(item => item.id === movedItem.id)) {
        destList.splice(destination.index, 0, movedItem);
      }

      fetch(`/api/seances-tiles/${movedItem.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ position: destId }),
      })
      .then(res => res.json())
      .then(updated => {
        console.log("✅ Position MAJ :", updated);
      })
      .catch(err => {
        console.error("❌ Erreur PATCH :", err);
      });

      return {
        ...prev,
        [sourceId]: sourceList,
        [destId]: destList,
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
            <Sidebar seances={cases.sidebar || []} refreshSeances={refreshTiles} />
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
