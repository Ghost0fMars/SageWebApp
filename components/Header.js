import Link from "next/link";
import { signOut } from "next-auth/react";
import { UserCircle, Users, Newspaper, LogOut, Home, FileText } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-white shadow-md py-4">
      <div className="max-w-7xl mx-auto flex justify-center items-center px-4">
        <div className="header-buttons flex gap-4 items-center">
          
          <Link href="/HomePage" className="button flex items-center gap-2">
            <Home size={18} />
            Accueil
          </Link>
          
          <Link href="/classe" className="button flex items-center gap-2">
            <Users size={18} />
            Ma classe
          </Link>          

          <Link href="/MesSequences" className="button flex items-center gap-2">
            <FileText size={18} />
            Mes séquences
          </Link>

          <Link href="/fil" className="button flex items-center gap-2">
            <Newspaper size={18} />
            Mon fil
          </Link>

          <Link href="/profil" className="button flex items-center gap-2">
            <UserCircle size={18} />
            Mon profil
          </Link>

          <button
            onClick={() =>
              signOut({ redirect: false }).then(() => {
                window.location.href = "/auth/login";
              })
            }
            className="button flex items-center gap-2"
            title="Se déconnecter"
          >
            <LogOut size={18} />
            Déconnexion
          </button>
        </div>
      </div>
    </header>
  );
}