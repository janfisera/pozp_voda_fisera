/**
 * EventItem component for displaying a single event card.
 * @component
 * @param {Object} props - Component props.
 * @param {Object} props.event - Event data object.
 * @param {string} props.icon - Icon URL for the subject.
 * @returns {JSX.Element} The rendered event card.
 *
 * Features:
 * - Formats event date.
 * - Highlights test events with a colored border.
 */
import React from "react";
import { useNavigate } from "react-router"; // Opraveno z 'react-router-dom'

export default function EventItem({ event, icon }) {
  const navigate = useNavigate();

  // Formátování data z DB (YYYY-MM-DD)
  const dateObj = new Date(event.datum);
  const formattedDate = `${dateObj.getDate()}. ${dateObj.getMonth() + 1}.`;

  // Červený pruh pro testy
  const isTest = event.test === 1 || event.test === "1";

  return (
    <div
      onClick={() => navigate(`/events/${event.id}`)}
      className={`
                flex items-center bg-white p-4 mb-4 rounded-2xl shadow-sm 
                border-l-[12px] transition-all hover:scale-[1.01] cursor-pointer
                ${isTest ? "border-red-500" : "border-transparent"}
            `}
    >
      <div className="flex flex-col items-center justify-center min-w-[70px] pr-4 mr-4 border-r border-gray-100">
        <span className="text-gray-400 text-xs font-bold mb-1">
          {formattedDate}
        </span>
        <div className="w-10 h-10 flex items-center justify-center">
          <img
            src={icon}
            alt={event.zkratka}
            className="max-w-full max-h-full object-contain"
          />
        </div>
        <span className="text-gray-500 text-[10px] font-black uppercase mt-1">
          {event.zkratka}
        </span>
      </div>

      <div className="flex-1">
        <h3 className="text-gray-900 font-extrabold text-lg leading-tight">
          {event.nazev}
        </h3>
        <p className="text-gray-500 text-sm mt-1 line-clamp-2">{event.popis}</p>
      </div>
    </div>
  );
}
