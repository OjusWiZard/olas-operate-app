import { CHAINS, SupportedChainId } from '@/constants/chains';

import { MULTICALL3_ABI } from '../abis/multicall3';
import { ContractConfig } from './types';

export const MULTICALL3_CONTRACT_CONFIGS: {
  [chainId: SupportedChainId]: ContractConfig;
} = {
  [CHAINS.GNOSIS.chainId]: {
    address: '0xcA11bde05977b3631167028862bE2a173976CA11',
    abi: MULTICALL3_ABI,
  },
  [CHAINS.OPTIMISM.chainId]: {
    address: '0xcA11bde05977b3631167028862bE2a173976CA11',
    abi: MULTICALL3_ABI,
  },
};
