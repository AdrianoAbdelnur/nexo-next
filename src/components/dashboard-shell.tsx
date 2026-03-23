'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type SessionUser = {
  name: string;
  email: string;
  roleType: string;
};

type DashboardShellProps = {
  user: SessionUser | null;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  onLogout?: () => void;
};

const navItems = [
  { href: '/dashboard', label: 'Resumen' },
  { href: '/dashboard/users', label: 'Usuarios', adminOnly: true },
];

export default function DashboardShell({ user, title, subtitle, children, onLogout }: DashboardShellProps) {
  const pathname = usePathname();

  return (
    <main className="min-h-screen overflow-hidden bg-[var(--surface-low)] text-[var(--text-main)]">
      <div className="mx-auto flex min-h-screen w-full max-w-[1600px]">
        <aside className="hidden w-72 flex-col border-r border-[#0d4466] bg-[linear-gradient(165deg,#05314c,#08496f)] px-5 py-6 text-white lg:flex">
          <div className="rounded-2xl border border-white/22 bg-white/10 px-4 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/88">Trailingsat</p>
            <h1 className="font-display mt-2 text-2xl font-extrabold">Nexo Panel</h1>
            <p className="mt-2 text-sm text-white/90">Control operativo y administracion tecnica.</p>
          </div>

          <nav className="mt-7 space-y-2">
            {navItems
              .filter((item) => !(item.adminOnly && user?.roleType !== 'admin'))
              .map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block rounded-xl px-3 py-2 text-sm font-semibold transition ${
                      active
                        ? 'bg-[#ff7a00] text-white border border-[#ff8f2b] shadow-[0_10px_18px_rgba(0,0,0,0.2)]'
                        : 'text-white/95 hover:bg-white/12'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
          </nav>

          <div className="mt-auto rounded-2xl border border-white/18 bg-white/10 px-4 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-white/88">Sesion</p>
            <p className="mt-2 text-sm font-semibold">{user?.name || 'Sin datos'}</p>
            <p className="text-xs text-white/90">{user?.roleType || '-'}</p>
          </div>
        </aside>

        <section className="relative flex min-w-0 flex-1 flex-col">
          <div className="pointer-events-none absolute inset-0 soft-grid opacity-35" />
          <header className="border-b border-[var(--border)] bg-white/95 px-5 py-4 backdrop-blur lg:px-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--primary)]">{subtitle}</p>
                <h2 className="font-display mt-1 text-3xl font-extrabold text-[var(--primary-strong)]">{title}</h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="orange-chip rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em]">
                  {user?.roleType || 'privado'}
                </span>
                {onLogout ? (
                  <button
                    type="button"
                    onClick={onLogout}
                    className="rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-sm font-semibold text-[var(--text-main)] hover:bg-[var(--surface-low)]"
                  >
                    Cerrar sesion
                  </button>
                ) : null}
              </div>
            </div>
          </header>

          <div className="flex-1 p-5 lg:p-8">{children}</div>
        </section>
      </div>
    </main>
  );
}
