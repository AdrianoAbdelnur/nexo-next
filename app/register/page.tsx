'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

type RegisterResponse = {
  ok?: boolean;
  message?: string;
  item?: {
    token: string;
    user: {
      id: string;
      firstName: string;
      lastName: string;
      name: string;
      email: string;
      roleType: string;
    };
  };
};

const TOKEN_STORAGE_KEY = process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY || 'token';

export default function RegisterPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });
      const data: RegisterResponse = await response.json();

      if (!response.ok || !data.ok || !data.item?.token) {
        setErrorMessage(data.message || 'No se pudo registrar el usuario');
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
      <div className="pointer-events-none absolute right-0 top-0 h-72 w-72 rounded-full bg-[rgba(167,200,255,0.32)] blur-3xl" />

      <div className="relative mx-auto grid min-h-screen max-w-7xl items-center gap-8 px-6 py-8 lg:grid-cols-[0.92fr_1.08fr] lg:px-10">
        <section className="panel-shell rounded-[30px] px-7 py-8 lg:px-9 lg:py-10">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">Alta interna</p>
              <h1 className="font-display mt-2 text-3xl font-bold text-[var(--primary-strong)]">Registrar usuario</h1>
            </div>
            <Link href="/login" className="blue-chip rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em]">
              Ya tengo cuenta
            </Link>
          </div>

          <form className="mt-8 space-y-5" onSubmit={onSubmit}>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]" htmlFor="firstName">
                  Nombre
                </label>
                <input
                  id="firstName"
                  type="text"
                  required
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--text-main)] outline-none focus:border-[var(--primary-soft)] focus:shadow-[0_0_0_4px_rgba(167,200,255,0.35)]"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]" htmlFor="lastName">
                  Apellido
                </label>
                <input
                  id="lastName"
                  type="text"
                  required
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                  className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--text-main)] outline-none focus:border-[var(--primary-soft)] focus:shadow-[0_0_0_4px_rgba(167,200,255,0.35)]"
                />
              </div>
            </div>

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
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]" htmlFor="password">
                Contrasena
              </label>
              <input
                id="password"
                type="password"
                minLength={6}
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--text-main)] outline-none focus:border-[var(--primary-soft)] focus:shadow-[0_0_0_4px_rgba(167,200,255,0.35)]"
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
              {submitting ? 'Registrando...' : 'Crear usuario y abrir sesion'}
            </button>
          </form>
        </section>

        <section className="rounded-[30px] bg-[var(--primary)] px-7 py-8 text-white shadow-[0_20px_60px_rgba(0,30,64,0.16)] lg:px-10 lg:py-12">
          <div className="w-fit rounded-full border border-white/18 bg-white/8 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/72">
            Identidad operativa
          </div>
          <h2 className="font-display mt-8 text-4xl font-extrabold leading-tight sm:text-5xl">
            Usuarios listos para trabajar dentro del mismo lenguaje visual y operativo.
          </h2>
          <p className="mt-5 max-w-xl text-sm leading-7 text-white/78 sm:text-base">
            El alta mantiene una imagen de sistema empresarial claro: sobrio, azul profundo y preparado para escalar a coordinacion, recursos y auditoria.
          </p>

          <div className="mt-10 space-y-4">
            <div className="rounded-2xl border border-white/12 bg-white/8 p-4 backdrop-blur-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/60">Datos base</p>
              <p className="mt-2 text-sm text-white/78">Nombre y apellido separados, email, rol y sesion persistente.</p>
            </div>
            <div className="rounded-2xl border border-white/12 bg-white/8 p-4 backdrop-blur-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/60">Escala visual</p>
              <p className="mt-2 text-sm text-white/78">Misma familia estetica para panel web y app tecnica.</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
