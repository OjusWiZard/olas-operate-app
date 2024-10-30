import { Contract as MulticallContract } from 'ethers-multicall';

import { SupportedChainId } from '@/constants/chains';

import { MULTICALL3_CONTRACT_CONFIGS } from '../configs/multicall3';

export const MULTICALL3_CONTRACTS: {
  [chainId: SupportedChainId]: MulticallContract;
} = Object.keys(MULTICALL3_CONTRACT_CONFIGS).reduce((acc, chainId) => {
  if (!chainId) return acc;
  if (!Number.isFinite(+chainId)) return acc;
  if (!Number.isInteger(+chainId)) return acc;

  const { address, abi } = MULTICALL3_CONTRACT_CONFIGS[+chainId];

  return {
    ...acc,
    [+chainId]: new MulticallContract(address, abi),
  };
}, {});
