import { Contract, Event } from 'ethers';
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useInterval } from 'usehooks-ts';

import { STAKING_TOKEN_PROXY_ABI } from '@/abis/stakingTokenProxy';
import { Chain } from '@/client';
import { CHAINS } from '@/constants/chains';
import { STAKING_TOKEN_PROXY_ADDRESS } from '@/constants/contractAddresses';
import { StakingProgramId } from '@/enums/StakingProgram';
import { useServices } from '@/hooks/useServices';
import { useSystemNotification } from '@/hooks/useSystemNotification';
import { AutonolasService } from '@/service/contract/Autonolas';

export const StakingProgramContext = createContext<{
  activeStakingProgramId?: StakingProgramId | null;
  defaultStakingProgramId: StakingProgramId;
  updateActiveStakingProgramId: () => Promise<void>;
}>({
  activeStakingProgramId: undefined,
  defaultStakingProgramId: StakingProgramId.Beta,
  updateActiveStakingProgramId: async () => {},
});

/** Determines the current active staking program, if any */
export const StakingProgramProvider = ({ children }: PropsWithChildren) => {
  const { service } = useServices();
  const { systemNotify } = useSystemNotification();

  const [activeStakingProgramId, setActiveStakingProgramId] =
    useState<StakingProgramId | null>();

  const [activeStakingProgramEpoch, setActiveStakingProgramEpoch] =
    useState<number>();

  const activeStakingProgramContract = useMemo(
    () =>
      activeStakingProgramId
        ? new Contract(
            STAKING_TOKEN_PROXY_ADDRESS[Chain.GNOSIS][activeStakingProgramId],
            STAKING_TOKEN_PROXY_ABI,
          )
        : null,
    [activeStakingProgramId],
  );

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

  useEffect(() => {
    // Listens for new epochs, updates states, and notifies the user if appropriate
    if (!activeStakingProgramContract) return;

    activeStakingProgramContract.on('Checkpoint', (event: Event) => {
      const epoch = event.args?.epoch.toNumber();

      // first time setting epoch
      if (!activeStakingProgramEpoch) {
        setActiveStakingProgramEpoch(epoch);
        return;
      }

      // invalid epoch
      if (epoch <= activeStakingProgramEpoch) return;

      // notify user of new epoch
      systemNotify(
        `New staking epoch`,
        `Start your agent to avoid eviction and missing rewards.`,
      );
      setActiveStakingProgramEpoch(event.args?.epoch.toNumber());
    });

    return () => {
      activeStakingProgramContract.removeAllListeners('Checkpoint');
    };
  }, [activeStakingProgramContract, activeStakingProgramEpoch, systemNotify]);

  return (
    <StakingProgramContext.Provider
      value={{
        activeStakingProgramId,
        updateActiveStakingProgramId,
        defaultStakingProgramId: StakingProgramId.Beta,
      }}
    >
      {children}
    </StakingProgramContext.Provider>
  );
};
