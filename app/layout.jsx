// app/layout.jsx

export const metadata = {
  title: "Lopotichat Music Mix",
  description: "Un jeu musical basé sur les paroles !",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
