import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { useInterval } from 'usehooks-ts';

import { FIVE_SECONDS_INTERVAL } from '@/constants/intervals';
import { AutonolasService } from '@/service/Autonolas';

import { ServicesContext } from './ServicesProvider';

type StakingContractInfoContextProps = {
  updateStakingContractInfo: () => Promise<void>;
  isInitialStakingLoad: boolean;
  isRewardsAvailable: boolean;
  hasEnoughServiceSlots: boolean;
  isAgentEvicted: boolean; // TODO: Implement this
  canStartAgent: boolean;
};

export const StakingContractInfoContext =
  createContext<StakingContractInfoContextProps>({
    updateStakingContractInfo: async () => {},
    isInitialStakingLoad: true,
    isRewardsAvailable: false,
    hasEnoughServiceSlots: false,
    isAgentEvicted: false,
    canStartAgent: false,
  });

export const StakingContractInfoProvider = ({
  children,
}: PropsWithChildren) => {
  const { services } = useContext(ServicesContext);
  const serviceId = useMemo(() => services?.[0]?.chain_data?.token, [services]);

  const [stakingLoadCount, setStakingLoadCount] = useState(0);
  const [isRewardsAvailable, setIsRewardsAvailable] = useState(false);
  const [hasEnoughServiceSlots, setHasEnoughServiceSlots] = useState(false);
  const [isAgentEvicted, setIsAgentEvicted] = useState(false);
  const [canStartAgent, setCanStartAgent] = useState(false);

  const updateStakingContractInfo = useCallback(async () => {
    try {
      if (!serviceId) return;

      const info = await AutonolasService.getStakingContractInfo(serviceId);
      if (!info) return;

      const {
        availableRewards,
        maxNumServices,
        serviceIds,
        serviceStakingStartTime,
        serviceStakingState,
        minimumStakingDuration,
      } = info;
      const isRewardsAvailable = availableRewards > 0;
      const hasEnoughServiceSlots = serviceIds.length < maxNumServices;
      const hasEnoughRewardsAndSlots =
        isRewardsAvailable && hasEnoughServiceSlots;

      const isAgentEvicted = serviceStakingState === 2;

      /**
       * For example: minStakingDuration = 3 days
       *
       * - Service starts staking 1st June 00:01
       * - Service stops being active on 1st June 02:01 (after 2 hours)
       * - Contract will evict the service at 3rd June 02:02
       * - Now, cannot unstake the service until 4th June 00:01, because it hasn’t met the minStakingDuration of 3 days.
       * - IMPORTANT: Between 3rd June 02:02 and 4th June 00:01 the service is EVICTED and without the possibility of unstake and re-stake
       * - That is, user should not be able to run/start your agent if this condition is met.
       *
       */
      const isServiceStakedForMinimumDuration =
        Math.round(Date.now() / 1000) - serviceStakingStartTime >=
        minimumStakingDuration;

      /**
       * user can start the agent iff,
       * - rewards are available
       * - service has enough slots
       * - if agent is evicted, then service should be staked for minimum duration
       */
      const canStartAgent =
        hasEnoughRewardsAndSlots &&
        (isAgentEvicted ? isServiceStakedForMinimumDuration : true);

      setIsRewardsAvailable(isRewardsAvailable);
      setHasEnoughServiceSlots(hasEnoughServiceSlots);
      setCanStartAgent(canStartAgent);
      setIsAgentEvicted(isAgentEvicted);
      setStakingLoadCount((prev) => prev + 1);
    } catch (error) {
      console.error('Failed to fetch staking contract info', error);
    }
  }, [serviceId]);

  useInterval(updateStakingContractInfo, FIVE_SECONDS_INTERVAL);

  return (
    <StakingContractInfoContext.Provider
      value={{
        updateStakingContractInfo,
        isInitialStakingLoad: stakingLoadCount === 0,
        isRewardsAvailable,
        hasEnoughServiceSlots,
        isAgentEvicted,
        canStartAgent,
      }}
    >
      {children}
    </StakingContractInfoContext.Provider>
  );
};
