import { Contract as MulticallContract } from 'ethers-multicall';

import { SupportedChainId } from '@/constants/chains';

import { STAKING_TOKEN_PROXY_CONTRACT_CONFIGS } from '../configs/staking-token-proxy';

export const STAKING_TOKEN_PROXY_CONTRACTS = Object.entries(
  STAKING_TOKEN_PROXY_CONTRACT_CONFIGS,
).reduce(
  (acc, [chainId, stakingTokenProxyConfigs]) => {
    if (!chainId) return acc;
    if (!Number.isFinite(+chainId)) return acc;
    if (!Number.isInteger(+chainId)) return acc;

    const stakingTokenProxyContractsForChainId = Object.entries(
      stakingTokenProxyConfigs,
    ).reduce((acc2, [stakingProgramId, stakingTokenProxyConfig]) => {
      const stakingTokenProxyContractConfig = stakingTokenProxyConfig;

      if (!stakingTokenProxyContractConfig) return acc2;

      const { address, abi } = stakingTokenProxyContractConfig;
      return {
        ...acc2,
        [stakingProgramId]: new MulticallContract(address, abi),
      };
    }, {});

    return {
      ...acc,
      [+chainId as SupportedChainId]: stakingTokenProxyContractsForChainId,
    };
  },
  {} as {
    [chainId: number]: {
      [stakingProgramId: string]: MulticallContract;
    };
  },
);
