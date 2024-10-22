import { ethers } from 'ethers';

import { ChainId } from '@/constants/chains';
import { STAKING_PROXY_ADDRESSES } from '@/constants/contractAddresses';
import { MECHS } from '@/entities/mechs';
import { REGISTRIES } from '@/entities/registries';
import { AgentType } from '@/enums/AgentType';
import { MechType } from '@/enums/MechType';
import { StakingProgramId } from '@/enums/StakingProgram';
import { Address } from '@/types/Address';

import { MechMarketplace, MechStandard } from './Mech';
import { Registry } from './Registry';

export class StakingProgram {
  chainId: ChainId;
  stakingProgramId: StakingProgramId;
  stakingProxyAddress: Address;
  contract?: ethers.Contract;
  mech: MechStandard | MechMarketplace;
  registry: Registry;
  supportedAgents: AgentType[] = [];
  canMigrateTo: StakingProgramId[] = [];

  constructor({
    chainId,
    stakingProgramId,
    supportedAgents,
    mechType,
    canMigrateTo,
  }: {
    chainId: ChainId;
    stakingProgramId: StakingProgramId;
    supportedAgents: AgentType[];
    mechType: MechType;
    canMigrateTo: StakingProgramId[];
  }) {
    this.chainId = chainId;
    this.stakingProgramId = stakingProgramId;
    this.stakingProxyAddress =
      STAKING_PROXY_ADDRESSES[chainId][stakingProgramId];
    this.supportedAgents = supportedAgents;
    this.mech = MECHS[chainId][mechType];
    this.registry = REGISTRIES[chainId];
    this.canMigrateTo = canMigrateTo;
  }
}
