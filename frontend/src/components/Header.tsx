import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getDollarQuote, type DollarQuote } from "../services/currencyService";

export function Header() {
  const token = localStorage.getItem("token");
  const [quote, setQuote] = useState<DollarQuote | null>(null);

  function handleLogout() {
    localStorage.removeItem("token");
    window.location.reload();
  }

  useEffect(() => {
    async function loadQuote() {
      const data = await getDollarQuote();
      setQuote(data);
    }
    loadQuote();
  }, []);

  const messageQuoteOff = "Contação não disponivel no momento";
  return (
    <header className="bg-gray-900 text-white shadow-md">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <Link
          to="/"
          className="text-xl font-bold tracking-wide hover:text-blue-400 transition-colors"
        >
          ToDo List <span className="text-blue-500">Orizon</span>
        </Link>

        <div className="text-sm text-gray-300">
          USD:{" "}
          <span className="text-green-400 font-semibold">
            R$ {quote?.cotacaoCompra?.toFixed(2) || messageQuoteOff}
          </span>
        </div>

        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link to="/" className="hover:text-blue-400 transition-colors">
            Home
          </Link>

          {!token && (
            <Link
              to="/login"
              className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-md transition-colors"
            >
              Login
            </Link>
          )}

          {token && (
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md transition-colors"
            >
              Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
