'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

type LoginResponse = {
  ok?: boolean;
  message?: string;
  item?: {
    token: string;
    user: {
      id: string;
      name: string;
      email: string;
      roleType: string;
    };
  };
};

const TOKEN_STORAGE_KEY = process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY || 'token';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data: LoginResponse = await response.json();

      if (!response.ok || !data.ok || !data.item?.token) {
        setErrorMessage(data.message || 'No se pudo iniciar sesion');
        return;
      }

      window.localStorage.setItem(TOKEN_STORAGE_KEY, data.item.token);
      router.replace('/dashboard');
    } catch {
      setErrorMessage('Error de conexion');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden text-[var(--text-main)]">
      <div className="pointer-events-none absolute inset-0 soft-grid opacity-45" />
      <div className="pointer-events-none absolute left-0 top-0 h-72 w-72 rounded-full bg-[rgba(167,200,255,0.38)] blur-3xl" />

      <div className="relative mx-auto grid min-h-screen max-w-7xl items-center gap-8 px-6 py-8 lg:grid-cols-[1.1fr_0.9fr] lg:px-10">
        <section className="rounded-[30px] bg-[var(--primary-strong)] px-7 py-8 text-white shadow-[0_20px_60px_rgba(0,30,64,0.18)] lg:px-10 lg:py-12">
          <div className="w-fit rounded-full border border-white/18 bg-white/8 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/72">
            Sesion privada
          </div>
          <h1 className="font-display mt-8 text-4xl font-extrabold leading-tight sm:text-5xl">
            Entrar al tablero de coordinacion tecnica.
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-7 text-white/78 sm:text-base">
            Desde aca controlas solicitudes, agenda de tecnicos, recursos y el flujo operativo del campo con una identidad clara y trazabilidad total.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/12 bg-white/8 p-4 backdrop-blur-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/60">Seguridad</p>
              <p className="mt-3 font-display text-2xl font-bold">JWT + cookie</p>
              <p className="mt-2 text-sm text-white/72">Acceso persistente y cierre limpio.</p>
            </div>
            <div className="rounded-2xl border border-white/12 bg-white/8 p-4 backdrop-blur-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/60">Control</p>
              <p className="mt-3 font-display text-2xl font-bold">Rutas privadas</p>
              <p className="mt-2 text-sm text-white/72">Proteccion consistente en web y APIs.</p>
            </div>
          </div>
        </section>

        <section className="panel-shell rounded-[30px] px-7 py-8 lg:px-9 lg:py-10">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">Acceso</p>
              <h2 className="font-display mt-2 text-3xl font-bold text-[var(--primary-strong)]">Iniciar sesion</h2>
            </div>
            <Link href="/" className="blue-chip rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em]">
              Volver
            </Link>
          </div>

          <form className="mt-8 space-y-5" onSubmit={onSubmit}>
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--text-main)] outline-none focus:border-[var(--primary-soft)] focus:shadow-[0_0_0_4px_rgba(167,200,255,0.35)]"
                placeholder="tecnico@nexo.com"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]" htmlFor="password">
                Contrasena
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--text-main)] outline-none focus:border-[var(--primary-soft)] focus:shadow-[0_0_0_4px_rgba(167,200,255,0.35)]"
                placeholder="******"
              />
            </div>

            {errorMessage ? (
              <div className="rounded-2xl border border-[rgba(186,26,26,0.18)] bg-[rgba(255,220,195,0.55)] px-4 py-3 text-sm text-[var(--accent-danger)]">
                {errorMessage}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={submitting}
              className="primary-gradient w-full rounded-2xl px-4 py-3 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(0,30,64,0.16)] hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? 'Ingresando...' : 'Ingresar al panel'}
            </button>
          </form>

        </section>
      </div>
    </main>
  );
}

