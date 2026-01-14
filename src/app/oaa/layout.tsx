import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'OAA System - Over All Ability Rankings',
  description: 'Advanced Nurturing High School student ability ranking system',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0f172a',
};

export default function OAALayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="oaa-container">
      {children}
    </div>
  );
}
