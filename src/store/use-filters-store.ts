'use client';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type UserListStatusFilter = 'all' | 'active' | 'inactive';

type UsersFiltersState = {
  query: string;
  roleType: string;
  status: UserListStatusFilter;
  setQuery: (query: string) => void;
  setRoleType: (roleType: string) => void;
  setStatus: (status: UserListStatusFilter) => void;
  reset: () => void;
};

const initialUsersFiltersState = {
  query: '',
  roleType: 'all',
  status: 'all' as UserListStatusFilter,
};

export const useUsersFiltersStore = create<UsersFiltersState>()(
  persist(
    (set) => ({
      ...initialUsersFiltersState,
      setQuery: (query) => set({ query }),
      setRoleType: (roleType) => set({ roleType }),
      setStatus: (status) => set({ status }),
      reset: () => set({ ...initialUsersFiltersState }),
    }),
    {
      name: 'nexo-users-filters',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        query: state.query,
        roleType: state.roleType,
        status: state.status,
      }),
    }
  )
);
