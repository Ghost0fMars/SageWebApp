import React from "react";

export default function DragTile({ seance, provided, snapshot }) {
  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className="tuile font-medium"
      style={{
        backgroundColor: seance.couleur || "#FFFBEA", // cohérent avec ton thème
        border: "1px solid #e9e0c9",
        borderRadius: "0.75rem",
        padding: "0.75rem",
        marginBottom: "0.5rem",
        cursor: snapshot.isDragging ? "grabbing" : "grab",
        zIndex: snapshot.isDragging ? 1000 : "auto",
        ...provided.draggableProps.style,
      }}
    >
      <strong>{seance.title || seance.titre || "Sans titre"}</strong>
      {seance.subtitle && (
        <div style={{ fontSize: "0.8rem", marginTop: "0.25rem" }}>
          {seance.subtitle}
        </div>
      )}
      {seance.objectif && (
        <div style={{ fontSize: "0.8rem", marginTop: "0.25rem" }}>
          Objectif : {seance.objectif}
        </div>
      )}
    </div>
  );
}
