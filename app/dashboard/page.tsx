'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardShell from '@/src/components/dashboard-shell';

type MeResponse = {
  ok?: boolean;
  message?: string;
  item?: {
    user: {
      id: string;
      name: string;
      email: string;
      roleType: string;
    };
  };
};

type SessionUser = {
  id: string;
  name: string;
  email: string;
  roleType: string;
};

const TOKEN_STORAGE_KEY = process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY || 'token';

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [user, setUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        const response = await fetch('/api/auth/me', { credentials: 'include' });
        const data: MeResponse = await response.json();
        if (!response.ok || !data.ok || !data.item?.user) {
          router.replace('/login');
          return;
        }
        setUser(data.item.user);
      } catch {
        setErrorMessage('No se pudo cargar la sesion');
      } finally {
        setLoading(false);
      }
    };
    void run();
  }, [router]);

  const onLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } finally {
      window.localStorage.removeItem(TOKEN_STORAGE_KEY);
      router.replace('/login');
    }
  };

  if (loading) {
    return <main className="min-h-screen bg-[var(--surface)] p-6">Cargando sesion...</main>;
  }

  return (
    <DashboardShell user={user} title="Dashboard" subtitle="Centro operativo" onLogout={onLogout}>
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="panel-shell rounded-2xl p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">Usuario</p>
          <p className="mt-3 font-display text-xl font-bold text-[var(--primary-strong)]">{user?.name || '-'}</p>
          <p className="mt-2 text-sm text-[var(--text-muted)]">{user?.email || '-'}</p>
        </div>
        <div className="panel-shell rounded-2xl p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">Rol</p>
          <p className="mt-3 font-display text-xl font-bold text-[var(--primary)]">{user?.roleType || '-'}</p>
          <p className="mt-2 text-sm text-[var(--text-muted)]">Control de permisos y acceso.</p>
        </div>
        <div className="panel-shell rounded-2xl p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">Estado</p>
          <p className="mt-3 font-display text-xl font-bold text-[var(--accent-orange-strong)]">Sesion activa</p>
          <p className="mt-2 text-sm text-[var(--text-muted)]">Autenticacion y rutas privadas funcionando.</p>
        </div>
      </div>

      {errorMessage ? (
        <div className="mt-4 rounded-2xl border border-[rgba(186,26,26,0.2)] bg-[rgba(255,225,194,0.6)] px-4 py-3 text-sm text-[var(--accent-danger)]">
          {errorMessage}
        </div>
      ) : null}
    </DashboardShell>
  );
}
