// components/DragTile.jsx
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
        cursor: "grab",
        zIndex: snapshot.isDragging ? 1000 : "auto",
        ...provided.draggableProps.style,
      }}
    >
      <strong>{seance.titre}</strong>
      <div style={{ fontSize: "0.8rem" }}>{seance.domaine || "—"}</div>
      <div style={{ fontSize: "0.8rem" }}>{seance.competence || "—"}</div>
    </div>
  );
}
