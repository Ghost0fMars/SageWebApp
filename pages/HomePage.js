import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Schedule from "@/components/Schedule";
import { DragDropContext } from "react-beautiful-dnd";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import fr from "date-fns/locale/fr";

registerLocale("fr", fr);

export default function HomePage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [cases, setCases] = useState({
    sidebar: [],
  });
  const [selectedDate, setSelectedDate] = useState(new Date());

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
      if (seance.date) {
        const seanceDate = new Date(seance.date).toDateString();
        if (seanceDate !== selectedDate.toDateString()) return acc;
      }

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
  }, [session, router.query, selectedDate]);

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
        body: JSON.stringify({
          position: destId,
          date: selectedDate,
        }),
      })
        .then((res) => res.json())
        .then((updated) => {
          console.log("✅ Position et date MAJ :", updated);
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
        <main className="main-content flex gap-8 px-6 mt-4 relative">
          <div className="w-[240px] relative z-[50] flex flex-col items-center gap-4">
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              dateFormat="dd/MM/yyyy"
              locale="fr"
              calendarStartDay={1}
              className="border px-3 py-2 rounded text-center"
              popperPlacement="bottom"
              popperClassName="!z-[9999]"
              placeholderText="Choisir une date"
            />

            <Sidebar
              seances={cases["sidebar"] || []}
              onClearSidebar={() => {
                setCases((prev) => ({ ...prev, sidebar: [] }));
              }}
            />
          </div>

          <div className="flex-1 z-0 relative">
            <Schedule cases={cases} selectedDate={selectedDate} />
          </div>
        </main>
      </DragDropContext>
    </div>
  );
}
