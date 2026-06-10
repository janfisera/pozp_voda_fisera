/**
 * Login page component for existing users.
 * @component
 * @returns {JSX.Element} The login form for authentication.
 *
 * Features:
 * - Validates credentials against the database.
 * - Stores authenticated user data in localStorage.
 */
import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { selectRecords } from "../server/sql";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const users = await selectRecords(
        "pzop_user",
        `LOWER(email) = '${email.trim().toLowerCase()}'`,
      );

      if (users && users.length > 0) {
        const user = users[0];
        if (user.heslo.toString().trim() === password.trim()) {
          // Uložíme přihlášeného uživatele (včetně jeho ID) do paměti prohlížeče
          localStorage.setItem("loggedUser", JSON.stringify(user));

          // Přesměrujeme na hlavní nástěnku
          navigate("/");
        } else {
          setError("Nesprávné heslo.");
        }
      } else {
        setError("Uživatel neexistuje.");
      }
    } catch (err) {
      setError("Chyba databáze.");
    }
  };

  return (
    <div className="min-h-screen bg-[#EAECEF] flex items-center justify-center p-4">
      <main className="w-full max-w-sm bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
        <h2 className="text-center font-bold text-gray-800 text-lg mb-6">
          Přihlášení
        </h2>
        {error && (
          <div className="bg-red-50 text-red-600 text-xs p-3 rounded-xl mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <fieldset className="border-none p-0 m-0">
            <label className="block text-xs font-medium text-gray-400 mb-1">
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm"
            />
          </fieldset>

          <fieldset className="border-none p-0 m-0">
            <label className="block text-xs font-medium text-gray-400 mb-1">
              Heslo
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm"
            />
          </fieldset>

          <button
            type="submit"
            className="w-full bg-[#4E56FF] text-white font-bold py-3.5 rounded-full text-sm cursor-pointer hover:bg-blue-700 transition-colors"
          >
            Přihlásit se
          </button>
        </form>
        <p className="text-center text-xs text-gray-500 mt-4">
          Nemáte účet?{" "}
          <Link to="/register" className="text-blue-600 font-bold">
            Zaregistrujte se
          </Link>
        </p>
      </main>
    </div>
  );
}
