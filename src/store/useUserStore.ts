import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserState {
  id: number | null;
  name: string | null;
  email: string | null;

  setUser: (userData: { id: number; name: string; email: string }) => void;
  clearUser: () => void;
}

const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      id: null,
      name: "",
      email: "",
      setUser: (userData) =>
        set({
          id: userData.id,
          name: userData.name,
          email: userData.email,
        }),
      clearUser: () => set({ id: null, name: "", email: "" }),
    }),
    { name: "user" },
  ),
);

export default useUserStore;
