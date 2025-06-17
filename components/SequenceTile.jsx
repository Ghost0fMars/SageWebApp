import React from "react";

export default function SequenceTile({
  title,
  domaine,
  sousDomaine,
  objectif,
}) {
  const DOMAIN_COLORS = {
    Informatique: "#3B82F6",
    Mathématiques: "#10B981",
    Français: "#EF4444",
    Sciences: "#F59E0B",
    Arts: "#8B5CF6",
    Histoire: "#EC4899",
    EPS: "#06B6D4",
    Default: "#F4D35E",
  };
  const color = DOMAIN_COLORS[domaine] || DOMAIN_COLORS.Default;

  return (
    <div
      className="tile transition duration-200 hover:shadow-md"
      style={{
        backgroundColor: `${color}15`,
        borderRadius: "0.75rem", // cohérent avec .tile
        textDecoration: "none",   // forcer pas de soulignement
      }}
    >
      <h3 className="font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-sm text-gray-700 mb-1">
        <strong>Domaine :</strong> {domaine || "—"}
      </p>
      <p className="text-sm text-gray-700 mb-1">
        <strong>Sous-domaine :</strong> {sousDomaine || "—"}
      </p>
      <p className="text-sm text-gray-700">
        <strong>Objectif :</strong> {objectif || "—"}
      </p>
    </div>
  );
}
