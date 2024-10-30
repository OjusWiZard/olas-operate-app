import { Contract as MulticallContract } from 'ethers-multicall';

import { MULTICALL3_CONTRACT_CONFIGS } from '../configs/multicall3';

export const MULTICALL3_CONTRACTS = Object.entries(
  MULTICALL3_CONTRACT_CONFIGS,
).reduce(
  (acc, [chainId, { abi, address }]) => {
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
