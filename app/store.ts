import { Session } from '@supabase/supabase-js';
import { create } from 'zustand';

type SessionStore = {
  session: Session | null;
  setSession: (session: Session | null) => void;
};

export const useSessionStore = create<SessionStore>((set) => ({
  session: null,
  setSession: (session) => {
    set(() => ({ session }));
  },
}));

type EmailStore = {
  email: string;
  setEmail: (email: string) => void;
};

export const useEmailStore = create<EmailStore>((set) => ({
  email: '',
  setEmail: (email) => {
    set(() => ({ email }));
  },
}));

type DockingsStore = {
  dockings: AppTypes.Docking[];
  setDockings: (dockings: AppTypes.Docking[]) => void;
  insertDocking: (docking: AppTypes.Docking) => void;
  updateDocking: (docking: AppTypes.Docking) => void;
  removeDocking: (id: string) => void;
  dockingEvents: AppTypes.DockingEvent[];
  setDockingEvents: (dockingsEvents: AppTypes.DockingEvent[]) => void;
  updateDockingEvent: (docking: AppTypes.DockingEvent) => void;
  insertDockingEvent: (docking: AppTypes.DockingEvent) => void;
  removeDockingEvent: (id: string) => void;
};

export const useDockingsStore = create<DockingsStore>((set) => ({
  dockings: [],
  setDockings: (dockings) => {
    set(() => ({ dockings }));
  },
  insertDocking: (docking) => {
    set((state) => ({ dockings: [...state.dockings, docking] }));
  },
  updateDocking: (newDocking) => {
    set((state) => ({
      dockings: state.dockings.map((docking) =>
        docking.id === newDocking.id ? newDocking : docking
      ),
    }));
  },
  removeDocking: (id) => {
    set((state) => ({
      dockings: state.dockings.filter((docking) => docking.id !== id),
    }));
  },
  dockingEvents: [],
  setDockingEvents: (dockingEvents) => {
    set(() => ({ dockingEvents }));
  },
  insertDockingEvent: (dockingEvent) => {
    set((state) => ({ dockingEvents: [...state.dockingEvents, dockingEvent] }));
  },
  updateDockingEvent: (newDockingEvent) => {
    set((state) => ({
      dockingEvents: state.dockingEvents.map((dockingEvent) =>
        dockingEvent.id === newDockingEvent.id ? newDockingEvent : dockingEvent
      ),
    }));
  },
  removeDockingEvent: (id) => {
    set((state) => ({
      dockingEvents: state.dockingEvents.filter(
        (dockingEvent) => dockingEvent.id !== id
      ),
    }));
  },
}));
