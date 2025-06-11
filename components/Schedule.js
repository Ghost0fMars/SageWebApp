import { Droppable, Draggable } from "react-beautiful-dnd";
import DraggablePortal from "./DraggablePortal"; // Ajout de l'import

export default function Schedule({ cases }) {
  const jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];
  const heures = ["8h30", "9h00", "9h30", "10h00", "10h30", "11h00", "13h30", "14h00", "14h30", "15h00", "15h30", "16h00"];

  return (
    <div className="emploi-du-temps w-full">
      <table className="emploi-table w-full bg-white">
        <thead>
          <tr>
            <th className="heure"></th>
            {jours.map((jour) => (
              <th key={jour}>{jour}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {heures.map((heure) => (
            <tr key={heure}>
              <td className="heure">{heure}</td>
              {jours.map((jour) => {
                const droppableId = `${jour}-${heure}`;
                return (
                  <td key={droppableId} className="h-20 align-top">
                    <Droppable droppableId={droppableId}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className="h-full"
                        >
                          {(cases[droppableId] || []).map((seance, index) => (
                            <Draggable key={seance.id} draggableId={seance.id} index={index}>
                              {(provided, snapshot) => {
                                const tuile = (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className="tuile font-medium my-1"
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