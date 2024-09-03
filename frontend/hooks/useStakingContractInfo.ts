import { useContext } from 'react';

import { StakingContractInfoContext } from '@/context/StakingContractInfoProvider';

import { useServices } from './useServices';

export const useStakingContractInfo = () => {
  const { activeStakingContractInfo, stakingContractInfoRecord } = useContext(
    StakingContractInfoContext,
  );

  const { services } = useServices();

  if (!services?.[0] || !activeStakingContractInfo)
    return { stakingContractInfoRecord };

  const {
    serviceStakingState,
    serviceStakingStartTime,
    //availableRewards, // TODO: uncomment when availableRewards is available
    serviceIds,
    maxNumServices,
    minimumStakingDuration,
  } = activeStakingContractInfo;

  const isRewardsAvailable = true; // availableRewards > 0;
  const hasEnoughServiceSlots = serviceIds.length < maxNumServices;
  const hasEnoughRewardsAndSlots = isRewardsAvailable && hasEnoughServiceSlots;

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
  const isEligibleForStaking =
    hasEnoughRewardsAndSlots &&
    (isAgentEvicted ? isServiceStakedForMinimumDuration : true);

  return {
    hasEnoughServiceSlots,
    isEligibleForStaking,
    isRewardsAvailable,
    isAgentEvicted,
    stakingContractInfoRecord,
    isServiceStakedForMinimumDuration,
  };
};
