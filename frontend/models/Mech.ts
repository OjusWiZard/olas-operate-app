import { ethers } from 'ethers';

import { AGENT_MECH_ABI } from '@/abis/agentMech';
import { ChainId } from '@/constants/chains';
import { Address } from '@/types/Address';

export abstract class Mech {
  chainId: number | ChainId;
  address: Address;
  activityChecker: Address;
  contract?: ethers.Contract;

  constructor({
    chainId,
    address,
    activityChecker,
  }: {
    chainId: number;
    address: Address;
    activityChecker: Address;
  }) {
    this.chainId = chainId;
    this.address = address;
    this.activityChecker = activityChecker;
  }
}

/**
 * Standard centralized Mech
 */
export class MechStandard extends Mech {
  abi = AGENT_MECH_ABI;
  constructor({
    chainId,
    address,
    activityChecker,
  }: {
    chainId: number;
    address: Address;
    activityChecker: Address;
  }) {
    super({ chainId, address, activityChecker });

    this.contract = new ethers.Contract(
      address,
      this.abi,
      new ethers.providers.StaticJsonRpcProvider(),
    );
  }
}

/**
 * Decentralized Mech marketplace
 */
export class MechMarketplace extends Mech {
  abi = AGENT_MECH_ABI; // @TODO: update with marketplace ABI
  constructor({
    chainId,
    address,
    activityChecker,
  }: {
    chainId: number;
    address: Address;
    activityChecker: Address;
  }) {
    super({ chainId, address, activityChecker });

    this.contract = new ethers.Contract(
      address,
      this.abi,
      new ethers.providers.StaticJsonRpcProvider(),
    );
  }
}
