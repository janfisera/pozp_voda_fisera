import { useState, useEffect } from "react";
import EventItem from "../components/EventItem";

/**
 * Stránka se seznamem událostí (Route /events)
 */
export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Načtení dat z databáze (Epsilon server)
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Tady nahraď URL adresy tvými reálnými cestami k PHP skriptům na Epsilonu
        const eventsRes = await fetch(
          "https://epsilon.spstrutnov.cz/voda/api/get_events.php",
        );
        const subjectsRes = await fetch(
          "https://epsilon.spstrutnov.cz/voda/api/get_subjects.php",
        );

        const eventsData = await eventsRes.json();
        const subjectsData = await subjectsRes.json();

        setEvents(eventsData);
        setSubjects(subjectsData);
      } catch (error) {
        console.error("Chyba při načítání dat:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading)
    return <div className="p-10 text-center">Načítám události...</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Seznam událostí</h1>

      {/* 2. Vykreslení komponent pomocí .map() */}
      <div className="flex flex-col">
        {events.length > 0 ? (
          events.map((event) => {
            // Najdeme ikonu předmětu podle zkratky
            const subject = subjects.find((s) => s.zkratka === event.zkratka);

            return (
              <EventItem key={event.id} event={event} icon={subject?.ikona} />
            );
          })
        ) : (
          <p className="text-gray-500">Žádné události nebyly nalezeny.</p>
        )}
      </div>
    </div>
  );
}
