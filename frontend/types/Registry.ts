import { ethers } from 'ethers';

import { Address } from './Address';

export type RegistryConfig = {
  chainId: number;
  serviceRegistry?: Address;
  serviceRegistryL2?: Address;
  serviceRegistryTokenUtility: Address;
};

export type Registry = RegistryConfig & {
  serviceRegistry?: ethers.Contract;
  serviceRegistryL2?: ethers.Contract;
  serviceRegistryTokenUtility: ethers.Contract;
};
