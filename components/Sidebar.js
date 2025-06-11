import { Draggable, Droppable } from "react-beautiful-dnd";
import { Trash2 } from "lucide-react";
import DraggablePortal from "./DraggablePortal";

export default function Sidebar({ seances, refreshSeances }) {
  const handleDeleteSidebarTuiles = async () => {
    const confirmDelete = window.confirm("Supprimer toutes les tuiles de la sidebar ?");
    if (!confirmDelete) return;

    const sidebarTuiles = seances.filter(seance => seance.position === "sidebar");
    console.log("Tuiles supprimées :", sidebarTuiles);

    await Promise.all(
      sidebarTuiles.map(seance =>
        fetch(`/api/seance/${seance.id}`, {
          method: 'DELETE'
        })
      )
    );

    refreshSeances();
  };

  return (
    <aside className="bibliotheque-tuiles">
      <div className="flex justify-center mb-4">
        <img src="/logo-sage.png" alt="Logo" width={60} />
      </div>

      <a href="/formulaire" className="button no-underline text-center font-semibold">
        + Créer une séquence
      </a>

      <Droppable droppableId="sidebar">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="flex flex-col gap-2 mt-4"
            style={{
              position: "relative",
              zIndex: snapshot.isDraggingOver ? 50 : 1,
              transition: "z-index 0.2s"
            }}
          >
            {seances.map((seance, index) => (
              <Draggable key={seance.id} draggableId={seance.id} index={index}>
                {(provided, snapshot) => {
                  const tuile = (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="tuile font-medium"
                      style={{
                        backgroundColor: seance.couleur,
                        zIndex: snapshot.isDragging ? 1000 : 'auto',
                        ...provided.draggableProps.style
                      }}
                    >
                      {seance.titre}
                    </div>
                  );
                  return snapshot.isDragging ? (
                    <DraggablePortal>{tuile}</DraggablePortal>
                  ) : tuile;
                }}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      <button
        onClick={handleDeleteSidebarTuiles}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 mt-6 rounded flex items-center justify-center gap-2">
        Supprimer les tuiles
      </button>
    </aside>
  );
}