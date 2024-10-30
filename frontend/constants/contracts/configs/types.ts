import { JsonFragment } from '@ethersproject/abi';

import { Address } from '@/types/Address';

export type ContractConfig = {
  address: Address;
  abi: JsonFragment[];
};
