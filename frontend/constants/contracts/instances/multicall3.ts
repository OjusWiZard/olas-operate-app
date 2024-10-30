import { Contract as MulticallContract } from 'ethers-multicall';

import { MULTICALL3_ABI } from '../abis/multicall3';
import { MULTICALL3_CONTRACT_CONFIGS } from '../configs/multicall3';

export const MULTICALL3_CONTRACTS = Object.keys(
  MULTICALL3_CONTRACT_CONFIGS,
).reduce((acc, chainId) => {
  if (!chainId) return acc;
  if (!Number.isFinite(+chainId)) return acc;
  if (!Number.isInteger(+chainId)) return acc;

  return {
    ...acc,
    [+chainId]: new MulticallContract(
      MULTICALL3_CONTRACT_CONFIGS[+chainId],
      MULTICALL3_ABI,
    ),
  };
}, {});
