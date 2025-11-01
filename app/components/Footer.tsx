"use client";

interface FooterProps {
  theme: "light" | "dark";
}

export default function Footer({ theme }: FooterProps) {
  return (
    <footer
      className={`mt-8 py-4 text-center rounded-xl transition-colors 
      ${theme === "dark"
        ? "bg-gray-800 text-gray-300 border-t border-gray-700"
        : "bg-gray-50 text-gray-700 border-t border-gray-200"}`}
    >
      Developed by{" "}
      <a
        href="https://tricia-sz.netlify.app"
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-blue-600 hover:underline dark:text-blue-400"
      >
        Patrícia Souza
      </a>{" "}
      💙 2025
    </footer>
  );
}
