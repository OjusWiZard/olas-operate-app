import { CHAINS } from '@/constants/chains';

import { SERVICE_REGISTRY_L2_ABI } from '../abis/serviceRegistryL2';

export const SERVICE_REGISTRY_L2_CONTRACT_CONFIGS = {
  [CHAINS.Gnosis.chainId]: {
    address: '0x9338b5153AE39BB89f50468E608eD9d764B755fD',
    abi: SERVICE_REGISTRY_L2_ABI,
  },
};
