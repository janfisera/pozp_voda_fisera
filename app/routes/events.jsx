import { useState, useEffect } from "react";
import { selectRecords } from "../server/sql"; // Cesta k tvému sql.js
import EventItem from "../components/EventItem";

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        // Načteme události a předměty z tvých tabulek
        const eventsData = await selectRecords("pzop_event");
        const subjectsData = await selectRecords("pzop_subject");

        // Uložíme do stavu (pokud selectRecords vrátí pole)
        if (eventsData) setEvents(eventsData);
        if (subjectsData) setSubjects(subjectsData);
      } catch (error) {
        console.error("Chyba při načítání dat z DB:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading)
    return (
      <div className="p-10 text-center font-bold">
        Načítám data z databáze...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black text-gray-900 uppercase">
              Události
            </h1>
            <p className="text-gray-500">Aktuální přehled úkolů a testů</p>
          </div>
          {/* Tady může být tlačítko pro přidání, pokud ho budete chtít */}
        </header>

        <div className="space-y-1">
          {events.length > 0 ? (
            events.map((event) => {
              // Najdeme ikonu předmětu podle zkratky
              const subject = subjects.find((s) => s.zkratka === event.zkratka);

              return (
                <EventItem key={event.id} event={event} icon={subject?.ikona} />
              );
            })
          ) : (
            <div className="bg-white p-10 rounded-2xl text-center shadow-sm">
              <p className="text-gray-400">V databázi nejsou žádné události.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
