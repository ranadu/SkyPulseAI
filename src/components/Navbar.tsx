import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Bell, Wrench, BookOpen, Calculator, FlaskConical } from 'lucide-react';

const links = [
  { to: '/',               label: 'FLEET',    icon: LayoutDashboard },
  { to: '/alerts',         label: 'ALERTS',   icon: Bell },
  { to: '/maintenance',    label: 'MAINT',    icon: Wrench },
  { to: '/methodology',    label: 'ENG BASIS',icon: BookOpen },
  { to: '/worked-example', label: 'CALC',     icon: Calculator },
  { to: '/validation',     label: 'VALIDATE', icon: FlaskConical },
];

export default function Navbar() {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: 'rgba(7,10,16,0.92)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #1a2235',
      }}
    >
      <div className="max-w-screen-2xl mx-auto px-5 h-12 flex items-center gap-0">

        {/* Wordmark */}
        <NavLink to="/" className="flex items-center gap-3 mr-8 shrink-0">
          {/* Stylised diamond logo */}
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <polygon points="11,1 21,11 11,21 1,11" stroke="#e8a020" strokeWidth="1.5" fill="rgba(232,160,32,0.08)" />
            <polygon points="11,5 17,11 11,17 5,11" stroke="#22d3ee" strokeWidth="1" fill="none" />
            <circle cx="11" cy="11" r="2" fill="#e8a020" />
          </svg>
          <span style={{ fontFamily: 'var(--font-data)', color: '#e8a020', fontSize: 13, letterSpacing: '0.15em', fontWeight: 700 }}>
            SKYPULSE
          </span>
          <span style={{ fontFamily: 'var(--font-data)', color: '#22d3ee', fontSize: 13, letterSpacing: '0.1em' }}>
            AI
          </span>
        </NavLink>

        {/* Divider */}
        <div style={{ width: 1, height: 20, background: '#1a2235', marginRight: 24 }} />

        {/* Links */}
        <div className="flex items-center gap-0.5">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '0 12px',
                height: 32,
                fontFamily: 'var(--font-data)',
                fontSize: 10,
                letterSpacing: '0.12em',
                fontWeight: 600,
                color: isActive ? '#e8a020' : '#4a5a7a',
                background: isActive ? 'rgba(232,160,32,0.07)' : 'transparent',
                borderBottom: isActive ? '1px solid #e8a020' : '1px solid transparent',
                transition: 'color 0.15s, background 0.15s',
                textDecoration: 'none',
              })}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLAnchorElement;
                if (!el.classList.contains('active')) el.style.color = '#94a3b8';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLAnchorElement;
                if (el.getAttribute('aria-current') !== 'page') el.style.color = '#4a5a7a';
              }}
            >
              <Icon size={11} />
              {label}
            </NavLink>
          ))}
        </div>

        {/* Right side: sim indicator */}
        <div className="ml-auto flex items-center gap-2">
          <span style={{
            width: 6, height: 6, borderRadius: '50%',
            background: '#22c55e',
            boxShadow: '0 0 6px #22c55e',
            display: 'inline-block',
            animation: 'pulse 2s infinite',
          }} />
          <span style={{ fontFamily: 'var(--font-data)', fontSize: 9, letterSpacing: '0.15em', color: '#374561' }}>
            SIM ACTIVE
          </span>
        </div>
      </div>

      {/* Amber rule */}
      <div style={{ height: 1, background: 'linear-gradient(90deg, #e8a020 0%, rgba(232,160,32,0.15) 40%, transparent 70%)' }} />
    </nav>
  );
}
