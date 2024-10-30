import { Contract as MulticallContract } from 'ethers-multicall';

import { SERVICE_REGISTRY_L2_CONTRACT_CONFIGS } from '../configs/service-registry-l2';

export const SERVICE_REGISTRY_L2_CONTRACTS: {
  [chainId: number]: MulticallContract;
} = Object.keys(SERVICE_REGISTRY_L2_CONTRACT_CONFIGS).reduce((acc, chainId) => {
  if (!chainId) return acc;
  if (!Number.isFinite(+chainId)) return acc;
  if (!Number.isInteger(+chainId)) return acc;

  return {
    ...acc,
    [+chainId]: new MulticallContract(
      SERVICE_REGISTRY_L2_CONTRACT_CONFIGS[+chainId].address,
      SERVICE_REGISTRY_L2_CONTRACT_CONFIGS[+chainId].abi,
    ),
  };
}, {});
