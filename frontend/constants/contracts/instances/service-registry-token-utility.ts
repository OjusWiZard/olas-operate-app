import { Contract as MulticallContract } from 'ethers-multicall';

import { SERVICE_REGISTRY_TOKEN_UTILITY_CONTRACT_CONFIGS } from '../configs/service-registry-token-utility';

export const SERVICE_REGISTRY_TOKEN_UTILITY_CONTRACTS = Object.entries(
  SERVICE_REGISTRY_TOKEN_UTILITY_CONTRACT_CONFIGS,
).reduce(
  (acc, [chainId, { address, abi }]) => {
    if (!chainId) return acc;
    if (!Number.isFinite(+chainId)) return acc;
    if (!Number.isInteger(+chainId)) return acc;

    return {
      ...acc,
      [+chainId]: new MulticallContract(address, abi),
    };
  },
  {} as {
    [chainId: number]: MulticallContract;
  },
);
