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

    await updateRecord("pzop_event", id, updates);
    setIsEditing(false); // Vypneme editační mód
    alert("Změny byly uloženy!");
  };

  if (loading)
    return (
      <div className="p-10 text-center uppercase font-black">
        Načítám detail...
      </div>
    );
  if (!event)
    return <div className="p-10 text-center">Událost nenalezena.</div>;

  return (
    <>
      <section className="bg-gray-400 h-screen">
        <Header />  
        <div className="max-w-xl mx-auto p-6 pt-10">
          {!isEditing ? (
            /* --- MÓD ZOBRAZENÍ --- */
            <div className="bg-white rounded-3xl shadow-lg p-8 border-t-8 border-blue-500">
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
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              {event.popis}
            </p>

            <div className="flex gap-3 pt-6 border-t border-gray-100">
              <button
                onClick={() => setIsEditing(true)}
                className="flex-1 bg-blue-500 text-white font-bold py-3 rounded-xl hover:bg-blue-600 transition-colors"
              >
                Upravit
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-50 text-red-500 font-bold px-6 rounded-xl hover:bg-red-100 transition-colors"
              >
                Smazat
              </button>
            </div>
          </div>
        ) : (
          /* --- MÓD EDITACE (FORMULÁŘ) --- */
          <form
            onSubmit={handleUpdate}
            className="bg-white rounded-3xl shadow-lg p-8 space-y-4"
          >
            <h2 className="text-2xl text-center mb-4">Upravit událost</h2>

            <div className="grid grid-cols-[6rem_minmax(0,1fr)] items-center gap-4">
              <label className="text-right text-sm font-bold text-gray-700">
                Název:
              </label>
              <input
                type="text"
                className="w-full border p-2 rounded-lg focus:border-blue-500 outline-none"
                value={event.nazev}
                onChange={(e) => setEvent({ ...event, nazev: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-[6rem_minmax(0,1fr)] items-center gap-4">
              <label className="text-right text-sm font-bold text-gray-700">
                Datum:
              </label>
              <input
                type="date"
                className="w-full border p-2 rounded-lg focus:border-blue-500 outline-none"
                value={event.datum}
                onChange={(e) => setEvent({ ...event, datum: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-[6rem_minmax(0,1fr)] items-center gap-4">
              <label className="text-right text-sm font-bold text-gray-700">
                Předmět:
              </label>
              <input
                type="text"
                className="w-full border p-2 rounded-lg focus:border-blue-500 outline-none"
                value={event.zkratka}
                onChange={(e) => setEvent({ ...event, zkratka: e.target.value })}
              />
            </div>


            <div className="grid grid-cols-[6rem_minmax(0,1fr)] items-start gap-4">
              <label className="text-right text-sm font-bold text-gray-700 mt-2">
                Popis:
              </label>
              <textarea
                className="w-full border p-2 rounded-lg h-32 focus:border-blue-500 outline-none"
                value={event.popis}
                onChange={(e) => setEvent({ ...event, popis: e.target.value })}
              ></textarea>
            </div>

            <div className="grid grid-cols-[6rem_minmax(0,1fr)] items-center gap-4">
              <div className="text-right text-sm font-bold text-gray-700 mt-2">
                Test:
              </div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={event.test === 1}
                  onChange={(e) => setEvent({ ...event, test: e.target.checked ? 1 : 0 })}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Je to test?</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-50 flex m-auto mb-3 items-center justify-center gap-2 bg-blue-500 text-white font-bold py-3 rounded-3xl hover:bg-blue-600 transition-colors"
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
              onClick={handleDelete}
              className="w-50 flex m-auto items-center justify-center gap-2 bg-red-500 text-white font-bold py-3 rounded-3xl hover:bg-red-600 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path d="M9 3a1 1 0 00-1 1H5a1 1 0 100 2h14a1 1 0 100-2h-3a1 1 0 00-1-1H9zm-2 6a1 1 0 011 1v9a2 2 0 002 2h6a2 2 0 002-2v-9a1 1 0 112 0v9a4 4 0 01-4 4H9a4 4 0 01-4-4v-9a1 1 0 011-1z" />
              </svg>
              Smazat událost
            </button>
          </form>
        )}
      </div>
    </section>
    </>
  );
}
