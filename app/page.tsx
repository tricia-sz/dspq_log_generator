"use client";

import { useState, useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import FormSection from "./components/FormSection";

export default function Home() {
  const [lang, setLang] = useState<"pt" | "es">("pt");
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme && savedTheme !== theme) {
      setTimeout(() => setTheme(savedTheme), 0);
    }
  }, []);
  useEffect(() => {
    if (typeof window === "undefined") return;

    localStorage.setItem("theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <>
      <Header lang={lang} setLang={setLang} theme={theme} setTheme={setTheme} />
        <FormSection lang={lang} theme={theme} />
      <Footer theme={theme} />
    </>
  );
}
