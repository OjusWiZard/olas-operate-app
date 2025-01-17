import { createContext, PropsWithChildren, useCallback, useState } from 'react';
import { useInterval } from 'usehooks-ts';

import { CHAINS } from '@/constants/chains';
import { StakingProgramId } from '@/enums/StakingProgram';
import { useServices } from '@/hooks/useServices';
import { AutonolasService } from '@/service/Autonolas';

export const DEFAULT_STAKING_PROGRAM_ID = StakingProgramId.Beta;

export const StakingProgramContext = createContext<{
  activeStakingProgramId?: StakingProgramId | null;
  defaultStakingProgramId: StakingProgramId;
  updateActiveStakingProgramId: () => Promise<void>;
}>({
  activeStakingProgramId: undefined,
  defaultStakingProgramId: DEFAULT_STAKING_PROGRAM_ID,
  updateActiveStakingProgramId: async () => {},
});

/** Determines the current active staking program, if any */
export const StakingProgramProvider = ({ children }: PropsWithChildren) => {
  const { service } = useServices();

  const [activeStakingProgramId, setActiveStakingProgramId] =
    useState<StakingProgramId | null>();

  const updateActiveStakingProgramId = useCallback(async () => {
    // if no service nft, not staked
    const serviceId =
      service?.chain_configs[CHAINS.GNOSIS.chainId].chain_data?.token;

    if (!service?.chain_configs[CHAINS.GNOSIS.chainId].chain_data?.token) {
      setActiveStakingProgramId(null);
      return;
    }

    if (serviceId) {
      // if service exists, we need to check if it is staked
      AutonolasService.getCurrentStakingProgramByServiceId(serviceId).then(
        (stakingProgramId) => {
          setActiveStakingProgramId(stakingProgramId);
        },
      );
    }
  }, [service]);

  useInterval(updateActiveStakingProgramId, 5000);

  return (
    <StakingProgramContext.Provider
      value={{
        activeStakingProgramId,
        updateActiveStakingProgramId,
        defaultStakingProgramId: DEFAULT_STAKING_PROGRAM_ID,
      }}
    >
      {children}
    </StakingProgramContext.Provider>
  );
};
