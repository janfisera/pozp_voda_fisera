import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { insertRecord, selectRecords } from "../server/sql";
import Header from "../components/header";

export default function NewEvent() {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);

  // Stavy pro formulář
  const [formData, setFormData] = useState({
    nazev: "",
    popis: "",
    datum: "",
    zkratka: "",
    test: 0,
  });

  // Načteme předměty pro select menu
  useEffect(() => {
    async function getSubs() {
      const data = await selectRecords("pzop_subject");
      if (data) setSubjects(data);
    }
    getSubs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Zavoláme tvou funkci z sql.js
    const result = await insertRecord("pzop_event", formData);

    // Pokud se povedlo, vrátíme se na hlavní stránku
    navigate("/");
  };

  return (
    <section className="bg-gray-400 h-screen">
      <Header />
      <div className="max-w-sm mx-auto p-4 bg-white mt-10 rounded-2xl shadow-lg">
        <h2 className="text-xl mb-6 text-center">Nová událost</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center">
            <label className="w-24 text-right text-sm mr-4 text-gray-500">Název:</label>
            <input
              type="text"
              required
              className="flex-1 border-b-2 bg-gray-300 p-2 rounded-lg"
              onChange={(e) =>
                setFormData({ ...formData, nazev: e.target.value })
              }
            />
          </div>

          <div className="flex items-center">
            <label className="w-24 text-right text-sm mr-4 text-gray-500">Předmět:</label>
            <select
              required
              className="flex-1 border-b-2 bg-gray-300 p-2 rounded-lg"
              onChange={(e) =>
                setFormData({ ...formData, zkratka: e.target.value })
              }
            >
              <option value="">Vyber předmět...</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.zkratka}>
                  {s.nazev_predmetu}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center">
            <label className="w-24 text-right text-sm mr-4 text-gray-500">Datum:</label>
            <input
              type="date"
              required
              className="flex-1 border-b-2 bg-gray-300 p-2 rounded-lg"
              onChange={(e) =>
                setFormData({ ...formData, datum: e.target.value })
              }
            />
          </div>

          <div className="flex items-start">
            <label className="w-24 text-right text-sm mr-4 mt-2 text-gray-500">Popis:</label>
            <textarea
              className="flex-1 border-b-2 bg-gray-300 p-2 rounded-lg"
              onChange={(e) =>
                setFormData({ ...formData, popis: e.target.value })
              }
            ></textarea>
          </div>

          <div className="flex items-center">
            <label htmlFor="test" className="text-sm mr-2 text-gray-500">
              Test:
            </label>
            <input
              type="checkbox"
              id="test"
              onChange={(e) =>
                setFormData({ ...formData, test: e.target.checked ? 1 : 0 })
              }
            />
          </div>

          <button
            type="submit"
            className="w-40 mx-auto block bg-blue-500 text-white font-bold py-3 rounded-3xl hover:bg-blue-600 transition-colors"
          >
            + Přidat
          </button>
        </form>
      </div>
    </section>
  );
}
