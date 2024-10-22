import { ethers } from 'ethers';

import { Address } from '@/types/Address';

export abstract class NFT {
  tokenId: number;
  contract: ethers.Contract;
  constructor({
    tokenId,
    address,
    abi,
    provider,
  }: {
    tokenId: number;
    address: Address;
    abi: ethers.ContractInterface;
    provider: ethers.providers.Provider;
  }) {
    this.tokenId = tokenId;
    this.contract = new ethers.Contract(address, abi, provider);
  }
}

export class ServiceNFT extends NFT {
  constructor({
    tokenId,
    address,
    provider,
  }: {
    tokenId: number;
    address: Address;
    provider: ethers.providers.Provider;
  }) {
    super({
      tokenId,
      address,
      // @eslint-disable-next-line
      abi: any,
      provider,
    });
    this.tokenId = tokenId;
    this.contract = new ethers.Contract(address, abi, provider);
  }
}
