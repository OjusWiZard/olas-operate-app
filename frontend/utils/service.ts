import { ServiceTemplate } from '@/types/middleware';
import { StakingProgramId } from '@/constants/stakingPrograms';

/** TODO: update from hardcoded, workaround for quick release */
export const getMinimumStakedAmountRequired = (
  serviceTemplate?: ServiceTemplate, //TODO: remove, as unused
  stakingProgramId: StakingProgramId = StakingProgramId.PearlBeta,
): number | undefined => {
  if (stakingProgramId === StakingProgramId.PearlAlpha) {
    return 20;
  }

  if (stakingProgramId === StakingProgramId.PearlBeta) {
    return 40;
  }

  if (stakingProgramId === StakingProgramId.PearlBeta2) {
    return 100;
  }

  if (stakingProgramId === StakingProgramId.PearlBetaMechMarketplace) {
    return 40;
  }

  return;
};
