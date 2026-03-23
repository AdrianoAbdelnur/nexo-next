'use client';

import Link from 'next/link';
import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardShell from '@/src/components/dashboard-shell';

type SessionUser = {
  id: string;
  firstName?: string;
  lastName?: string;
  name: string;
  email: string;
  roleType: string;
};

type MeResponse = {
  ok?: boolean;
  message?: string;
  item?: { user: SessionUser };
};

type UserItem = {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phone: string | null;
  roleType: string;
  active: boolean;
};

type UsersResponse = {
  ok?: boolean;
  message?: string;
  items?: UserItem[];
  item?: UserItem;
};

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  roleType: string;
  active: boolean;
  password: string;
};

const initialForm: FormState = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  roleType: 'operator',
  active: true,
  password: '',
};

const roles = ['admin', 'manager', 'operator', 'coordinator', 'technician'] as const;
const TOKEN_STORAGE_KEY = process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY || 'token';

type ModalMode = 'create' | 'edit';

function IconButton({ title, onClick, children, danger = false }: { title: string; onClick: (event: React.MouseEvent<HTMLButtonElement>) => void; children: React.ReactNode; danger?: boolean; }) {
  return (
    <button
      type="button"
      aria-label={title}
      title={title}
      onClick={onClick}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border transition ${
        danger
          ? 'border-[rgba(186,26,26,0.28)] bg-[rgba(255,225,194,0.55)] text-[var(--accent-danger)] hover:bg-[rgba(255,225,194,0.8)]'
          : 'border-[var(--border)] bg-white text-[var(--primary)] hover:bg-[var(--surface-low)]'
      }`}
    >
      {children}
    </button>
  );
}

export default function AdminUsersPage() {
  const router = useRouter();
  const [booting, setBooting] = useState(true);
  const [sessionUser, setSessionUser] = useState<SessionUser | null>(null);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(initialForm);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>('create');

  const selected = useMemo(() => users.find((user) => user.id === selectedUserId) || null, [users, selectedUserId]);

  const loadUsers = useCallback(async () => {
    setLoadingUsers(true);
    setErrorMessage('');
    try {
      const response = await fetch('/api/private/users', { credentials: 'include' });
      const data: UsersResponse = await response.json();
      if (!response.ok || !data.ok) {
        setErrorMessage(data.message || 'No se pudo cargar usuarios');
        if (response.status === 401) router.replace('/login');
        return;
      }
      const items = data.items || [];
      setUsers(items);
      if (!selectedUserId && items.length > 0) {
        setSelectedUserId(items[0].id);
      }
    } catch {
      setErrorMessage('Error de conexion al cargar usuarios');
    } finally {
      setLoadingUsers(false);
    }
  }, [router, selectedUserId]);

  useEffect(() => {
    const run = async () => {
      try {
        const response = await fetch('/api/auth/me', { credentials: 'include' });
        const data: MeResponse = await response.json();
        if (!response.ok || !data.ok || !data.item?.user) {
          router.replace('/login');
          return;
        }
        if (data.item.user.roleType !== 'admin') {
          router.replace('/dashboard');
          return;
        }
        setSessionUser(data.item.user);
      } catch {
        router.replace('/login');
        return;
      }
      setBooting(false);
      await loadUsers();
    };
    void run();
  }, [loadUsers, router]);

  const openCreateModal = () => {
    setModalMode('create');
    setForm(initialForm);
    setModalOpen(true);
    setErrorMessage('');
    setSuccessMessage('');
  };

  const openEditModal = (user: UserItem) => {
    setModalMode('edit');
    setForm({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone || '',
      roleType: user.roleType,
      active: user.active,
      password: '',
    });
    setSelectedUserId(user.id);
    setModalOpen(true);
    setErrorMessage('');
    setSuccessMessage('');
  };

  const closeModal = () => {
    if (submitting) return;
    setModalOpen(false);
    setForm(initialForm);
  };

  const onSubmitModal = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      if (modalMode === 'create') {
        const response = await fetch('/api/private/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(form),
        });
        const data: UsersResponse = await response.json();
        if (!response.ok || !data.ok || !data.item) {
          setErrorMessage(data.message || 'No se pudo crear usuario');
          return;
        }
        setSuccessMessage('Usuario creado');
        setSelectedUserId(data.item.id);
      } else {
        if (!selectedUserId) {
          setErrorMessage('Selecciona un usuario para editar');
          return;
        }
        const response = await fetch(`/api/private/users/${selectedUserId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(form),
        });
        const data: UsersResponse = await response.json();
        if (!response.ok || !data.ok || !data.item) {
          setErrorMessage(data.message || 'No se pudo actualizar usuario');
          return;
        }
        setSuccessMessage('Usuario actualizado');
      }

      setModalOpen(false);
      await loadUsers();
    } catch {
      setErrorMessage('Error de conexion');
    } finally {
      setSubmitting(false);
    }
  };

  const onDeleteFromList = async (event: React.MouseEvent<HTMLButtonElement>, user: UserItem) => {
    event.stopPropagation();
    if (!confirm(`Eliminar usuario ${user.name}?`)) return;

    setSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');
    try {
      const response = await fetch(`/api/private/users/${user.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await response.json();
      if (!response.ok || !data.ok) {
        setErrorMessage(data.message || 'No se pudo eliminar usuario');
        return;
      }
      setSuccessMessage('Usuario eliminado');
      if (selectedUserId === user.id) {
        setSelectedUserId(null);
      }
      await loadUsers();
    } catch {
      setErrorMessage('Error de conexion');
    } finally {
      setSubmitting(false);
    }
  };

  const onLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } finally {
      window.localStorage.removeItem(TOKEN_STORAGE_KEY);
      router.replace('/login');
    }
  };

  if (booting) {
    return <main className="min-h-screen bg-[var(--surface)] p-6">Validando permisos...</main>;
  }

  return (
    <DashboardShell user={sessionUser} title="Administracion de usuarios" subtitle="Modulo admin" onLogout={onLogout}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <Link href="/dashboard" className="orange-chip rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]">
          Volver dashboard
        </Link>
        <button
          type="button"
          onClick={openCreateModal}
          className="primary-gradient rounded-xl px-4 py-2 text-sm font-semibold text-white"
        >
          Nuevo usuario
        </button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="panel-shell rounded-2xl p-4">
          <h2 className="font-display text-xl font-bold text-[var(--primary-strong)]">Lista de usuarios</h2>
          {loadingUsers ? <p className="mt-3 text-sm text-[var(--text-muted)]">Cargando...</p> : null}

          <div className="mt-4 space-y-2">
            {users.map((user) => {
              const active = selectedUserId === user.id;
              return (
                <div
                  key={user.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedUserId(user.id)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      setSelectedUserId(user.id);
                    }
                  }}
                  className={`flex w-full cursor-pointer items-center justify-between rounded-xl border px-3 py-3 text-left transition focus:outline-none focus:ring-2 focus:ring-[var(--accent-info)] ${
                    active
                      ? 'border-[var(--primary)] bg-[rgba(184,219,240,0.45)]'
                      : 'border-[var(--border)] bg-white hover:bg-[var(--surface-low)]'
                  }`}
                >
                  <div>
                    <p className="font-semibold text-[var(--text-main)]">{user.name}</p>
                    <p className="text-sm text-[var(--text-muted)]">{user.email}</p>
                    <p className="text-xs uppercase tracking-[0.12em] text-[var(--primary)]">{user.roleType}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <IconButton title="Editar" onClick={(event) => { event.stopPropagation(); openEditModal(user); }}>
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 20h9" />
                        <path d="M16.5 3.5a2.1 2.1 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                      </svg>
                    </IconButton>
                    <IconButton title="Eliminar" danger onClick={(event) => onDeleteFromList(event, user)}>
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M8 6V4h8v2" />
                        <path d="M19 6l-1 14H6L5 6" />
                        <line x1="10" y1="11" x2="10" y2="17" />
                        <line x1="14" y1="11" x2="14" y2="17" />
                      </svg>
                    </IconButton>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="panel-shell rounded-2xl p-4">
          <h2 className="font-display text-xl font-bold text-[var(--primary-strong)]">Detalle</h2>
          {selected ? (
            <div className="mt-4 space-y-3 text-sm">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">Nombre completo</p>
                <p className="text-base font-semibold text-[var(--text-main)]">{selected.name}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">Email</p>
                <p className="text-base text-[var(--text-main)]">{selected.email}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">Telefono</p>
                <p className="text-base text-[var(--text-main)]">{selected.phone || '-'}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">Rol</p>
                <p className="text-base text-[var(--accent-orange-strong)]">{selected.roleType}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">Estado</p>
                <p className="text-base text-[var(--primary)]">{selected.active ? 'Activo' : 'Inactivo'}</p>
              </div>
            </div>
          ) : (
            <p className="mt-4 text-sm text-[var(--text-muted)]">Selecciona un usuario de la lista.</p>
          )}
        </section>
      </div>

      {errorMessage ? <p className="mt-4 text-sm text-[var(--accent-danger)]">{errorMessage}</p> : null}
      {successMessage ? <p className="mt-2 text-sm text-[var(--primary)]">{successMessage}</p> : null}

      {modalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.48)] p-4">
          <div className="panel-shell w-full max-w-xl rounded-2xl p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-2xl font-bold text-[var(--primary-strong)]">
                {modalMode === 'create' ? 'Crear usuario' : 'Editar usuario'}
              </h3>
              <button type="button" onClick={closeModal} className="rounded-lg border border-[var(--border)] bg-white px-3 py-1 text-sm font-semibold text-[var(--text-main)]">
                Cerrar
              </button>
            </div>

            <form className="grid gap-3" onSubmit={onSubmitModal}>
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  required
                  placeholder="Nombre"
                  value={form.firstName}
                  onChange={(event) => setForm((prev) => ({ ...prev, firstName: event.target.value }))}
                  className="rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-sm"
                />
                <input
                  required
                  placeholder="Apellido"
                  value={form.lastName}
                  onChange={(event) => setForm((prev) => ({ ...prev, lastName: event.target.value }))}
                  className="rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-sm"
                />
              </div>

              <input
                required
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                className="rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-sm"
              />
              <input
                placeholder="Telefono"
                value={form.phone}
                onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
                className="rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-sm"
              />
              <select
                value={form.roleType}
                onChange={(event) => setForm((prev) => ({ ...prev, roleType: event.target.value }))}
                className="rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-sm"
              >
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
              <input
                type="password"
                placeholder={modalMode === 'create' ? 'Contrasena' : 'Nueva contrasena (opcional)'}
                value={form.password}
                onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                className="rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-sm"
                required={modalMode === 'create'}
              />

              <label className="flex items-center gap-2 text-sm text-[var(--text-main)]">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(event) => setForm((prev) => ({ ...prev, active: event.target.checked }))}
                />
                Usuario activo
              </label>

              <button disabled={submitting} type="submit" className="primary-gradient mt-2 rounded-xl px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
                {modalMode === 'create' ? 'Crear usuario' : 'Guardar cambios'}
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </DashboardShell>
  );
}
