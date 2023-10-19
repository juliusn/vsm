import { create } from 'zustand';

type Store = {
  profile: Profile | null;
  setProfile: (profile: Profile | null) => void;
};

export const useProfileStore = create<Store>((set) => ({
  profile: null,
  setProfile: (profile) => {
    set(() => ({ profile }));
  },
}));
