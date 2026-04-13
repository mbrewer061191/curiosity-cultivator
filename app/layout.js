'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import './globals.css';

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { href: '/', label: 'Dashboard', icon: '🏠' },
    { href: '/add', label: 'Add New Activity', icon: '➕' },
    { href: '/library', label: 'My Activity Library', icon: '📚' },
    { href: '/cheatsheet', label: 'Quick Reference', icon: '💡' },
  ];

  return (
    <html lang="en">
      <head>
        <title>Curiosity Cultivator</title>
        <meta name="description" content="Lesson Planner & Activity Database based on Peoria Tribe ECE Training" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />

        {/* PWA / iPhone home screen */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#4ade80" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Curiosity" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>
        <div className="app-shell">
          <aside className="sidebar">
            <div className="sidebar-logo">
              <span className="logo-icon">🌱</span>
              <span>Curiosity<br />Cultivator</span>
            </div>
            <p className="nav-label">Menu</p>
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-link ${pathname === item.href ? 'active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </aside>
          <main className="main-content fade-in">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
