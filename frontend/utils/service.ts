import { MiddlewareServiceTemplate } from '@/client';
import { StakingProgramId } from '@/enums/StakingProgram';

/** TODO: update from hardcoded, workaround for quick release */
export const getMinimumStakedAmountRequired = (
  serviceTemplate?: MiddlewareServiceTemplate, //TODO: remove, as unused
  stakingProgramId: StakingProgramId = StakingProgramId.Beta,
): number | undefined => {
  if (stakingProgramId === StakingProgramId.Alpha) {
    return 20;
  }

  if (stakingProgramId === StakingProgramId.Beta) {
    return 40;
  }

  if (stakingProgramId === StakingProgramId.Beta2) {
    return 100;
  }

  return;
};
