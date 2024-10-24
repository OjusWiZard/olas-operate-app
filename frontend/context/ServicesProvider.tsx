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
  MiddlewareDeployment,
  MiddlewareDeploymentStatus,
  MiddlewareService,
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

  const [hasInitialLoaded, setHasInitialLoaded] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const updateServices = useCallback(async (): Promise<void> => {
    // get all services
    const middlewareServices = await ServicesService.getServices();

    if (!middlewareServices) {
      setServices([]);
      setHasInitialLoaded(true);
      return;
    }

    // get all statuses
    const middlewareDeployments = await Promise.allSettled(
      middlewareServices.map(({ hash }) => ServicesService.getDeployment(hash)),
    );

    // check lengths match
    if (middlewareServices.length !== middlewareDeployments.length) {
      throw new Error(
        'ServicesProvider: Mismatched number of services to deployments',
      );
    }

    const services = middlewareServices.reduce(
      (acc: MiddlewareService[], middlewareService, index) => {
        // Find the deployment result for the current service by matching reduce index
        const middlewareDeploymentSettledResult: PromiseSettledResult<MiddlewareDeployment> =
          middlewareDeployments[index];

        // getDeployment promise failed, don't append status
        if (middlewareDeploymentSettledResult.status === 'rejected') {
          return [...acc, middlewareService];
        }

        // getDeployment promise succeeded, return with status
        const deployment: MiddlewareDeployment =
          middlewareDeploymentSettledResult.value;
        return [...acc, { ...middlewareService, status: deployment.status }];
      },
      [],
    );

    setServices(services);
    setHasInitialLoaded(true);
  });

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
