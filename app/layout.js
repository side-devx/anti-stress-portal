import './globals.css';

export const metadata = {
  title: "Portal Anti Stres",
  description: "Koleksi permainan sederhana untuk melepas stres",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
