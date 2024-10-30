import { CHAINS } from '@/constants/chains';

import { MULTICALL3_ABI } from '../abis/multicall3';

export const MULTICALL3_CONTRACT_CONFIGS = {
  [CHAINS.Gnosis.chainId]: {
    address: '0xcA11bde05977b3631167028862bE2a173976CA11',
    abi: MULTICALL3_ABI,
  },
  [CHAINS.Optimism.chainId]: {
    address: '0xcA11bde05977b3631167028862bE2a173976CA11',
    abi: MULTICALL3_ABI,
  },
};
