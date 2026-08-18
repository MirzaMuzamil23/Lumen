import "./globals.css";
import { ThemeProvider } from "@/lib/ThemeContext";

export const metadata = {
  title: "Lumen — Premium Digital Studio",
  description: "A studio-grade product and design partner for teams who care about the details.",
};

const noFlashScript = `
  (function () {
    try {
      var stored = localStorage.getItem("lumen_theme");
      var theme = stored || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
      document.documentElement.setAttribute("data-theme", theme);
    } catch (e) {}
  })();
`;

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: noFlashScript }} />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}