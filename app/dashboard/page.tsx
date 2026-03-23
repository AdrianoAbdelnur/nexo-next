'use client';

import { useDashboardSession } from '@/src/components/dashboard-session-layout';

export default function DashboardPage() {
  const { user } = useDashboardSession();

  return (
    <>
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
    </>
  );
}
