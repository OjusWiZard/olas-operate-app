export declare global {
    interface Window {
      what:123;
      electronAPI: {
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
    }
}
