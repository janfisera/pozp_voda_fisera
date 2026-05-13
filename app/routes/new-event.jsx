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
    <>
      <Header />
      <div className="max-w-md mx-auto p-6 bg-white mt-10 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-black mb-6">Nová událost</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-1">Název</label>
            <input
              type="text"
              required
              className="w-full border p-2 rounded-lg"
              onChange={(e) =>
                setFormData({ ...formData, nazev: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-1">Předmět</label>
            <select
              required
              className="w-full border p-2 rounded-lg"
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

          <div>
            <label className="block text-sm font-bold mb-1">Datum</label>
            <input
              type="date"
              required
              className="w-full border p-2 rounded-lg"
              onChange={(e) =>
                setFormData({ ...formData, datum: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-1">Popis</label>
            <textarea
              className="w-full border p-2 rounded-lg"
              onChange={(e) =>
                setFormData({ ...formData, popis: e.target.value })
              }
            ></textarea>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="test"
              className="mr-2"
              onChange={(e) =>
                setFormData({ ...formData, test: e.target.checked ? 1 : 0 })
              }
            />
            <label htmlFor="test" className="font-bold">
              Je to test? (Bude červený)
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-bold py-3 rounded-xl hover:bg-blue-600 transition-colors"
          >
            Uložit událost
          </button>
        </form>
      </div>
    </>
  );
}
