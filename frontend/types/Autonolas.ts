export type StakingRewardsInfo = {
  mechRequestCount: number;
  serviceInfo: unknown[];
  livenessPeriod: number;
  livenessRatio: number;
  rewardsPerSecond: number;
  isEligibleForRewards: boolean;
  availableRewardsForEpoch: number;
  accruedServiceStakingRewards: number;
  minimumStakedAmount: number;
};

export type StakingContractInfo = {
  availableRewards: number;
  maxNumServices: number;
  serviceIds: number[];
  minStakingDuration: number;
  /** time when service was staked */
  serviceStakingTime: number;
  /** 0: not staked, 1: staked, 2: unstaked - current state of the service */
  serviceStakingState: number;
};
