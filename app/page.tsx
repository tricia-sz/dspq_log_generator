"use client";

import { useState, useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import FormSection from "./components/FormSection";

export default function Home() {
  const [lang, setLang] = useState<"pt" | "es">("pt");
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) setTheme(savedTheme);
  }, []);

  useEffect(() => {
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
