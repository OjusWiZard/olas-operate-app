import { CHAINS, SupportedChainId } from '@/constants/chains';

import { SERVICE_REGISTRY_L2_ABI } from '../abis/serviceRegistryL2';
import { ContractConfig } from './types';

export const SERVICE_REGISTRY_L2_CONTRACT_CONFIGS: {
  [chainId: SupportedChainId]: ContractConfig;
} = {
  [CHAINS.GNOSIS.chainId]: {
    address: '0x9338b5153AE39BB89f50468E608eD9d764B755fD',
    abi: SERVICE_REGISTRY_L2_ABI,
  },
};
