import { CHAINS, SupportedChainId } from '@/constants/chains';

import { SERVICE_REGISTRY_TOKEN_UTILITY_ABI } from '../abis/serviceRegistryTokenUtility';
import { ContractConfig } from './types';

export const SERVICE_REGISTRY_TOKEN_UTILITY_CONTRACT_CONFIGS: {
  [chainId: SupportedChainId]: ContractConfig;
} = {
  [CHAINS.GNOSIS.chainId]: {
    address: '0xa45E64d13A30a51b91ae0eb182e88a40e9b18eD8',
    abi: SERVICE_REGISTRY_TOKEN_UTILITY_ABI,
  },
};
