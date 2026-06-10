/**
 * Home page component displaying the user's events.
 * @component
 * @returns {JSX.Element} The dashboard with event filters and list view.
 *
 * Features:
 * - Loads events and subjects for the current user.
 * - Filters events by subject and toggles full list view.
 */
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import Header from "../components/header";
import EventItem from "../components/EventItem";
import { selectRecords } from "../server/sql";

export default function Home() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filtrování a stránkování
  const [activeFilter, setActiveFilter] = useState("Vše");
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        // 1. Zkontrolujeme, zda máme přihlášeného uživatele v localStorage
        const loggedUserStr = localStorage.getItem("loggedUser");

        if (!loggedUserStr) {
          // Pokud nikdo přihlášený není, pošleme ho na login
          navigate("/login");
          return;
        }

        const user = JSON.parse(loggedUserStr);

        // 2. Vytáhneme z DB POUZE úkoly, které patří přihlášenému uživateli
        const eventsData = await selectRecords(
          "pzop_event",
          `user_id = ${parseInt(user.id)}`,
        );
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
  }, [navigate]);

  // Filtrace událostí podle vybraného předmětu
  const filteredEvents =
    activeFilter === "Vše"
      ? events
      : events.filter((e) => e.zkratka === activeFilter);

  // Stránkování (Zobrazit jen 4 nebo vše)
  const displayedEvents = showAll ? filteredEvents : filteredEvents.slice(0, 4);

  return (
    <div className="min-h-screen bg-[#F3F4F6] lg:bg-zinc-700">
      <Header />

      <main className="max-w-2xl mx-auto p-4">
        {/* FILTRY - Pilulky s ikonami */}
        <div className="flex gap-2 mb-8 overflow-x-auto py-2 scrollbar-hide">
          <button
            onClick={() => {
              setActiveFilter("Vše");
              setShowAll(false);
            }}
            className={`px-6 py-2 rounded-full font-bold text-sm transition-all border-2 cursor-pointer
              ${
                activeFilter === "Vše"
                  ? "bg-[#4E56FF] text-white border-[#4E56FF] lg:bg-black"
                  : "bg-white text-gray-500 border-gray-100 hover:border-gray-300 lg:bg-black lg:text-white"
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
              className={`flex items-center gap-2 px-5 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-all border-2 cursor-pointer
                ${
                  activeFilter === sub.zkratka
                    ? "bg-[#4E56FF] text-white border-[#4E56FF] lg:bg-black"
                    : "bg-white text-gray-500 border-gray-100 hover:border-gray-300 lg:bg-zinc-700 lg:text-white"
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
          <div className="text-center py-10 font-bold text-gray-400 text-sm tracking-wider uppercase">
            NAČÍTÁM ÚKOLY...
          </div>
        ) : (
          <div className="flex flex-col gap-3">
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
                className="mt-2 w-full bg-white border border-gray-200 text-gray-600 font-bold py-4 rounded-2xl hover:bg-gray-50 transition-all text-sm cursor-pointer shadow-sm"
              >
                Zobrazit vše ({filteredEvents.length})
              </button>
            )}

            {filteredEvents.length === 0 && (
              <p className="text-center text-gray-400 py-12 text-sm">
                Žádné události pro tento předmět.
              </p>
            )}
          </div>
        )}
      </main>

      {/* Responzivní plovoucí plusko pro nový úkol */}
      <Link
        to="/events/new"
        className="fixed bottom-6 right-6 w-14 h-14 flex justify-center items-center rounded-full bg-[#4E56FF] hover:bg-blue-600 text-white text-2xl transition-all shadow-lg active:scale-95 z-50"
      >
        +
      </Link>
    </div>
  );
}
