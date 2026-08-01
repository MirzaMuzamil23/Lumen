import "./globals.css";

export const metadata = {
  title: "Lumen — Premium Digital Studio",
  description: "A studio-grade product and design partner for teams who care about the details.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}