import { useNavigate } from "react-router";
import { deleteRecord } from "../server/sql";
import Header from "../components/header";

/**
 * Stránka nastavení aplikace.
 * Umožňuje sémantickou správu aktuálního uživatelského profilu.
 * @component
 */
export default function Settings() {
  const navigate = useNavigate();
  const currentUserId = 1; // Eliška Nováková

  const handleDeleteUser = async () => {
    if (
      confirm(
        "Opravdu chcete smazat svůj uživatelský účet? Tím smažete i všechny své události.",
      )
    ) {
      try {
        await deleteRecord("pzop_user", currentUserId);
        alert("Uživatel byl odstraněn.");
        navigate("/login");
      } catch (err) {
        console.error(err);
        alert("Chyba při odstraňování účtu.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6]">
      <Header />
      <main className="w-full md:max-w-md mx-auto p-4 md:mt-10">
        <article className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm">
          <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">
            Nastavení účtu
          </h2>

          <div className="space-y-4">
            <section className="p-4 bg-gray-50 rounded-2xl">
              <h3 className="text-sm font-bold text-gray-700 mb-1">
                Správa dat
              </h3>
              <p className="text-xs text-gray-500 mb-4">
                Odstraněním účtu dojde k nevratnému smazání z databáze.
              </p>

              <button
                type="button"
                onClick={handleDeleteUser}
                className="w-full bg-red-500 text-white font-bold py-3 rounded-full text-sm hover:bg-red-600 transition-colors"
              >
                Odstranit uživatele
              </button>
            </section>

            <button
              type="button"
              onClick={() => navigate("/")}
              className="w-full bg-gray-200 text-gray-700 font-bold py-3 rounded-full text-sm hover:bg-gray-300 transition-colors"
            >
              Zpět na přehled
            </button>
          </div>
        </article>
      </main>
    </div>
  );
}
