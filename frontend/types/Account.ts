import { Address } from './Address';

type Account = {
  address: Address;
};

export type EOA = Account;

export type Safe = Account & {
  chainId: number;
  owners: Address[];
};
