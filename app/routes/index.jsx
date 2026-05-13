import { useState, useEffect } from "react";
import Header from "../components/header";
import EventItem from "../components/EventItem";
import { selectRecords } from "../server/sql";

export default function Home() {
  const [events, setEvents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filtrování a stránkování
  const [activeFilter, setActiveFilter] = useState("Vše");
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const eventsData = await selectRecords("pzop_event");
        const subjectsData = await selectRecords("pzop_subject");
        if (eventsData) setEvents(eventsData);
        if (subjectsData) setSubjects(subjectsData);
      } catch (err) {
        console.error("Chyba DB:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // 1. Filtrace událostí podle vybraného předmětu
  const filteredEvents =
    activeFilter === "Vše"
      ? events
      : events.filter((e) => e.zkratka === activeFilter);

  // 2. Stránkování (Zobrazit jen 4 nebo vše)
  const displayedEvents = showAll ? filteredEvents : filteredEvents.slice(0, 4);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-2xl mx-auto p-4">
        {/* FILTRY - Pilulky s ikonami */}
        <div className="flex gap-2 mb-8 overflow-x-auto py-2 scrollbar-hide">
          <button
            onClick={() => {
              setActiveFilter("Vše");
              setShowAll(false);
            }}
            className={`px-6 py-2 rounded-full font-bold text-sm transition-all border-2 
              ${
                activeFilter === "Vše"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-500 border-gray-100 hover:border-gray-300"
              }`}
          >
            Vše
          </button>

          {subjects.map((sub) => (
            <button
              key={sub.id}
              onClick={() => {
                setActiveFilter(sub.zkratka);
                setShowAll(false);
              }}
              className={`flex items-center gap-2 px-5 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-all border-2 
                ${
                  activeFilter === sub.zkratka
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-500 border-gray-100 hover:border-gray-300"
                }`}
            >
              <img
                src={sub.ikona}
                className={`w-4 h-4 ${activeFilter === sub.zkratka ? "invert" : "opacity-50"}`}
                alt=""
              />
              {sub.zkratka}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-10 font-bold text-gray-300">
            NAČÍTÁM...
          </div>
        ) : (
          <div className="flex flex-col">
            {displayedEvents.map((event) => (
              <EventItem
                key={event.id}
                event={event}
                icon={subjects.find((s) => s.zkratka === event.zkratka)?.ikona}
              />
            ))}

            {/* TLAČÍTKO ZOBRAZIT VŠE */}
            {!showAll && filteredEvents.length > 4 && (
              <button
                onClick={() => setShowAll(true)}
                className="mt-4 w-full bg-white border-2 border-blue-500 text-blue-500 font-bold py-4 rounded-[2rem] hover:bg-blue-50 transition-all"
              >
                Zobrazit vše ({filteredEvents.length})
              </button>
            )}

            {filteredEvents.length === 0 && (
              <p className="text-center text-gray-400 py-10">
                Žádné události pro tento předmět.
              </p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
