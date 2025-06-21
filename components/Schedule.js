// Schedule.js

import { Droppable, Draggable } from "react-beautiful-dnd";
import DraggablePortal from "./DraggablePortal";
import DragTile from "./DragTile";

export default function Schedule({ cases, selectedDate }) {
  const jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];
  const heures = [
    "8h30", "9h00", "9h30", "10h00", "10h30", "11h00",
    "13h30", "14h00", "14h30", "15h00", "15h30", "16h00",
  ];

  // ✅ Calcule la date pour chaque jour de la semaine
  // ✅ Corrigé : calcul du Lundi
const monday = new Date(selectedDate);
const day = monday.getDay();
const diff = day === 0 ? -6 : 1 - day;
monday.setDate(monday.getDate() + diff);

const joursAvecDates = jours.map((jour, index) => {
  const date = new Date(monday);
  date.setDate(monday.getDate() + index);
  return {
    nom: jour,
    date: date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }),
  };
});


  return (
    <div className="emploi-du-temps w-full">
      <table className="emploi-table w-full bg-white border-collapse">
        <thead>
          <tr>
            <th className="heure border px-2 py-1"></th>
            {joursAvecDates.map((j) => (
              <th key={j.nom} className="border px-2 py-1">
                {j.nom}
                <br />
                <span className="text-xs text-gray-500">{j.date}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {heures.map((heure) => (
            <tr key={heure}>
              <td className="heure border px-2 py-1 font-bold">{heure}</td>
              {jours.map((jour, index) => {
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
                            .filter(Boolean)
                            .filter((seance) => {
                              if (!selectedDate) return true;
                              if (!seance.date) return true;
                              const sDate = new Date(seance.date);
                              return (
                                sDate.toDateString() ===
                                selectedDate.toDateString()
                              );
                            })
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
