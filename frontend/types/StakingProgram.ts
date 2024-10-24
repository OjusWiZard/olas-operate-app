import { ethers } from 'ethers';

import { AgentType } from '@/enums/AgentType';
import { ChainId } from '@/enums/ChainId';
import { MechType } from '@/enums/MechType';
import {
  OptimusStakingProgramId,
  PredictStakingProgramId,
} from '@/enums/StakingProgramId';
import { StakingProgramStatus } from '@/enums/StakingProgramStatus';

import { Address } from './Address';
import { Mech } from './Mech';
import { Registry } from './Registry';

export type StakingProgramId =
  | PredictStakingProgramId
  | OptimusStakingProgramId;

export type StakingProgramConfig = {
  canMigrateTo: StakingProgramId[];
  chainId: ChainId;
  isEnoughSlots?: boolean;
  mech: MechType;
  name: string;
  requiredOlasForStaking: number;
  rewardsPerWorkPeriod: number;
  stakingProgramId: StakingProgramId;
  stakingProxy: Address;
  status: StakingProgramStatus;
  supportedAgents: AgentType[];
};

export type StakingProgram = StakingProgramConfig & {
  mech: Mech;
  registry: Registry;
  stakingProxy: ethers.Contract;
};
