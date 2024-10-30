import { Contract as MulticallContract } from 'ethers-multicall';

import { StakingProgramId } from '@/constants/stakingPrograms';

import { STAKING_TOKEN_PROXY_CONTRACT_CONFIGS } from '../configs/staking-token-proxy';

export const STAKING_TOKEN_PROXY_CONTRACTS: {
  [chainId: number]: {
    [stakingProgramId: StakingProgramId]: MulticallContract;
  };
} = Object.keys(STAKING_TOKEN_PROXY_CONTRACT_CONFIGS).reduce((acc, chainId) => {
  if (!chainId) return acc;
  if (!Number.isFinite(+chainId)) return acc;
  if (!Number.isInteger(+chainId)) return acc;

  return {
    ...acc,
    [+chainId]: Object.keys(
      STAKING_TOKEN_PROXY_CONTRACT_CONFIGS[+chainId],
    ).reduce((acc2, stakingProgramId) => {
      const { address, abi } =
        STAKING_TOKEN_PROXY_CONTRACT_CONFIGS[+chainId][stakingProgramId];
      return {
        ...acc2,
        [stakingProgramId]: new MulticallContract(address, abi),
      };
    }, {}),
  };
}, {});
