import { ethers } from 'ethers';

import {
  SERVICE_REGISTRY_L2_ADDRESSES,
  SERVICE_REGISTRY_TOKEN_UTILITY_ADDRESSES,
} from '@/constants/contractAddresses';

export class Registry {
  serviceRegistryL2?: ethers.Contract;
  serviceRegistryTokenUtility?: ethers.Contract;

  constructor({ chainId = 100 }: { chainId: number }) {
    this.serviceRegistryL2 = new ethers.Contract(
      SERVICE_REGISTRY_L2_ADDRESSES[chainId],
      '',
      new ethers.providers.StaticJsonRpcProvider(),
    );

    this.serviceRegistryTokenUtility = new ethers.Contract(
      SERVICE_REGISTRY_TOKEN_UTILITY_ADDRESSES[chainId],
      '',
      new ethers.providers.StaticJsonRpcProvider(),
    );
  }
}
