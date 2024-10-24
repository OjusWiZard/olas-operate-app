export type ElectronStore = {
  agentEvictionAlertShown?: boolean;
  environmentName?: string;
  firstRewardNotificationShown?: boolean;
  firstStakingRewardAchieved?: boolean;
  isInitialFunded?: boolean;
};

export type ElectronTrayIconStatus =
  | 'low-gas'
  | 'running'
  | 'paused'
  | 'logged-out';
