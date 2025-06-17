import React from "react";

export default function DragTile({ seance, provided, snapshot }) {
  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className="tuile font-medium"
      style={{
        backgroundColor: seance.couleur || "#fff8e1",
        border: "1px solid #f4d35e",
        borderRadius: "0.75rem",
        padding: "0.75rem",
        marginBottom: "0.5rem",
        cursor: snapshot.isDragging ? "grabbing" : "grab",
        zIndex: snapshot.isDragging ? 1000 : "auto",
        ...provided.draggableProps.style,
      }}
    >
      <strong>{seance.titre || "Sans titre"}</strong>
      <div style={{ fontSize: "0.8rem", marginTop: "0.25rem" }}>
        Objectif : {seance.objectif || "—"}
      </div>
      <div style={{ fontSize: "0.8rem", marginTop: "0.1rem" }}>
        Séance ID : {seance.seanceId || "—"}
      </div>
    </div>
  );
}
