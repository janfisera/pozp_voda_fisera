/**
 * Event detail page with view and edit mode.
 * @component
 * @returns {JSX.Element} The detailed event card and edit form.
 *
 * Features:
 * - Fetches event detail by ID.
 * - Supports editing and deleting the event.
 */
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { selectRecords, updateRecord, deleteRecord } from "../server/sql";
import Header from "../components/header";

export default function EventDetail() {
  const { id } = useParams(); // Získá ID z adresy /events/123
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // Přepínač mezi zobrazením a editací
  const [loading, setLoading] = useState(true);

  // 1. Načtení dat konkrétní události při otevření stránky
  useEffect(() => {
    async function loadEvent() {
      const data = await selectRecords("pzop_event", `id = ${id}`);
      if (data && data.length > 0) {
        setEvent(data[0]);
      }
      setLoading(false);
    }
    loadEvent();
  }, [id]);

  // 2. Funkce pro smazání
  const handleDelete = async () => {
    if (window.confirm("Opravdu chceš tuto událost smazat?")) {
      await deleteRecord("pzop_event", id);
      navigate("/"); // Po smazání šup zpátky na seznam
    }
  };

  // 3. Funkce pro uložení změn (Update)
  const handleUpdate = async (e) => {
    e.preventDefault();
    const updates = {
      nazev: event.nazev,
      popis: event.popis,
      datum: event.datum,
      zkratka: event.zkratka,
      test: event.test,
    };

    try {
      await updateRecord("pzop_event", id, updates);
      setIsEditing(false); // Vypneme editační mód

      // ODEBRÁN ALERT: Už žádné ošklivé vyskakovací okno, rovnou jdeme na hlavní stranu
      navigate("/");
    } catch (err) {
      console.error("Chyba při ukládání úprav:", err);
      alert("Nepodařilo se změny uložit.");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center p-10 text-center uppercase font-black text-gray-400 ">
        Načítám detail...
      </div>
    );
  if (!event)
    return (
      <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center p-10 text-center text-gray-500">
        Událost nenalezena.
      </div>
    );

  return (
    <>
      <section className="bg-[#F3F4F6] min-h-screen pb-12 lg:bg-zinc-700 text-white">
        <Header />
        <div className="max-w-xl mx-auto p-4 md:p-6 pt-10">
          {!isEditing ? (
            /* --- MÓD ZOBRAZENÍ --- */
            <div className="bg-white rounded-3xl shadow-sm p-6 sm:p-8 border-t-8 border-blue-500">
              <div className="flex justify-between items-start mb-4">
                <span className="bg-gray-100 px-4 py-1 rounded-full text-sm font-bold text-gray-600">
                  {event.zkratka} | {event.datum}
                </span>
                {event.test === 1 && (
                  <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-black uppercase">
                    Důležitý Test
                  </span>
                )}
              </div>

              <h1 className="text-3xl font-black text-gray-900 mb-4">
                {event.nazev}
              </h1>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed whitespace-pre-wrap">
                {event.popis}
              </p>

              <div className="flex gap-3 pt-6 border-t border-gray-100">
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex-1 bg-blue-500 text-white font-bold py-3.5 rounded-xl hover:bg-blue-600 transition-colors cursor-pointer text-center"
                >
                  Upravit
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-50 text-red-500 font-bold px-6 rounded-xl hover:bg-red-100 transition-colors cursor-pointer"
                >
                  Smazat
                </button>
              </div>
            </div>
          ) : (
            /* --- MÓD EDITACE (FORMULÁŘ) --- */
            <form
              onSubmit={handleUpdate}
              className="bg-white rounded-3xl shadow-sm p-6 sm:p-8 space-y-5 border border-gray-100 lg:bg-zinc-900 lg:text-white"
            >
              <h2 className="text-xl font-bold text-gray-800 text-center mb-2 lg:text-white">
                Upravit událost
              </h2>

              <div className="flex flex-col sm:grid sm:grid-cols-[6rem_minmax(0,1fr)] items-center gap-1 sm:gap-4">
                <label className="sm:text-right text-xs sm:text-sm font-bold text-gray-500 w-full sm:w-auto">
                  Název:
                </label>
                <input
                  type="text"
                  required
                  className="w-full border border-gray-200 p-3 rounded-xl focus:border-blue-500 outline-none text-sm lg:bg-zinc-700 lg:text-white"
                  value={event.nazev || ""}
                  onChange={(e) =>
                    setEvent({ ...event, nazev: e.target.value })
                  }
                />
              </div>

              <div className="flex flex-col sm:grid sm:grid-cols-[6rem_minmax(0,1fr)] items-center gap-1 sm:gap-4">
                <label className="sm:text-right text-xs sm:text-sm font-bold text-gray-500 w-full sm:w-auto">
                  Datum:
                </label>
                <input
                  type="date"
                  required
                  className="w-full border border-gray-200 p-3 rounded-xl focus:border-blue-500 outline-none text-sm lg:bg-zinc-700 lg:text-white"
                  value={event.datum || ""}
                  onChange={(e) =>
                    setEvent({ ...event, datum: e.target.value })
                  }
                />
              </div>

              <div className="flex flex-col sm:grid sm:grid-cols-[6rem_minmax(0,1fr)] items-center gap-1 sm:gap-4">
                <label className="sm:text-right text-xs sm:text-sm font-bold text-gray-500 w-full sm:w-auto">
                  Předmět:
                </label>
                <input
                  type="text"
                  required
                  className="w-full border border-gray-200 p-3 rounded-xl focus:border-blue-500 outline-none text-sm lg:bg-zinc-700 lg:text-white"
                  value={event.zkratka || ""}
                  onChange={(e) =>
                    setEvent({ ...event, zkratka: e.target.value })
                  }
                />
              </div>

              <div className="flex flex-col sm:grid sm:grid-cols-[6rem_minmax(0,1fr)] items-start gap-1 sm:gap-4">
                <label className="sm:text-right text-xs sm:text-sm font-bold text-gray-500 w-full sm:w-auto sm:mt-2">
                  Popis:
                </label>
                <textarea
                  className="w-full border border-gray-200 p-3 rounded-xl h-32 focus:border-blue-500 outline-none text-sm resize-none lg:bg-zinc-700 lg:text-white"
                  value={event.popis || ""}
                  onChange={(e) =>
                    setEvent({ ...event, popis: e.target.value })
                  }
                ></textarea>
              </div>

              <div className="flex flex-col sm:grid sm:grid-cols-[6rem_minmax(0,1fr)] items-center gap-1 sm:gap-4">
                <div className="hidden sm:block"></div>
                <label className="flex items-center gap-2.5 cursor-pointer py-1">
                  <input
                    type="checkbox"
                    checked={event.test === 1}
                    onChange={(e) =>
                      setEvent({ ...event, test: e.target.checked ? 1 : 0 })
                    }
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <span className="text-sm font-medium text-gray-600">
                    Je to test?
                  </span>
                </label>
              </div>

              {/* TLAČÍTKA FORMULÁŘE */}
              <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white font-bold py-3.5 px-6 rounded-xl hover:bg-blue-600 transition-colors text-sm flex items-center justify-center gap-2 order-1 sm:order-2 cursor-pointer "
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-5 w-5"
                    aria-hidden="true"
                  >
                    <path d="M5 5a1 1 0 011-1h10a1 1 0 011 1v2h2a1 1 0 110 2h-1v10a2 2 0 01-2 2H6a2 2 0 01-2-2V9H3a1 1 0 110-2h2V5zm2 2V6h8v1H7zm-1 4h10v7H6v-7z" />
                  </svg>
                  Uložit změny
                </button>

                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="w-full bg-gray-100 text-gray-600 font-bold py-3.5 px-6 rounded-xl hover:bg-gray-200 transition-colors text-sm flex items-center justify-center order-2 sm:order-1 cursor-pointer lg:bg-zinc-900 lg:hover:bg-zinc-800 lg:text-white"
                >
                  Zrušit
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
