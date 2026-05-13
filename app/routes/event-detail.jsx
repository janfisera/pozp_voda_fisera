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
      <Header />
      <div className="max-w-xl mx-auto p-6 mt-6">
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
            <h2 className="text-2xl font-black mb-4">Upravit událost</h2>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-400 mb-1">
                Název
              </label>
              <input
                type="text"
                className="w-full border-2 p-3 rounded-xl focus:border-blue-500 outline-none"
                value={event.nazev}
                onChange={(e) => setEvent({ ...event, nazev: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-400 mb-1">
                Popis
              </label>
              <textarea
                className="w-full border-2 p-3 rounded-xl h-32 focus:border-blue-500 outline-none"
                value={event.popis}
                onChange={(e) => setEvent({ ...event, popis: e.target.value })}
              ></textarea>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="flex-1 bg-green-500 text-white font-bold py-3 rounded-xl hover:bg-green-600"
              >
                Uložit změny
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-gray-100 text-gray-500 font-bold px-6 rounded-xl"
              >
                Zrušit
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
}
