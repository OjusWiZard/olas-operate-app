import { ElectronApi } from "@/types/ElectronApi";

const FALLBACK_ELECTRON_API: ElectronApi = {
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
  };

export const useElectronApi = (): ElectronApi => {
    if(!window.electronAPI) {
        console.error('window.electronAPI is not defined');
        return FALLBACK_ELECTRON_API;
    }
    return window.electronAPI;
}