import { Contract as MulticallContract } from 'ethers-multicall';

import { CHAINS_BY_CHAIN_ID } from '@/constants/chains';

import { SERVICE_REGISTRY_TOKEN_UTILITY_CONTRACT_CONFIGS } from '../configs/service-registry-token-utility';

export const SERVICE_REGISTRY_TOKEN_UTILITY_CONTRACTS: {
  [chainId: keyof typeof CHAINS_BY_CHAIN_ID]: MulticallContract;
} = Object.keys(SERVICE_REGISTRY_TOKEN_UTILITY_CONTRACT_CONFIGS).reduce(
  (acc, chainId) => {
    if (!chainId) return acc;
    if (!Number.isFinite(+chainId)) return acc;
    if (!Number.isInteger(+chainId)) return acc;

    const { address, abi } =
      SERVICE_REGISTRY_TOKEN_UTILITY_CONTRACT_CONFIGS[+chainId];

    return {
      ...acc,
      [+chainId]: new MulticallContract(address, abi),
    };
  },
  {},
);
