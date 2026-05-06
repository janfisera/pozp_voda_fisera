import React from "react";
import { useNavigate } from "react-router-dom";

/**
 * @param {Object} event - data z pzop_event
 * @param {string} icon - url z pzop_subject
 */
const EventItem = ({ event, icon }) => {
  const navigate = useNavigate();

  const isTest = event.test === 1 || event.test === "1";

  return (
    <div
      // Tady pozor: Pokud se tvoje routa pro detail jmenuje event-detail.jsx,
      // pravděpodobně bude mít v configu cestu /events/:id
      onClick={() => navigate(`/events/${event.id}`)}
      className={`
        flex items-center bg-white p-4 mb-4 rounded-2xl shadow-sm 
        border-l-[12px] transition-all hover:scale-[1.01] cursor-pointer
        ${isTest ? "border-red-500" : "border-transparent"}
      `}
    >
      <div className="flex flex-col items-center min-w-[70px] pr-4 mr-4 border-r border-gray-100">
        <span className="text-gray-400 text-xs font-bold">{event.datum}</span>
        <img src={icon} alt="icon" className="w-8 h-8 my-1 object-contain" />
        <span className="text-gray-500 text-[10px] font-black">
          {event.zkratka}
        </span>
      </div>

      <div className="flex-1">
        <h3 className="text-gray-900 font-bold">{event.nazev}</h3>
        <p className="text-gray-500 text-sm line-clamp-2">{event.popis}</p>
      </div>
    </div>
  );
};

export default EventItem;
