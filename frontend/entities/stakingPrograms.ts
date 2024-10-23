import { AgentType } from '@/enums/AgentType';
import { MechType } from '@/enums/MechType';
import { StakingProgramId } from '@/enums/StakingProgram';
import { StakingProgram } from '@/models/StakingProgram';

import { ChainId } from '../constants/chains';

// export const STAKING_PROGRAMS = {
//   [StakingProgramId.Alpha]: {
//     chainId: ChainId.GNOSIS,
//     contracts: {
//       registry: {
//         serviceRegistryTokenUtility:
//           SERVICE_REGISTRY_TOKEN_UTILITY_ADDRESSES[ChainId.GNOSIS],
//         serviceRegistryL2: SERVICE_REGISTRY_L2_ADDRESSES[ChainId.GNOSIS],
//       },
//       mechs: {
//         [MechType.STANDARD]: {
//           address: AGENT_MECH_ADDRESSES[ChainId.GNOSIS][MechType.STANDARD],
//           activityChecker:
//             MECH_ACTIVITY_CHECKER_ADDRESSES[ChainId.GNOSIS][MechType.STANDARD],
//         },
//       },
//       stakingProxy:
//         STAKING_PROXY_ADDRESSES[ChainId.GNOSIS][StakingProgramId.Alpha],
//     },
//   },
//   [StakingProgramId.Beta]: {
//     chainId: ChainId.GNOSIS,
//     contracts: {
//       registry: {
//         serviceRegistryTokenUtility:
//           SERVICE_REGISTRY_TOKEN_UTILITY_ADDRESSES[ChainId.GNOSIS],
//         serviceRegistryL2: SERVICE_REGISTRY_L2_ADDRESSES[ChainId.GNOSIS],
//       },
//       mechs: {
//         [MechType.STANDARD]: {
//           address: AGENT_MECH_ADDRESSES[ChainId.GNOSIS][MechType.STANDARD],
//           activityChecker:
//             MECH_ACTIVITY_CHECKER_ADDRESSES[ChainId.GNOSIS][MechType.STANDARD],
//         },
//       },
//       stakingProxy:
//         STAKING_PROXY_ADDRESSES[ChainId.GNOSIS][StakingProgramId.Beta],
//     },
//   },
//   [StakingProgramId.Beta2]: {
//     chainId: ChainId.GNOSIS,
//     contracts: {
//       mechs: {
//         [MechType.STANDARD]: {
//           address: AGENT_MECH_ADDRESSES[ChainId.GNOSIS][MechType.STANDARD],
//           activityChecker:
//             MECH_ACTIVITY_CHECKER_ADDRESSES[ChainId.GNOSIS][MechType.STANDARD],
//         },
//       },
//       registry: {
//         serviceRegistryTokenUtility:
//           SERVICE_REGISTRY_TOKEN_UTILITY_ADDRESSES[ChainId.GNOSIS],
//         serviceRegistryL2: SERVICE_REGISTRY_L2_ADDRESSES[ChainId.GNOSIS],
//       },
//     },
//   },
// };

const predict_pearlBeta = new StakingProgram({
  chainId: ChainId.GNOSIS,
  stakingProgramId: StakingProgramId.Beta,
  canMigrateTo: [StakingProgramId.Beta2, StakingProgramId.MechMarketplace],
  mechType: MechType.STANDARD,
  supportedAgentTypes: [AgentType.PredictTrader],
});

const predict_pearlBeta2 = new StakingProgram({
  chainId: ChainId.GNOSIS,
  stakingProgramId: StakingProgramId.Beta2,
  canMigrateTo: [StakingProgramId.Beta, StakingProgramId.MechMarketplace],
  mechType: MechType.STANDARD,
  supportedAgentTypes: [AgentType.PredictTrader],
});

const predict_pearlAlpha = new StakingProgram({
  chainId: ChainId.GNOSIS,
  stakingProgramId: StakingProgramId.Alpha,
  canMigrateTo: [
    StakingProgramId.Beta2,
    StakingProgramId.Beta,
    StakingProgramId.MechMarketplace,
  ],
  mechType: MechType.STANDARD,
  supportedAgentTypes: [AgentType.PredictTrader],
});

const predict_pearlMechMarketplace = new StakingProgram({
  chainId: ChainId.GNOSIS,
  stakingProgramId: StakingProgramId.MechMarketplace,
  canMigrateTo: [
    StakingProgramId.Beta2,
    StakingProgramId.Beta,
    StakingProgramId.MechMarketplace,
  ],
  mechType: MechType.MARKETPLACE,
  supportedAgentTypes: [AgentType.PredictTrader],
});

export const stakingPrograms: {
  [stakingProgramId: string]: StakingProgram;
} = {
  [StakingProgramId.Alpha]: predict_pearlAlpha,
  [StakingProgramId.Beta]: predict_pearlBeta,
  [StakingProgramId.Beta2]: predict_pearlBeta2,
  [StakingProgramId.MechMarketplace]: predict_pearlMechMarketplace,
};
