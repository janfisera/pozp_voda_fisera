/**
 * Settings page for account management.
 * @component
 * @returns {JSX.Element} The settings page with logout and delete account actions.
 *
 * Features:
 * - Logout current user.
 * - Delete the logged-in user from the database.
 */
import { useNavigate } from "react-router";
import { deleteRecord } from "../server/sql";
import Header from "../components/header";

export default function Settings() {
  const navigate = useNavigate();

  // Získání ID aktuálně přihlášeného uživatele z localStorage
  const loggedUser =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("loggedUser"))
      : null;
  const currentUserId = loggedUser ? loggedUser.id : 1;

  /**
   * NOVÉ: Funkce pro odhlášení (přepnutí uživatele)
   */
  const handleLogout = () => {
    // Smaže přihlášeného uživatele z paměti prohlížeče
    localStorage.removeItem("loggedUser");
    // Přesměruje na login
    navigate("/login");
  };

  const handleDeleteUser = async () => {
    if (
      confirm(
        "Opravdu chcete smazat tento uživatelský účet? Dojde také k odstranění všech přiřazených událostí.",
      )
    ) {
      try {
        await deleteRecord("pzop_user", currentUserId);
        alert("Uživatel byl úspěšně odstraněn z databáze.");
        localStorage.removeItem("loggedUser");
        navigate("/login");
      } catch (err) {
        console.error("Chyba při odstraňování uživatele:", err);
        alert("Chyba při komunikaci s databází.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#EAECEF]">
      <Header />

      {/* Zvětšena šířka na md:max-w-2xl pro lepší zobrazení na PC */}
      <main className="w-full md:max-w-2xl mx-auto p-4 md:mt-10">
        <article className="bg-white px-6 py-8 sm:p-10 rounded-[2rem] shadow-sm border border-gray-100">
          <h2 className="text-center md:text-left font-bold text-gray-800 text-sm mb-8 uppercase tracking-wider">
            Nastavení aplikace
          </h2>

          <div className="space-y-6">
            {/* HLAVNÍ NAVIGAČNÍ TLAČÍTKA - Na PC se seřadí vedle sebe do gridu */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* TLAČÍTKO PRO ODHLÁŠENÍ / PŘEPNUTÍ UŽIVATELE */}
              <button
                type="button"
                onClick={handleLogout}
                className="w-full bg-[#4E56FF] text-white font-bold py-3.5 rounded-full shadow-sm hover:bg-blue-700 active:scale-[0.99] transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <span></span> Přepnout / Odhlásit uživatele
              </button>

              <button
                type="button"
                onClick={() => navigate("/")}
                className="w-full bg-gray-200 text-gray-700 font-bold py-3.5 rounded-full text-sm hover:bg-gray-300 transition-all text-center block cursor-pointer"
              >
                Zpět na hlavní přehled
              </button>
            </div>

            <hr className="border-gray-100 my-4" />

            {/* Sekce pro smazání z DB */}
            <section className="bg-gray-50 p-5 rounded-2xl border border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-xs font-bold text-gray-400 uppercase mb-1">
                  Zóna nebezpečí
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Tato akce trvale odstraní účet i s daty.
                </p>
              </div>

              {/* Na PC už tlačítko pro smazání není přes celou obrazovku, ale má stabilní šířku */}
              <button
                type="button"
                onClick={handleDeleteUser}
                className="w-full sm:w-auto sm:min-w-[200px] bg-[#FF624E] text-white font-bold py-3.5 px-6 rounded-full shadow-sm hover:bg-red-600 active:scale-[0.99] transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <span></span> Odstranit účet z DB
              </button>
            </section>
          </div>
        </article>
      </main>
    </div>
  );
}
