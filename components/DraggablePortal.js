import { createPortal } from "react-dom";

export default function DraggablePortal({ children }) {
  if (typeof window === "undefined") return null;
  return createPortal(children, document.body);
}