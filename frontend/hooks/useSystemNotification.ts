import { useElectronApi } from './useElectronApi';

export const useSystemNotification = () => {
  const electronApi = useElectronApi();

  if (!electronApi.showNotification)
    return {
      systemNotify: () => {},
    };

  const systemNotify = (title: string, body: string) =>
    electronApi.showNotification!(title, body);

  return { systemNotify };
};
