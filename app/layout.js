'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import './globals.css';

const NAV_ITEMS = [
  { href: '/', label: 'Dashboard', icon: '🏠' },
  { href: '/add', label: 'Add Activity', icon: '➕' },
  { href: '/library', label: 'Library', icon: '📚' },
  { href: '/cheatsheet', label: 'Quick Reference', icon: '💡' },
];

function SafariBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Detect in-app browser (Messenger, Instagram, Facebook, etc.)
    const ua = navigator.userAgent || '';
    const isInAppBrowser =
      /FBAN|FBAV|Instagram|Messenger|LinkedInApp|MicroMessenger|Twitter/i.test(ua) ||
      (ua.includes('iPhone') && !ua.includes('Safari'));
    setShow(isInAppBrowser);
  }, []);

  if (!show) return null;

  return (
    <div style={{
      background: 'linear-gradient(135deg, #1a2e1a, #0f3020)',
      border: '1px solid rgba(74,222,128,0.3)',
      borderRadius: '12px',
      padding: '14px 18px',
      margin: '0 12px 16px',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px',
      fontSize: '0.88rem',
      color: '#c8efd4',
      lineHeight: 1.5,
    }}>
      <span style={{ fontSize: '1.4rem', flexShrink: 0 }}>🌱</span>
      <div>
        <strong style={{ color: '#4ade80', display: 'block', marginBottom: 4 }}>
          Open in Safari to install this app!
        </strong>
        Tap the <strong>···</strong> or <strong>Share</strong> button at the top of your screen → then choose <strong>"Open in Safari"</strong> → then tap Share → <strong>"Add to Home Screen"</strong>
      </div>
      <button
        onClick={() => setShow(false)}
        style={{ background: 'none', border: 'none', color: '#4ade80', cursor: 'pointer', fontSize: '1.1rem', flexShrink: 0, paddingTop: 2 }}
      >✕</button>
    </div>
  );
}

export default function RootLayout({ children }) {
  const pathname = usePathname();

  return (
    <html lang="en">
      <head>
        <title>Curiosity Cultivator</title>
        <meta name="description" content="Lesson Planner & Activity Database based on Peoria Tribe ECE Training" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />

        {/* PWA / iPhone home screen */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0f1923" />
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

          {/* ── Desktop Sidebar (hidden on mobile) ── */}
          <aside className="sidebar">
            <div className="sidebar-logo">
              <span className="logo-icon">🌱</span>
              <span>Curiosity<br />Cultivator</span>
            </div>
            <p className="nav-label">Menu</p>
            {NAV_ITEMS.map(item => (
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

          {/* ── Mobile Top Header (hidden on desktop) ── */}
          <header className="mobile-header">
            <span className="mobile-logo-icon">🌱</span>
            <span className="mobile-logo-text">Curiosity Cultivator</span>
          </header>

          {/* ── Main Content ── */}
          <main className="main-content fade-in">
            <SafariBanner />
            {children}
          </main>

          {/* ── Mobile Bottom Tab Bar (hidden on desktop) ── */}
          <nav className="bottom-tab-bar">
            {NAV_ITEMS.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={`tab-item ${pathname === item.href ? 'tab-active' : ''}`}
              >
                <span className="tab-icon">{item.icon}</span>
                <span className="tab-label">{item.label}</span>
              </Link>
            ))}
          </nav>

        </div>
      </body>
    </html>
  );
}
