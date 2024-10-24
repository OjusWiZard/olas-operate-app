import { AgentType } from '@/enums/AgentType';
import {
  OptimusStakingProgramId,
  PredictStakingProgramId,
} from '@/enums/StakingProgramId';

type Agent = {
  agentType: AgentType;
};

export type PredictTraderAgent = Agent & {
  readonly agentType: AgentType.PredictTrader;
  stakingProgramId: PredictStakingProgramId;
};

export type OptimusTraderAgent = Agent & {
  readonly agentType: AgentType.Optimus;
  stakingProgramId: OptimusStakingProgramId;
};
