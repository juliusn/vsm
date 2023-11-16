import { create } from 'zustand';

type ProfileStore = {
  profile: Profile | null;
  setProfile: (profile: Profile | null) => void;
};

export const useProfileStore = create<ProfileStore>((set) => ({
  profile: null,
  setProfile: (profile) => {
    set(() => ({ profile }));
  },
}));
