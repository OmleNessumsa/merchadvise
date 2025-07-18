import type { ReactNode } from "react";
import "../globals.css";

export const metadata = {
  title: "Voorstel App",
  description: "Productvoorstel op basis van actuele data",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="nl">
      <body>{children}</body>
    </html>
  );
}
