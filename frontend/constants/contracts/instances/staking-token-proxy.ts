import { Contract as MulticallContract } from 'ethers-multicall';

import { SupportedChainId } from '@/constants/chains';
import { StakingProgramId } from '@/constants/stakingPrograms';

import { STAKING_TOKEN_PROXY_CONTRACT_CONFIGS } from '../configs/staking-token-proxy';

export const STAKING_TOKEN_PROXY_CONTRACTS: {
  [chainId: SupportedChainId]: {
    [stakingProgramId: StakingProgramId]: MulticallContract;
  };
} = Object.keys(STAKING_TOKEN_PROXY_CONTRACT_CONFIGS).reduce((acc, chainId) => {
  if (!chainId) return acc;
  if (!Number.isFinite(+chainId)) return acc;
  if (!Number.isInteger(+chainId)) return acc;

  const stakingTokenProxyContractsForChainId = Object.keys(
    STAKING_TOKEN_PROXY_CONTRACT_CONFIGS[+chainId],
  ).reduce(
    (
      acc2: {
        [stakingProgramId: StakingProgramId]: MulticallContract;
      },
      stakingProgramId: StakingProgramId,
    ) => {
      const stakingTokenProxyContract =
        STAKING_TOKEN_PROXY_CONTRACT_CONFIGS[+chainId][stakingProgramId];

      if (!stakingTokenProxyContract) return acc2;

      const { address, abi } = stakingTokenProxyContract;
      return {
        ...acc2,
        [stakingProgramId]: new MulticallContract(address, abi),
      };
    },
    {},
  );

  return {
    ...acc,
    [+chainId as SupportedChainId]: stakingTokenProxyContractsForChainId,
  };
}, {});
