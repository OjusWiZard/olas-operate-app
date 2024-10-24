export type StakingRewardsInfo = {
  accruedServiceStakingRewards: number;
  availableRewardsForEpoch: number;
  isEligibleForRewards: boolean;
  livenessPeriod: number;
  livenessRatio: number;
  mechRequestCount: number;
  minimumStakedAmount: number;
  rewardsPerSecond: number;
  serviceInfo: unknown[];
};

export type StakingContractInfo = {
  /** estimated annual percentage yield */
  apy: number;
  availableRewards: number;
  maxNumServices: number;
  /** OLAS cost of staking */
  minStakingDeposit: number;
  /** minimum staking duration (in seconds) */
  minimumStakingDuration: number;
  /** amount of OLAS required to stake */
  olasStakeRequired: number;
  /** rewards per work period */
  rewardsPerWorkPeriod: number;
  serviceIds: number[];
  /** time when service was staked (in seconds) - 0 = never staked */
  serviceStakingStartTime: number;
  /** 0: not staked, 1: staked, 2: unstaked - current state of the service */
  serviceStakingState: number;
};
