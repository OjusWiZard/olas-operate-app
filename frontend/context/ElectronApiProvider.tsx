import { get } from 'lodash';
import { createContext, PropsWithChildren } from 'react';

import { ElectronStore, ElectronTrayIconStatus } from '@/types/ElectronApi';

type ElectronApiContextProps = {
  closeApp?: () => void;
  getAppVersion?: () => Promise<string>;
  ipcRenderer?: {
    // listen to messages from main process
    invoke?: (channel: string, data: unknown) => Promise<unknown>; // send messages to main process
    on?: (
      channel: string,
      func: (event: unknown, data: unknown) => void,
    ) => void;
    send?: (channel: string, data: unknown) => void; // send message to main process and get Promise response
  };
  minimizeApp?: () => void;
  notifyAgentRunning?: () => void;
  openPath?: (filePath: string) => void;
  saveLogs?: (data: {
    debugData?: Record<string, unknown>;
    store?: ElectronStore;
  }) => Promise<{ dirPath: string; success: true } | { success?: false }>;
  setAppHeight?: (height: unknown) => void;
  setIsAppLoaded?: (isLoaded: boolean) => void;
  setTrayIcon?: (status: ElectronTrayIconStatus) => void;
  showNotification?: (title: string, body?: string) => void;
  store?: {
    clear?: () => Promise<void>;
    delete?: (key: string) => Promise<void>;
    get?: (key: string) => Promise<unknown>;
    set?: (key: string, value: unknown) => Promise<void>;
    store?: () => Promise<ElectronStore>;
  };
};

export const ElectronApiContext = createContext<ElectronApiContextProps>({
  getAppVersion: async () => '',
  setIsAppLoaded: () => false,
  closeApp: () => {},
  minimizeApp: () => {},
  setTrayIcon: () => {},
  ipcRenderer: {
    send: () => {},
    on: () => {},
    invoke: async () => {},
  },
  store: {
    store: async () => ({}),
    get: async () => {},
    set: async () => {},
    delete: async () => {},
    clear: async () => {},
  },
  setAppHeight: () => {},
  saveLogs: async () => ({ success: false }),
  openPath: () => {},
});

export const ElectronApiProvider = ({ children }: PropsWithChildren) => {
  const getElectronApiFunction = (functionNameInWindow: string) => {
    if (typeof window === 'undefined') return;

    const fn = get(window, `electronAPI.${functionNameInWindow}`);
    if (!fn || typeof fn !== 'function') {
      throw new Error(
        `Function ${functionNameInWindow} not found in window.electronAPI`,
      );
    }

    return fn;
  };

  return (
    <ElectronApiContext.Provider
      value={{
        getAppVersion: getElectronApiFunction('getAppVersion'),
        setIsAppLoaded: getElectronApiFunction('setIsAppLoaded'),
        closeApp: getElectronApiFunction('closeApp'),
        minimizeApp: getElectronApiFunction('minimizeApp'),
        setTrayIcon: getElectronApiFunction('setTrayIcon'),
        ipcRenderer: {
          send: getElectronApiFunction('ipcRenderer.send'),
          on: getElectronApiFunction('ipcRenderer.on'),
          invoke: getElectronApiFunction('ipcRenderer.invoke'),
        },
        store: {
          store: getElectronApiFunction('store.store'),
          get: getElectronApiFunction('store.get'),
          set: getElectronApiFunction('store.set'),
          delete: getElectronApiFunction('store.delete'),
          clear: getElectronApiFunction('store.clear'),
        },
        setAppHeight: getElectronApiFunction('setAppHeight'),
        showNotification: getElectronApiFunction('showNotification'),
        saveLogs: getElectronApiFunction('saveLogs'),
        openPath: getElectronApiFunction('openPath'),
      }}
    >
      {children}
    </ElectronApiContext.Provider>
  );
};
