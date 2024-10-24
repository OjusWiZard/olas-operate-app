import type { MiddlewareDeploymentStatus } from '@/client';
import { AgentType } from '@/enums/AgentType';
import {
  OptimusStakingProgramId,
  PredictStakingProgramId,
} from '@/enums/StakingProgramId';

import type { Service } from './Service';

type Agent = Service & {
  deploymentStatus: MiddlewareDeploymentStatus;
  serviceNftTokenId: number;
};

export type PredictTraderAgent = Agent & {
  readonly agentType: AgentType.PredictTrader;
  stakingProgramId: PredictStakingProgramId;
};

export type OptimusTraderAgent = Agent & {
  readonly agentType: AgentType.Optimus;
  stakingProgramId: OptimusStakingProgramId;
};

export type AgentInstance = PredictTraderAgent | OptimusTraderAgent;
