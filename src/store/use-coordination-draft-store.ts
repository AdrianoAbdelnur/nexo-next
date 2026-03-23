'use client';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type CoordinationDraft = {
  serviceRequestId: string | null;
  templateInterventionId: string | null;
  scheduledDate: string;
  scheduledStartTime: string;
  scheduledEndTime: string;
  location: string;
  technicianId: string;
  coordinatorId: string;
  notes: string;
};

type CoordinationDraftStoreState = {
  draft: CoordinationDraft;
  updateDraft: (patch: Partial<CoordinationDraft>) => void;
  resetDraft: () => void;
};

const initialDraft: CoordinationDraft = {
  serviceRequestId: null,
  templateInterventionId: null,
  scheduledDate: '',
  scheduledStartTime: '',
  scheduledEndTime: '',
  location: '',
  technicianId: '',
  coordinatorId: '',
  notes: '',
};

export const useCoordinationDraftStore = create<CoordinationDraftStoreState>()(
  persist(
    (set) => ({
      draft: initialDraft,
      updateDraft: (patch) =>
        set((state) => ({
          draft: { ...state.draft, ...patch },
        })),
      resetDraft: () => set({ draft: initialDraft }),
    }),
    {
      name: 'nexo-coordination-draft',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ draft: state.draft }),
    }
  )
);
