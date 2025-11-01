"use client";

import Image from "next/image";
import logo from "../../public/foudever.jpeg";

type Lang = "pt" | "es";

interface HeaderProps {
  lang: Lang;
  setLang: (lang: Lang) => void;
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
}

export default function Header({ lang, setLang, theme, setTheme }: HeaderProps) {
  return (
    <header
      className={`mb-6 py-4 transition-colors flex flex-col items-center justify-center gap-3 text-center 
      ${theme === "dark"
        ? "bg-gray-800 text-gray-300 border-b border-gray-700"
        : "bg-gray-50 text-gray-700 border-b border-gray-200"}`}
    >
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 flex-wrap">
        <Image
          src={logo}
          alt="Logo DSPQ"
          width={40}
          height={40}
          className="rounded-md"
          priority
        />
        <h1 className="text-2xl font-semibold">DSPQ - Form. Técnico</h1>
      </div>

      <div className="flex items-center justify-center gap-2 mt-2 flex-wrap">
        <select
          value={lang}
          onChange={(e) => setLang(e.target.value as Lang)}
          className="border rounded-lg px-2 py-1 text-sm dark:bg-gray-800 dark:border-gray-600"
        >
          <option value="pt">🇧🇷 PT</option>
          <option value="es">🇪🇸 ES</option>
        </select>

        <button
          type="button"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="px-3 py-1 text-sm font-medium rounded-lg border transition-colors duration-200 
          hover:bg-blue-600 hover:text-white dark:border-gray-600 dark:hover:bg-blue-500"
        >
          {theme === "light" ? "🌙 Escuro" : "☀️ Claro"}
        </button>
      </div>
    </header>
  );
}
