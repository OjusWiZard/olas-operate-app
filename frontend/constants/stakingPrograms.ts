import { CHAINS } from './chains';

export const STAKING_PROGRAM_IDS: {
  [stakingProgramName: string]: string;
} = {
  PearlAlpha: 'pearl_alpha',
  PearlBeta: 'pearl_beta',
  PearlBeta2: 'pearl_beta_2',
  PearlBetaMechMarketplace: 'pearl_beta_mech_marketplace',
  OptimusAlpha: 'optimus_alpha',
};

export type StakingProgramId = keyof typeof STAKING_PROGRAM_IDS;

export type StakingProgram = {
  name: string;
  canMigrateTo: string[];
  deprecated: boolean;
};

export const STAKING_PROGRAMS: Partial<{
  [chainId: number]: Partial<{
    [stakingProgramId in keyof typeof STAKING_PROGRAM_IDS]: Partial<StakingProgram>;
  }>;
}> = {
  [CHAINS.GNOSIS.chainId]: {
    [STAKING_PROGRAM_IDS.PearlAlpha]: {
      name: 'Pearl Alpha',
      canMigrateTo: [
        STAKING_PROGRAM_IDS.PearlBeta,
        STAKING_PROGRAM_IDS.PearlBeta2,
        STAKING_PROGRAM_IDS.PearlBetaMechMarketplace,
      ],
      deprecated: true,
    },
    [STAKING_PROGRAM_IDS.PearlBeta]: {
      name: 'Pearl Beta',
      canMigrateTo: [
        STAKING_PROGRAM_IDS.PearlBeta2,
        STAKING_PROGRAM_IDS.PearlBetaMechMarketplace,
      ],
      deprecated: false,
    },
    [STAKING_PROGRAM_IDS.PearlBeta2]: {
      name: 'Pearl Beta 2',
      canMigrateTo: [
        STAKING_PROGRAM_IDS.PearlBeta,
        STAKING_PROGRAM_IDS.PearlBetaMechMarketplace,
      ],
      deprecated: false,
    },
    [STAKING_PROGRAM_IDS.PearlBetaMechMarketplace]: {
      name: 'Pearl Beta Mech Marketplace',
      canMigrateTo: [
        STAKING_PROGRAM_IDS.PearlBeta,
        STAKING_PROGRAM_IDS.PearlBeta2,
      ],
      deprecated: false,
    },
  },
  [CHAINS.OPTIMISM.chainId]: {
    [STAKING_PROGRAM_IDS.OptimusAlpha]: {
      name: 'Optimus Alpha',
      canMigrateTo: [],
      deprecated: false,
    },
  },
};
