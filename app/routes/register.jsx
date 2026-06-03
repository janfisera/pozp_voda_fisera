/**
 * Registration page component for new users.
 * @component
 * @returns {JSX.Element} The registration form for creating an account.
 *
 * Features:
 * - Tracks form input state.
 * - Submits new user data to the database.
 */
import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { insertRecord } from "../server/sql";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    jmeno: "",
    prijmeni: "",
    email: "",
    heslo: "",
  });
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Vložíme nového uživatele do DB
      await insertRecord("pzop_user", {
        jmeno: formData.jmeno,
        prijmeni: formData.prijmeni,
        email: formData.email.trim().toLowerCase(),
        heslo: formData.heslo,
      });

      alert("Registrace úspěšná! Nyní se můžete přihlásit.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      setError("Chyba při registraci. E-mail již může existovat.");
    }
  };

  return (
    <div className="min-h-screen bg-[#EAECEF] flex items-center justify-center p-4">
      <main className="w-full max-w-sm bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
        <h2 className="text-center font-bold text-gray-800 text-lg mb-6">
          Registrace účtu
        </h2>

        {error && (
          <div className="bg-red-50 text-red-600 text-xs p-3 rounded-xl mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <fieldset className="border-none p-0 m-0">
            <label className="block text-xs font-medium text-gray-400 mb-1">
              Jméno
            </label>
            <input
              type="text"
              required
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm"
              onChange={(e) =>
                setFormData({ ...formData, jmeno: e.target.value })
              }
            />
          </fieldset>

          <fieldset className="border-none p-0 m-0">
            <label className="block text-xs font-medium text-gray-400 mb-1">
              Příjmení
            </label>
            <input
              type="text"
              required
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm"
              onChange={(e) =>
                setFormData({ ...formData, prijmeni: e.target.value })
              }
            />
          </fieldset>

          <fieldset className="border-none p-0 m-0">
            <label className="block text-xs font-medium text-gray-400 mb-1">
              E-mail
            </label>
            <input
              type="email"
              required
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm"
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </fieldset>

          <fieldset className="border-none p-0 m-0">
            <label className="block text-xs font-medium text-gray-400 mb-1">
              Heslo
            </label>
            <input
              type="password"
              required
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm"
              onChange={(e) =>
                setFormData({ ...formData, heslo: e.target.value })
              }
            />
          </fieldset>

          <button
            type="submit"
            className="w-full bg-[#4E56FF] text-white font-bold py-3.5 rounded-full text-sm"
          >
            Registrovat se
          </button>
        </form>

        <p className="text-center text-xs text-gray-500 mt-4">
          Už máte účet?{" "}
          <Link to="/login" className="text-blue-600 font-bold">
            Přihlaste se
          </Link>
        </p>
      </main>
    </div>
  );
}
