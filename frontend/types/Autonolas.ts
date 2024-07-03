export type StakingRewardsInfo = {
  mechRequestCount: number;
  serviceInfo: unknown[];
  livenessPeriod: number;
  livenessRatio: number;
  rewardsPerSecond: number;
  isEligibleForRewards: boolean;
  availableRewardsForEpoch: number;
  unclaimedServiceStakingRewards: number;
  minimumStakedAmount: number;
};

export type StakingContractInfo = {
  availableRewards: number;
  maxNumServices: number;
  serviceIds: number[];
};
