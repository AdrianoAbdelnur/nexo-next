import Link from 'next/link';

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden text-[var(--text-main)]">
      <div className="pointer-events-none absolute inset-0 soft-grid opacity-50" />
      <div className="pointer-events-none absolute -left-20 top-0 h-72 w-72 rounded-full bg-[rgba(167,200,255,0.35)] blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-[rgba(58,95,148,0.18)] blur-3xl" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col justify-center px-6 py-10 lg:px-10">
        <div className="panel-shell grid overflow-hidden rounded-[30px] lg:grid-cols-[1.15fr_0.85fr]">
          <section className="relative border-b border-[rgba(195,198,209,0.65)] px-7 py-8 lg:border-b-0 lg:border-r lg:px-10 lg:py-12">
            <div className="flex items-center justify-between gap-4">
              <div className="blue-chip rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
                Panel operativo
              </div>
              <div className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--text-muted)]">
                Nexo / campo
              </div>
            </div>

            <div className="mt-10 max-w-2xl">
              <h1 className="font-display text-4xl font-extrabold leading-tight text-[var(--primary-strong)] sm:text-5xl">
                Coordinacion tecnica con criterio operativo, no con pantallas genericas.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-[var(--text-muted)] sm:text-lg">
                Unificamos solicitudes, asignacion de tecnicos, recursos y ejecucion de campo en una sola vista de trabajo, clara y trazable.
              </p>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-[rgba(195,198,209,0.72)] bg-white/70 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">Solicitudes</p>
                <p className="mt-3 font-display text-3xl font-bold text-[var(--primary)]">24</p>
                <p className="mt-2 text-sm text-[var(--text-muted)]">Cargadas y listas para coordinar.</p>
              </div>
              <div className="rounded-2xl border border-[rgba(195,198,209,0.72)] bg-white/70 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">Tecnicos</p>
                <p className="mt-3 font-display text-3xl font-bold text-[var(--primary)]">12</p>
                <p className="mt-2 text-sm text-[var(--text-muted)]">Agenda validada sin cruces.</p>
              </div>
              <div className="rounded-2xl border border-[rgba(195,198,209,0.72)] bg-white/70 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">Evidencias</p>
                <p className="mt-3 font-display text-3xl font-bold text-[var(--primary)]">98%</p>
                <p className="mt-2 text-sm text-[var(--text-muted)]">Cierre tecnico documentado.</p>
              </div>
            </div>
          </section>

          <aside className="primary-gradient relative flex flex-col justify-between px-7 py-8 text-white lg:px-10 lg:py-12">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/70">Acceso privado</p>
              <h2 className="font-display mt-4 text-3xl font-bold leading-tight">Entrar al centro de control</h2>
              <p className="mt-4 max-w-sm text-sm leading-6 text-white/78">
                Usa tu cuenta para entrar al panel, administrar usuarios y preparar el flujo de trabajo tecnico.
              </p>
            </div>

            <div className="mt-10 space-y-4">
              <Link
                href="/login"
                className="block rounded-2xl bg-white px-5 py-4 text-center text-sm font-semibold text-[var(--primary-strong)] shadow-[0_12px_24px_rgba(0,0,0,0.12)] hover:-translate-y-0.5 hover:bg-[var(--surface-low)]"
              >
                Iniciar sesion
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
