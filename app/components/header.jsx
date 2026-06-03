import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";

/**
 * Header component for the app top navigation.
 * @component
 * @returns {JSX.Element} The header with avatar and settings link.
 *
 * Features:
 * - Displays user avatar and app title.
 * - Provides navigation to the main page and settings.
 */
export default function Header() {
  const location = useLocation(); // Sleduje změny adresy pro okamžité překreslení jména
  const [user, setUser] = useState(null);

  // Načtení uživatele z localStorage při každé změně stránky
  useEffect(() => {
    const loggedUserStr = localStorage.getItem("loggedUser");
    if (loggedUserStr) {
      try {
        setUser(JSON.parse(loggedUserStr));
      } catch (e) {
        console.error("Chyba při parsování uživatele v Headeru:", e);
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [location]);

  return (
    <header className="flex items-center justify-between p-4 border-b-2 bg-white">
      {/* Kliknutím na profilový obrázek se uživatel vrátí na hlavní přehled */}
      <Link to="/" className="flex-shrink-0">
        <img
          src="https://unchainedcrypto.com/wp-content/uploads/2023/07/pfp-nft.png"
          alt="Profilová fotografie"
          className="rounded-full h-12 w-12"
        />
      </Link>

      {/* Jméno uživatele se teď mění dynamicky podle přihlášeného člověka */}
      <h1 className="text-2xl font-medium">
        {user ? `${user.jmeno} ${user.prijmeni}` : "Nepřihlášený uživatel"}
      </h1>

      {/* NOVÉ: Tlačítko nastavení, které odkazuje na správu účtu */}
      <Link
        to="/settings"
        className="p-2 rounded-full hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors flex items-center justify-center"
        aria-label="Nastavení"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="h-7 w-7"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.43l-1.003.767c-.304.233-.446.617-.373.991l.006.032c.007.035.012.07.015.105.03.364.218.696.52.89l1.002.767a1.125 1.125 0 0 1 .26 1.43l-1.297 2.247a1.125 1.125 0 0 1-1.37.49l-1.216-.456c-.356-.133-.751-.072-1.076.124a6.57 6.57 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.43l1.004-.767c.304-.233.446-.617.372-.991l-.006-.032c-.006-.035-.011-.07-.015-.105-.03-.364-.219-.696-.52-.89l-1.002-.767a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.49l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.28z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"
          />
        </svg>
      </Link>
    </header>
  );
}
