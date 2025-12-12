import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Dysauto-Dash | Hydration Tracker for Dysautonomia/POTS',
  description:
    'Personal hydration tracking app designed for managing Dysautonomia and POTS. Track sodium, potassium, fluid intake, and symptoms.',
  keywords: ['dysautonomia', 'POTS', 'hydration', 'electrolytes', 'sodium', 'health tracker'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans antialiased bg-gray-950 text-gray-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}
