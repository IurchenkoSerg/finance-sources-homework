import "./globals.css";

export const metadata = {
  title: "Finance Sources",
  description: "Revenue report from two finance sources",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
