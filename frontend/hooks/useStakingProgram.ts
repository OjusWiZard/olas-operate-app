import { useContext, useMemo } from 'react';

import { MiddlewareChain } from '@/types/middleware';
import { SERVICE_STAKING_TOKEN_MECH_USAGE_CONTRACT_ADDRESSES } from '@/constants/contracts/config';
import { STAKING_PROGRAMS } from '@/constants/stakingPrograms';
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
    return STAKING_PROGRAMS[activeStakingProgramId];
  }, [activeStakingProgramId]);

  const defaultStakingProgramMeta =
    STAKING_PROGRAMS[defaultStakingProgramId];

  const activeStakingProgramAddress = useMemo(() => {
    if (!activeStakingProgramId) return;
    return SERVICE_STAKING_TOKEN_MECH_USAGE_CONTRACT_ADDRESSES[MiddlewareChain.GNOSIS][
      activeStakingProgramId
    ];
  }, [activeStakingProgramId]);

  const defaultStakingProgramAddress =
    SERVICE_STAKING_TOKEN_MECH_USAGE_CONTRACT_ADDRESSES[MiddlewareChain.GNOSIS][
      defaultStakingProgramId
    ];

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
