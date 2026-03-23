'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardShell from '@/src/components/dashboard-shell';

type SessionUser = {
  id: string;
  name: string;
  email: string;
  roleType: string;
};

type MeResponse = {
  ok?: boolean;
  item?: { user: SessionUser };
};

type DashboardSessionContextValue = {
  user: SessionUser | null;
  loading: boolean;
  refresh: () => Promise<void>;
};

const DashboardSessionContext = createContext<DashboardSessionContextValue>({
  user: null,
  loading: true,
  refresh: async () => {},
});

const TOKEN_STORAGE_KEY = process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY || 'token';

export function useDashboardSession() {
  return useContext(DashboardSessionContext);
}

export default function DashboardSessionLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<SessionUser | null>(null);

  const refresh = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/me', { credentials: 'include' });
      const data: MeResponse = await response.json();
      if (!response.ok || !data.ok || !data.item?.user) {
        router.replace('/login');
        return;
      }
      setUser(data.item.user);
    } catch {
      router.replace('/login');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const onLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } finally {
      window.localStorage.removeItem(TOKEN_STORAGE_KEY);
      router.replace('/login');
    }
  };

  const contextValue = useMemo(
    () => ({
      user,
      loading,
      refresh,
    }),
    [loading, refresh, user]
  );

  if (loading) {
    return <main className="min-h-screen bg-[var(--surface-low)] p-6">Cargando sesion...</main>;
  }

  return (
    <DashboardSessionContext.Provider value={contextValue}>
      <DashboardShell user={user} onLogout={onLogout}>
        {children}
      </DashboardShell>
    </DashboardSessionContext.Provider>
  );
}
