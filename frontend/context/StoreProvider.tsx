import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import type { ElectronStore } from '@/types/ElectronApi';

import { useElectronApi } from '@/hooks/useElectronApi';

export const StoreContext = createContext<{ storeState?: ElectronStore }>({
  storeState: undefined,
});

export const StoreProvider = ({ children }: PropsWithChildren) => {
  const { store, ipcRenderer } = useElectronApi();
  const [storeState, setStoreState] = useState<ElectronStore>();

  const setupStore = useCallback(async () => {
    const tempStore = await store?.store?.();
    setStoreState(tempStore);
    ipcRenderer?.on?.('store-changed', (_event: unknown, data: unknown) => {
      setStoreState(data as ElectronStore);
    });
  }, [ipcRenderer, store]);

  useEffect(() => {
    if (!storeState) setupStore().catch(console.error);
  }, [setupStore, storeState]);

  return (
    <StoreContext.Provider value={{ storeState }}>
      {children}
    </StoreContext.Provider>
  );
};
