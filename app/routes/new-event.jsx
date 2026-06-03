/**
 * Page component for creating a new event.
 * @component
 * @returns {JSX.Element} The new event form and subject selector.
 */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { insertRecord, selectRecords } from "../server/sql";
import Header from "../components/header";

export default function NewEvent() {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Pomocná funkce pro získání dnešního data ve formátu YYYY-MM-DD
  const getTodayDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Stavy pro formulář (s předvyplněným dnešním datem)
  const [formData, setFormData] = useState({
    nazev: "",
    popis: "",
    datum: getTodayDateString(), // ZADÁNÍ: Automaticky předvyplněno na dnešek
    zkratka: "",
    test: 0,
  });

  // Ochrana routy (Guard) + Načtení předmětů
  useEffect(() => {
    const loggedUserStr = localStorage.getItem("loggedUser");
    if (!loggedUserStr) {
      // Pokud není přihlášen, okamžitě ho vyhodíme na login a nepustíme dál
      navigate("/login");
      return;
    }
    setCheckingAuth(false);

    async function getSubs() {
      const data = await selectRecords("pzop_subject");
      if (data) setSubjects(data);
    }
    getSubs();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const loggedUserStr = localStorage.getItem("loggedUser");
    if (!loggedUserStr) {
      navigate("/login");
      return;
    }

    const user = JSON.parse(loggedUserStr);

    const recordToInsert = {
      ...formData,
      user_id: user.id,
    };

    try {
      await insertRecord("pzop_event", recordToInsert);
      navigate("/");
    } catch (err) {
      console.error("Chyba při ukládání úkolu:", err);
      alert("Nepodařilo se uložit úkol do databáze.");
    }
  };

  // Dokud kontrolujeme přihlášení, nevykreslíme prázdný formulář (předchází probliknutí)
  if (checkingAuth) {
    return <div className="min-h-screen bg-[#F3F4F6]" />;
  }

  return (
    <div className="min-h-screen bg-[#F3F4F6] pb-12">
      <Header />
      <main className="max-w-md mx-auto p-4 mt-6 md:mt-10">
        <div className="bg-white p-6 sm:p-8 rounded-[2rem] shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 text-center mb-6">
            Nová událost
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Název s validací délky */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-gray-400">Název:</label>
              <input
                type="text"
                required
                maxLength={50} // Ochrana DB před přetečením znaků
                placeholder="Např. Čtvrtletní práce"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:border-blue-500 outline-none transition-all"
                value={formData.nazev}
                onChange={(e) =>
                  setFormData({ ...formData, nazev: e.target.value })
                }
              />
            </div>

            {/* Předmět */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-gray-400">
                Předmět:
              </label>
              <select
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer"
                value={formData.zkratka}
                onChange={(e) =>
                  setFormData({ ...formData, zkratka: e.target.value })
                }
              >
                <option value="">Vyber předmět...</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.zkratka}>
                    {s.nazev_predmetu} ({s.zkratka})
                  </option>
                ))}
              </select>
            </div>

            {/* Datum */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-gray-400">Datum:</label>
              <input
                type="date"
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:border-blue-500 outline-none transition-all"
                value={formData.datum}
                onChange={(e) =>
                  setFormData({ ...formData, datum: e.target.value })
                }
              />
            </div>

            {/* Popis s validací délky */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-gray-400">Popis:</label>
              <textarea
                placeholder="Co se bude zkoušet..."
                maxLength={250} // Ochrana DB
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm h-28 resize-none focus:border-blue-500 outline-none transition-all"
                value={formData.popis}
                onChange={(e) =>
                  setFormData({ ...formData, popis: e.target.value })
                }
              ></textarea>
            </div>

            {/* Test checkbox */}
            <label className="flex items-center gap-2.5 py-2 cursor-pointer select-none">
              <input
                type="checkbox"
                id="test"
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                checked={formData.test === 1}
                onChange={(e) =>
                  setFormData({ ...formData, test: e.target.checked ? 1 : 0 })
                }
              />
              <span className="text-sm font-medium text-gray-600">
                Jedná se o důležitý test
              </span>
            </label>

            <div className="pt-4 flex flex-col gap-2">
              <button
                type="submit"
                className="w-full bg-[#4E56FF] text-white font-bold py-3.5 rounded-full text-sm cursor-pointer hover:bg-blue-700 transition-colors shadow-sm"
              >
                Vytvořit událost
              </button>

              <button
                type="button"
                onClick={() => navigate("/")}
                className="w-full bg-gray-100 text-gray-600 font-bold py-3.5 rounded-full text-sm cursor-pointer hover:bg-gray-200 transition-colors"
              >
                Zrušit
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
