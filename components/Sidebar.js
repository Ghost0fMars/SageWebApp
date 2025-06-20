import { Draggable, Droppable } from "react-beautiful-dnd";
import { Trash2 } from "lucide-react";
import DraggablePortal from "./DraggablePortal";
import DragTile from "./DragTile";

export default function Sidebar({ seances, onClearSidebar }) {
  const handleDeleteSidebarTiles = () => {
    if (!confirm("Supprimer toutes les tuiles de la sidebar ?")) return;
    if (onClearSidebar) onClearSidebar(); // ✅ action remontée au parent
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
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="flex flex-col gap-2 mt-4"
          >
            {seances.map((tile, index) => (
              <Draggable
                key={tile.id || index}
                draggableId={(tile.id || index).toString()}
                index={index}
              >
                {(provided, snapshot) => {
                  const tuile = (
                    <DragTile
                      seance={tile}
                      provided={provided}
                      snapshot={snapshot}
                    />
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
        onClick={handleDeleteSidebarTiles}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 mt-6 rounded flex items-center justify-center gap-2"
      >
        <Trash2 size={16} /> Supprimer les tuiles
      </button>
    </aside>
  );
}
