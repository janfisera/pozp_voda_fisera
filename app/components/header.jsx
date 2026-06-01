import { Link } from "react-router";

export default function Header() {
  return (
    <header className="flex items-center justify-between p-4 border-b-2 bg-white">
      <Link to="/">
        <img
          src="https://unchainedcrypto.com/wp-content/uploads/2023/07/pfp-nft.png"
          alt="Profilová fotografie"
          className="rounded-full h-12 w-12"
        />
      </Link>
      <h1 className="text-2xl font-medium">Eliška Nováková</h1>

      {/* Tlačítko teď funguje jako odkaz na formulář */}

    </header>
  );
}
