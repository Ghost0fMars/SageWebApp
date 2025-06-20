// Schedule.js
import { Droppable, Draggable } from "react-beautiful-dnd";
import DraggablePortal from "./DraggablePortal";
import DragTile from "./DragTile";

export default function Schedule({ cases }) {
  const jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];
  const heures = [
    "8h30", "9h00", "9h30", "10h00", "10h30", "11h00",
    "13h30", "14h00", "14h30", "15h00", "15h30", "16h00"
  ];

  return (
    <div className="emploi-du-temps w-full">
      <table className="emploi-table w-full bg-white border-collapse">
        <thead>
          <tr>
            <th className="heure border px-2 py-1"></th>
            {jours.map((jour) => (
              <th key={jour} className="border px-2 py-1">{jour}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {heures.map((heure) => (
            <tr key={heure}>
              <td className="heure border px-2 py-1 font-bold">{heure}</td>
              {jours.map((jour) => {
                const droppableId = `${jour}-${heure}`;
                return (
                  <td key={droppableId} className="h-20 align-top border px-2 py-1">
                    <Droppable droppableId={droppableId}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className="h-full"
                        >
                          {(cases[droppableId] || [])
                            .filter(Boolean) // ✅ PROTECTION : ignorer undefined/null
                            .map((seance, index) => (
                              <Draggable
                                key={seance.id}
                                draggableId={seance.id.toString()}
                                index={index}
                              >
                                {(provided, snapshot) => {
                                  const tuile = (
                                    <DragTile
                                      seance={seance}
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
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
