import { ChainId } from '@/constants/chains';
import { Address } from '@/types/Address';

export abstract class Account {
  address: Address;

  constructor({ address }: { address: Address }) {
    this.address = address;
  }
}

export class EOA extends Account {}

export class Safe extends Account {
  owners: Address[];
  chainId: ChainId;

  constructor({
    address,
    owners,
    chainId,
  }: {
    address: Address;
    owners: Address[];
    chainId: ChainId;
  }) {
    super({ address });
    this.owners = owners;
    this.chainId = chainId;
  }
}
