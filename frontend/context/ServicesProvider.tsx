import { message } from 'antd';
import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useCallback,
  useContext,
  useState,
} from 'react';
import { useInterval } from 'usehooks-ts';

import {
  MiddlewareDeploymentStatus,
  MiddlewareService,
  ServiceHash,
} from '@/client';
import { FIVE_SECONDS_INTERVAL } from '@/constants/intervals';
import { ServicesService } from '@/service/Services';
import { Address } from '@/types/Address';

import { OnlineStatusContext } from './OnlineStatusProvider';

type ServicesContextProps = {
  hasInitialLoaded: boolean;
  serviceAddresses?: Address[];
  serviceStatuses: MiddlewareDeploymentStatus[];
  services?: MiddlewareService[];
  setHasInitialLoaded: Dispatch<SetStateAction<boolean>>;
  setIsPaused: Dispatch<SetStateAction<boolean>>;
  setServiceStatuses: Dispatch<SetStateAction<MiddlewareDeploymentStatus>>;
  setServices: Dispatch<SetStateAction<MiddlewareService[]>>;
  updateServiceStatus: () => Promise<void>;
  updateServicesState: () => Promise<void>;
};

export const ServicesContext = createContext<ServicesContextProps>({
  services: undefined,
  serviceAddresses: [],
  setServices: () => {},
  serviceStatuses: [],
  setServiceStatuses: () => {},
  updateServicesState: async () => {},
  updateServiceStatus: async () => {},
  hasInitialLoaded: false,
  setHasInitialLoaded: () => {},
  setIsPaused: () => {},
});

export const ServicesProvider = ({ children }: PropsWithChildren) => {
  const { isOnline } = useContext(OnlineStatusContext);

  const [services, setServices] = useState<MiddlewareService[]>();

  const [serviceStatuses, setServiceStatuses] = useState<
    Record<ServiceHash, MiddlewareDeploymentStatus>
  >({});

  const [hasInitialLoaded, setHasInitialLoaded] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const updateServices = useCallback(
    async (): Promise<void> =>
      ServicesService.getServices()
        .then((data: MiddlewareService[]) => {
          if (!Array.isArray(data)) return;
          setServices(data);
          setHasInitialLoaded(true);
        })
        .catch((e) => {
          console.error(e);
          // message.error(e.message); Commented out to avoid showing error message; need to handle "isAuthenticated" in a better way
        }),
    [],
  );

  // @todo: update once we have multiple services
  const updateServiceStatuses = useCallback(async () => {
    if (!services?.[0]) return;
    const deployment = await ServicesService.getDeployment(services[0].hash);

    setServiceStatuses({
      [services[0].hash]: deployment.status,
    });
  }, [services]);

  // Update service state
  useInterval(
    () =>
      updateServices()
        .then(() => updateServiceStatuses())
        .catch((e) => message.error(e.message)),
    isOnline && !isPaused ? FIVE_SECONDS_INTERVAL : null,
  );

  return (
    <ServicesContext.Provider
      value={{
        services,
        setServices,
        updateServicesState: updateServices,
        updateServiceStatus: updateServiceStatuses,
        hasInitialLoaded,
        serviceStatuses,
        setServiceStatuses,
        setHasInitialLoaded,
        setIsPaused,
      }}
    >
      {children}
    </ServicesContext.Provider>
  );
};
