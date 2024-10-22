import { StakingProgram } from './StakingProgram';

export abstract class Agent {
  stakingProgram: StakingProgram;

  constructor({ stakingProgram }: { stakingProgram: StakingProgram }) {
    this.stakingProgram = stakingProgram;
  }
}

export class PredictTraderAgent extends Agent {
  constructor({ stakingProgram }: { stakingProgram: StakingProgram }) {
    super({ stakingProgram });
  }
}

export class OptimusTraderAgent extends Agent {
  constructor({ stakingProgram }: { stakingProgram: StakingProgram }) {
    super({ stakingProgram });
  }
}
