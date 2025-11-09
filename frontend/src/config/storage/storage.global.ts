import type { InterledgerWalletInfo } from "@/types/wallet/wallet.types";
import { create } from "zustand";
import { combine, createJSONStorage, persist } from "zustand/middleware";
// import { encryptedStorage } from "@/lib/encrypt.storage";
interface GlobalCredentials {
  username: string;
  wallet:InterledgerWalletInfo;
}

const useStorage = create(
  persist(
    combine(
      {
        username: "",
        wallet: {} as InterledgerWalletInfo,
      },
      (set) => ({
        setUser:(newCredentials:GlobalCredentials)=> set(()=>(newCredentials)),
        clear: () =>
          set(() => ({
            username: "",
            wallet: {} as InterledgerWalletInfo,
          })),
      })
    ),
    {
      // @ts-ignore
      name: import.meta.env.VITE_GLOBAL_STORAGE_KEY_NAME,
      storage: createJSONStorage(() => localStorage),
    }
  )
);
export default useStorage;