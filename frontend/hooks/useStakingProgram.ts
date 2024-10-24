import { useContext, useMemo } from 'react';

import { MiddlewareChain } from '@/client';
import { STAKING_PROXY_ADDRESSES } from '@/constants/contractAddresses';
import { STAKING_PROGRAM_META } from '@/constants/stakingProgramMeta';
import { StakingProgramContext } from '@/context/StakingProgramProvider';

/**
 * Hook to get the active staking program and its metadata, and the default staking program.
 * @returns {Object} The active staking program and its metadata.
 */
export const useStakingProgram = () => {
  const {
    activeStakingProgramId,
    defaultStakingProgramId,
    updateActiveStakingProgramId,
  } = useContext(StakingProgramContext);

  const isActiveStakingProgramLoaded = activeStakingProgramId !== undefined;

  /**
   * TODO: implement enums
   * returns `StakingProgramMeta` if defined
   * returns `undefined` if not loaded
   * returns `null` if not actively staked
   */
  const activeStakingProgramMeta = useMemo(() => {
    if (activeStakingProgramId === undefined) return;
    if (activeStakingProgramId === null) return null;
    return STAKING_PROGRAM_META[activeStakingProgramId];
  }, [activeStakingProgramId]);

  const defaultStakingProgramMeta =
    STAKING_PROGRAM_META[defaultStakingProgramId];

  const activeStakingProgramAddress = useMemo(() => {
    if (!activeStakingProgramId) return;
    return STAKING_PROXY_ADDRESSES[MiddlewareChain.GNOSIS][
      activeStakingProgramId
    ];
  }, [activeStakingProgramId]);

  const defaultStakingProgramAddress =
    STAKING_PROXY_ADDRESSES[MiddlewareChain.GNOSIS][defaultStakingProgramId];

  return {
    activeStakingProgramAddress,
    activeStakingProgramId,
    activeStakingProgramMeta,
    defaultStakingProgramAddress,
    defaultStakingProgramId,
    defaultStakingProgramMeta,
    isActiveStakingProgramLoaded,
    updateActiveStakingProgramId,
  };
};
