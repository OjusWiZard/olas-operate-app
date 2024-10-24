import { ethers } from 'ethers';

import { ChainId } from '@/constants/chains';
import { MechType } from '@/enums/MechType';

export type MechActivityChecker = {
  chainId: ChainId;
  contract: ethers.Contract;
  mechType: MechType.Agent;
};

export type Mech = {
  activityChecker: MechActivityChecker;
  chainId: ChainId;
  contract: ethers.Contract;
  readonly mechType: MechType.Agent;
};

export type MechMarketplaceActivityChecker = {
  chainId: ChainId;
  contract: ethers.Contract;
  mechType: MechType.Marketplace;
};

export type MechMarketplace = {
  activityChecker: MechMarketplaceActivityChecker;
  chainId: ChainId;
  contract: ethers.Contract;
  readonly mechType: MechType.Marketplace;
};
